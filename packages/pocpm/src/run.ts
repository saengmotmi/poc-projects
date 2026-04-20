import { spawn } from "node:child_process";
import path from "node:path";

import type { PackageJson } from "./types.js";
import { readJsonFile } from "./utils.js";

export async function runScript(
  cwd: string,
  scriptName: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const manifest = await readJsonFile<PackageJson>(path.join(cwd, "package.json"));
  const command = manifest.scripts?.[scriptName];

  if (!command) {
    throw new Error(`Unknown script: ${scriptName}`);
  }

  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      env: {
        ...process.env,
        PATH: [path.join(cwd, "node_modules", ".bin"), process.env.PATH ?? ""].join(path.delimiter)
      },
      shell: true
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", chunk => {
      stdout += String(chunk);
    });

    child.stderr.on("data", chunk => {
      stderr += String(chunk);
    });

    child.on("error", reject);
    child.on("close", exitCode => {
      resolve({
        stdout,
        stderr,
        exitCode: exitCode ?? 1
      });
    });
  });
}

