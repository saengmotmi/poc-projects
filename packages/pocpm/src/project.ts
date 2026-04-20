import { readdir } from "node:fs/promises";
import path from "node:path";

import type { PackageJson, ProjectContext, Workspace } from "./types.js";
import { ensureDirectory, fileExists, readJsonFile } from "./utils.js";

export async function loadProject(cwd: string, registryUrl?: string): Promise<ProjectContext> {
  const rootManifestPath = path.join(cwd, "package.json");
  const rootManifest = await readJsonFile<PackageJson>(rootManifestPath);
  const workspacesByName = await discoverWorkspaces(cwd, rootManifest.workspaces ?? []);

  const storeDir = path.join(cwd, ".pocpm-store");
  const tarballStoreDir = path.join(storeDir, "tarballs");
  await ensureDirectory(tarballStoreDir);

  return {
    rootDir: cwd,
    rootManifest,
    workspacesByName,
    registryUrl: normalizeRegistryUrl(registryUrl),
    storeDir,
    tarballStoreDir,
    lockfilePath: path.join(cwd, "pocpm.lock.json")
  };
}

async function discoverWorkspaces(rootDir: string, patterns: string[]): Promise<Map<string, Workspace>> {
  const workspaces = new Map<string, Workspace>();

  for (const pattern of patterns) {
    if (!pattern.endsWith("/*")) {
      continue;
    }

    const baseDir = path.join(rootDir, pattern.slice(0, -2));
    const entries = await safeReadDir(baseDir);

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const workspaceDir = path.join(baseDir, entry.name);
      const manifestPath = path.join(workspaceDir, "package.json");

      if (!(await fileExists(manifestPath))) {
        continue;
      }

      const manifest = await readJsonFile<PackageJson>(manifestPath);

      if (!manifest.name) {
        continue;
      }

      workspaces.set(manifest.name, {
        name: manifest.name,
        dir: workspaceDir,
        manifest
      });
    }
  }

  return workspaces;
}

async function safeReadDir(directoryPath: string) {
  try {
    return await readdir(directoryPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function normalizeRegistryUrl(registryUrl?: string): string {
  return (registryUrl ?? "https://registry.npmjs.org").replace(/\/+$/, "");
}

