import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import type { FetchResult, ProjectContext, ResolutionResult } from "./types.js";
import { fileExists, sanitizePackageName } from "./utils.js";

export async function fetchPackages(
  project: ProjectContext,
  resolution: ResolutionResult
): Promise<Map<string, FetchResult>> {
  const fetched = new Map<string, FetchResult>();

  for (const pkg of Object.values(resolution.packages)) {
    if (pkg.source !== "npm" || !pkg.dist) {
      fetched.set(pkg.locatorKey, { locatorKey: pkg.locatorKey });
      continue;
    }

    const tarballPath = path.join(project.tarballStoreDir, `${sanitizePackageName(pkg.name)}-${pkg.version}.tgz`);

    if (!(await fileExists(tarballPath))) {
      const response = await fetch(pkg.dist.tarball);

      if (!response.ok) {
        throw new Error(`Could not fetch ${pkg.name}@${pkg.version}`);
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      verifyIntegrity(bytes, pkg.dist.integrity);
      await writeFile(tarballPath, bytes);
    }

    fetched.set(pkg.locatorKey, {
      locatorKey: pkg.locatorKey,
      tarballPath
    });
  }

  return fetched;
}

function verifyIntegrity(bytes: Buffer, integrity?: string): void {
  if (!integrity) {
    return;
  }

  const [algorithm, expected] = integrity.split("-", 2);

  if (!algorithm || !expected) {
    throw new Error(`Unsupported integrity format: ${integrity}`);
  }

  const actual = createHash(algorithm).update(bytes).digest("base64");

  if (actual !== expected) {
    throw new Error("Integrity check failed.");
  }
}

