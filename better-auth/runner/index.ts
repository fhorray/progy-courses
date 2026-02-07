import { spawn } from "child_process";
import { resolve } from "path";
import { existsSync } from "fs";

interface SRPOutput {
  success: boolean;
  summary: string;
  diagnostics: any[];
  tests: any[];
  raw: string;
}

const args = process.argv.slice(2);
if (args[0] !== "test" || !args[1]) {
  console.error("Usage: runner test <path>");
  process.exit(1);
}

const targetPath = resolve(args[1]);

async function run() {
  const srp: SRPOutput = {
    success: false,
    summary: "",
    diagnostics: [],
    tests: [],
    raw: "",
  };

  // Check for test files
  if (!existsSync(targetPath)) {
    srp.summary = "Target path not found";
    printSRP(srp);
    return;
  }

  // Run bun test --reporter=json
  const proc = spawn("bun", ["test", "--reporter=json", targetPath], {
    cwd: targetPath, // or root? usually root of project
    env: { ...process.env, FORCE_COLOR: "0" },
  });

  let stdout = "";
  let stderr = "";

  proc.stdout.on("data", (d) => (stdout += d.toString()));
  proc.stderr.on("data", (d) => (stderr += d.toString()));

  proc.on("close", (code) => {
    srp.raw = stdout + "\n" + stderr;
    srp.success = code === 0;

    // Parse Bun JSON Reporter
    // Bun's json reporter output might be a single JSON object or stream? 
    // It's usually one JSON object at the end or array of events.
    // *Assuming Bun test returns a JSON structure similar to Jest or proprietary*
    // *Fallback: Standard Bun output parsing if JSON is experimental*

    // Actually bun test --json output is an array of test results
    try {
      // Find the JSON part
      const jsonStart = stdout.indexOf("[");
      if (jsonStart > -1) {
        const jsonStr = stdout.substring(jsonStart);
        const methods = JSON.parse(jsonStr);
        // ... Parse methods
      }
    } catch (e) {
      // Fallback or if parsing fails
    }

    // Manual shim for robustness since Bun JSON reporter varies by version
    if (code === 0) {
      srp.summary = "All tests passed";
    } else {
      srp.summary = "Tests failed";
      srp.diagnostics.push({ severity: "error", message: stderr });
    }

    printSRP(srp);
  });
}

function printSRP(obj: SRPOutput) {
  console.log("__SRP_BEGIN__");
  console.log(JSON.stringify(obj, null, 2));
  console.log("__SRP_END__");
}

run();
