import assert from "node:assert/strict";
import { mkdtemp, readFile, lstat, realpath } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { after, before, test } from "node:test";

import { installProject, runScript } from "./index.js";
import { startMockRegistry, type MockRegistry } from "./testUtils/mockRegistry.js";

let registry: MockRegistry;

before(async () => {
  registry = await startMockRegistry([
    {
      name: "registry-leaf",
      version: "1.0.0",
      files: {
        "index.js": "module.exports = 'registry-leaf';\n"
      }
    },
    {
      name: "registry-lib",
      version: "1.0.0",
      dependencies: {
        "registry-leaf": "1.0.0"
      },
      files: {
        "index.js": "module.exports = require('registry-leaf');\n"
      }
    },
    {
      name: "registry-bin",
      version: "1.0.0",
      bin: {
        "registry-greet": "bin/registry-greet.js"
      },
      files: {
        "bin/registry-greet.js": "#!/usr/bin/env node\nprocess.stdout.write('hello-from-bin');\n"
      }
    }
  ]);
});

after(async () => {
  await registry.close();
});

test("installProject는 캐시, 락파일, hoist 없는 node_modules, workspace 링크를 만든다", async () => {
  const projectDir = await createFixtureProject();

  await installProject({
    cwd: projectDir,
    registryUrl: registry.registryUrl
  });

  const lockfile = JSON.parse(await readFile(path.join(projectDir, "pocpm.lock.json"), "utf8")) as {
    resolutions: Record<string, string>;
    packages: Record<string, unknown>;
  };

  assert.equal(lockfile.resolutions["registry-lib@1.0.0"], "registry-lib@npm:1.0.0");
  assert.equal(
    lockfile.resolutions["@fixture/workspace-lib@workspace:*"],
    "@fixture/workspace-lib@workspace:packages/workspace-lib"
  );
  assert.ok(lockfile.packages["registry-leaf@npm:1.0.0"]);

  const cacheDir = path.join(projectDir, ".pocpm-store", "tarballs");
  const cacheEntries = await readDirectory(cacheDir);
  assert.ok(cacheEntries.some(entry => entry.includes("registry-lib-1.0.0.tgz")));

  const registryLibPackageJson = JSON.parse(
    await readFile(path.join(projectDir, "node_modules", "registry-lib", "package.json"), "utf8")
  ) as { name: string };
  assert.equal(registryLibPackageJson.name, "registry-lib");

  const nestedLeafPackageJson = JSON.parse(
    await readFile(
      path.join(projectDir, "node_modules", "registry-lib", "node_modules", "registry-leaf", "package.json"),
      "utf8"
    )
  ) as { name: string };
  assert.equal(nestedLeafPackageJson.name, "registry-leaf");

  const workspaceLinkPath = path.join(projectDir, "node_modules", "@fixture", "workspace-lib");
  const workspaceStat = await lstat(workspaceLinkPath);
  assert.equal(workspaceStat.isSymbolicLink(), true);
  assert.equal(
    await realpath(workspaceLinkPath),
    await realpath(path.join(projectDir, "packages", "workspace-lib"))
  );

  const workspaceNestedLeafPackageJson = JSON.parse(
    await readFile(
      path.join(projectDir, "packages", "workspace-lib", "node_modules", "registry-leaf", "package.json"),
      "utf8"
    )
  ) as { name: string };
  assert.equal(workspaceNestedLeafPackageJson.name, "registry-leaf");
});

test("runScript는 설치된 의존성 바이너리를 통해 루트 스크립트를 실행한다", async () => {
  const projectDir = await createFixtureProject();

  await installProject({
    cwd: projectDir,
    registryUrl: registry.registryUrl
  });

  const result = await runScript(projectDir, "greet");

  assert.equal(result.exitCode, 0);
  assert.equal(result.stdout.trim(), "hello-from-bin");
  assert.equal(result.stderr, "");
});

async function createFixtureProject(): Promise<string> {
  const projectDir = await mkdtemp(path.join(tmpdir(), "pocpm-project-"));

  await writeJson(path.join(projectDir, "package.json"), {
    name: "fixture-app",
    private: true,
    scripts: {
      greet: "registry-greet"
    },
    workspaces: ["packages/*"],
    dependencies: {
      "registry-lib": "1.0.0",
      "registry-bin": "1.0.0",
      "@fixture/workspace-lib": "workspace:*"
    }
  });

  await writeJson(path.join(projectDir, "packages", "workspace-lib", "package.json"), {
    name: "@fixture/workspace-lib",
    version: "0.0.0",
    private: true,
    dependencies: {
      "registry-leaf": "1.0.0"
    }
  });

  return projectDir;
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readDirectory(directoryPath: string): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  return readdir(directoryPath);
}
