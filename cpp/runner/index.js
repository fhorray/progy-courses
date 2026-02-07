const { spawn } = require("child_process");
const { resolve, join } = require("path");
const { existsSync } = require("fs");

const args = process.argv.slice(2);
// Usage: node runner.js -o out main.cpp && ./out (Normal)
// For SRP: node runner.js test <dir>

// We need to parse Progy's invocation. 
// course.json says: "g++ -o out main.cpp && ./out"
// But we want to REPLACE that with our Javascript runner that calls g++.

// Let's assume the new course.json will be: "node ../../../runner/index.js test ."
// Or better: "node runner.js test <content_dir>"

// Implementation for "test <dir>"
const command = args[0];
const targetDir = args[1];

if (command !== "test" || !targetDir) {
    console.error("Usage: node runner/index.js test <dir>");
    process.exit(1);
}

const absDir = resolve(targetDir);
const mainCpp = join(absDir, "main.cpp");
const outBin = join(absDir, "main.out"); // or .exe on windows

const srp = {
    success: false,
    summary: "",
    diagnostics: [],
    tests: [],
    raw: ""
};

// 1. Compile
const gcc = spawn("g++", ["-o", outBin, mainCpp], { cwd: absDir });

let compileErr = "";
gcc.stderr.on("data", d => compileErr += d.toString());

gcc.on("close", (code) => {
    if (code !== 0) {
        srp.success = false;
        srp.summary = "Compilation Failed";
        srp.raw = compileErr;
        
        // Parse GCC errors
        const lines = compileErr.split("\n");
        lines.forEach(line => {
             if (line.includes(": error:")) {
                 srp.diagnostics.push({
                     severity: "error",
                     message: line,
                     file: "main.cpp" 
                 });
             }
        });
        
        printSRP(srp);
        return;
    }

    // 2. Run
    const exec = spawn(outBin, [], { cwd: absDir });
    let output = "";
    
    exec.stdout.on("data", d => output += d.toString());
    exec.stderr.on("data", d => output += d.toString());
    
    exec.on("close", (runCode) => {
        srp.success = runCode === 0;
        srp.raw = output;
        srp.summary = srp.success ? "Execution Successful" : "Execution Failed";
        
        srp.tests.push({
            name: "Main Execution",
            status: srp.success ? "pass" : "fail",
            message: output
        });

        printSRP(srp);
    });
});

function printSRP(obj) {
    console.log("__SRP_BEGIN__");
    console.log(JSON.stringify(obj, null, 2));
    console.log("__SRP_END__");
}
