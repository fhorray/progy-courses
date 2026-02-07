import { spawn } from "child_process";
import { resolve } from "path";
import { existsSync } from "fs";

// Reuse the TS runner logic but tailored for Cloudflare (vitest)
// In a real scenario, this might use miniflare or wrangler test
// For now, standard vitest runner is sufficient for unit testing workers

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

  if (!existsSync(targetPath)) {
    srp.summary = "Target path not found";
    printSRP(srp);
    return;
  }

  // Use Vitest directly or via Bun
  const proc = spawn("bun", ["test", "--reporter=json", targetPath], {
    cwd: targetPath,
    env: { ...process.env, FORCE_COLOR: "0" },
  });

  let stdout = "";
  let stderr = "";

  proc.stdout.on("data", (d) => (stdout += d.toString()));
  proc.stderr.on("data", (d) => (stderr += d.toString()));

  proc.on("close", (code) => {
    srp.raw = stdout + "\n" + stderr;
    srp.success = code === 0;

    if (code === 0) {
      srp.summary = "Worker tests passed";
    } else {
      srp.summary = "Worker tests failed";
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
