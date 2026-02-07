package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// SRP Structures
type SRPOutput struct {
	Success     bool            `json:"success"`
	Summary     string          `json:"summary"`
	Diagnostics []SRPDiagnostic `json:"diagnostics"`
	Tests       []SRPTest       `json:"tests"`
	Raw         string          `json:"raw"`
}

type SRPDiagnostic struct {
	Severity string  `json:"severity"` // "error", "warning"
	Message  string  `json:"message"`
	File     *string `json:"file,omitempty"`
	Line     *int    `json:"line,omitempty"`
	Snippet  *string `json:"snippet,omitempty"`
}

type SRPTest struct {
	Name    string  `json:"name"`
	Status  string  `json:"status"` // "pass", "fail"
	Message *string `json:"message,omitempty"`
}

// Go Test JSON Event
type GoTestEvent struct {
	Time    time.Time `json:"Time"`
	Action  string    `json:"Action"`
	Package string    `json:"Package"`
	Test    string    `json:"Test"`
	Output  string    `json:"Output"`
	Elapsed float64   `json:"Elapsed"`
}

func main() {
	if len(os.Args) < 3 || os.Args[1] != "test" {
		fmt.Println("Usage: runner test <path>")
		os.Exit(1)
	}

	targetPath := os.Args[2]
	absPath, err := filepath.Abs(targetPath)
	if err != nil {
		fatalError(fmt.Sprintf("Invalid path: %v", err))
	}

	// Go modules check
	if _, err := os.Stat(filepath.Join(absPath, "go.mod")); os.IsNotExist(err) {
		// Init go mod if not exists (simple fallback)
		cmd := exec.Command("go", "mod", "init", "exercise")
		cmd.Dir = absPath
		cmd.Run()
	}

	// Run go test -json
	cmd := exec.Command("go", "test", "-json", ".")
	cmd.Dir = absPath
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	success := err == nil

	// Parse Output
	srp := SRPOutput{
		Success:     success,
		Diagnostics: []SRPDiagnostic{},
		Tests:       []SRPTest{},
		Raw:         stdout.String() + "\n" + stderr.String(),
	}

	scanner := bufio.NewScanner(&stdout)
	for scanner.Scan() {
		line := scanner.Text()
		var event GoTestEvent
		if err := json.Unmarshal([]byte(line), &event); err == nil {
			if event.Action == "fail" || event.Action == "pass" {
				if event.Test != "" {
					status := "pass"
					if event.Action == "fail" {
						status = "fail"
						srp.Success = false 
					}
					srp.Tests = append(srp.Tests, SRPTest{
						Name:   event.Test,
						Status: status,
					})
				}
			}
			// Build failure often comes as unrelated Output lines or separate structure usually in build output
            // For simple go test -json, build errors are in "Output" of "Action": "output" usually at start
		}
	}

    // Capture build errors from stderr or output if no tests ran
    if !success && len(srp.Tests) == 0 {
        srp.Summary = "Compilation or Test Execution Failed"
        // Rough parsing of stderr for diagnostics
        errLines := strings.Split(stderr.String(), "\n")
        for _, l := range errLines {
             if strings.Contains(l, ":") { // simplistic file:line check
                 srp.Diagnostics = append(srp.Diagnostics, SRPDiagnostic{
                     Severity: "error",
                     Message: l,
                 })
             }
        }
    } else if success {
        srp.Summary = "All tests passed"
    } else {
        srp.Summary = "Some tests failed"
    }

	printSRP(srp)
}

func fatalError(msg string) {
	printSRP(SRPOutput{
		Success: false,
		Summary: msg,
	})
	os.Exit(1)
}

func printSRP(output SRPOutput) {
	fmt.Println("__SRP_BEGIN__")
	bytes, _ := json.MarshalIndent(output, "", "  ")
	fmt.Println(string(bytes))
	fmt.Println("__SRP_END__")
}
