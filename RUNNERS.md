# Progy Runner Implementation Guide

Runners are the core component that executes student code and provides feedback. Progy uses a **Single Responsibility Principle (SRP)** pattern where the runner is responsible for:
1.  Running the exercise code.
2.  Running tests/verifications.
3.  Outputting a standardized JSON result.

## SRP Protocol

The runner **MUST** output a JSON object wrapped in specific markers to stdout:

```
__SRP_BEGIN__
{
  "success": true,
  "summary": "All tests passed!",
  "diagnostics": [],
  "tests": [
    { "name": "Test 1", "status": "pass", "message": "..." }
  ],
  "raw": "..."
}
__SRP_END__
```

### JSON Structure

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | `true` if the exercise is solved, `false` otherwise. |
| `summary` | `string` | A brief summary of the result (e.g., "Compilation Failed", "2/3 Tests Passed"). |
| `diagnostics` | `array` | List of compiler/linter errors. |
| `tests` | `array` | List of individual test results. |
| `raw` | `string` | The raw stdout/stderr from the underlying tools (useful for debugging). |

#### Diagnostic Object
```json
{
  "severity": "error", // or "warning"
  "message": "Syntax error: unexpected token",
  "file": "main.rs", // optional
  "line": 10,        // optional
  "snippet": "..."   // optional code snippet
}
```

#### Test Object
```json
{
  "name": "Check function add",
  "status": "pass", // "pass" or "fail"
  "message": "Expected 4, got 5" // optional details
}
```

## How to Create a Runner

1.  **Choose a Language**: The runner can be written in any language (Node, Rust, Python, Go, etc.). It just needs to run as a CLI command.
2.  **Parse Arguments**: The runner will typically be called by Progy with a `test` command and the path to the exercise.
    *   Example: `my-runner test content/01_intro/hello`
3.  **Execute Logic**:
    *   Compile the student's code (if necessary).
    *   Run unit tests (e.g., `cargo test --json`, `go test -json`, `jest --json`).
    *   Capture `stdout` and `stderr`.
4.  **Parse & Transform**:
    *   Parse the tool's output (JSON or text).
    *   Map it to the `SRPOutput` structure.
5.  **Print Output**:
    *   Print `__SRP_BEGIN__`.
    *   Print the JSON string.
    *   Print `__SRP_END__`.

## Example: Node.js Runner

```javascript
// runner.js
const { spawn } = require("child_process");

console.log("__SRP_BEGIN__");
// ... logic to run tests ...
console.log(JSON.stringify({
    success: true,
    summary: "It works!",
    diagnostics: [],
    tests: [],
    raw: "..."
}));
console.log("__SRP_END__");
```

## Integration

In your `course.json`, configure the `runner` to execute your script:

```json
"runner": {
  "command": "node",
  "args": ["runner/index.js", "test", "content/{{id}}"],
  "cwd": "."
}
```
