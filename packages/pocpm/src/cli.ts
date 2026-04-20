import { installProject, runScript } from "./index.js";

async function main() {
  const [, , command, ...args] = process.argv;

  if (command === "install") {
    await installProject({ cwd: process.cwd() });
    return;
  }

  if (command === "run") {
    const scriptName = args[0];

    if (!scriptName) {
      throw new Error("Missing script name.");
    }

    const result = await runScript(process.cwd(), scriptName);
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    process.exitCode = result.exitCode;
    return;
  }

  throw new Error(`Unsupported command: ${command ?? "(empty)"}`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

