import path from "node:path";

import type { ProjectContext, ResolutionResult, ResolvedPackage } from "./types.js";
import { descriptorKey, isExactVersion, locatorKey, normalizeBin, sortRecord, toPortablePath } from "./utils.js";

type Descriptor = {
  name: string;
  range: string;
};

export async function resolveProjectDependencies(project: ProjectContext): Promise<ResolutionResult> {
  const resolutions: Record<string, string> = {};
  const packages: Record<string, ResolvedPackage> = {};
  const queue: Descriptor[] = Object.entries(project.rootManifest.dependencies ?? {}).map(([name, range]) => ({
    name,
    range
  }));

  while (queue.length > 0) {
    const descriptor = queue.shift()!;
    const key = descriptorKey(descriptor.name, descriptor.range);

    if (resolutions[key]) {
      continue;
    }

    const pkg = await resolveDescriptor(project, descriptor);
    resolutions[key] = pkg.locatorKey;

    if (!packages[pkg.locatorKey]) {
      packages[pkg.locatorKey] = pkg;

      for (const [dependencyName, dependencyRange] of Object.entries(pkg.dependencies)) {
        queue.push({
          name: dependencyName,
          range: dependencyRange
        });
      }
    }
  }

  return {
    version: 1,
    resolutions: sortRecord(resolutions),
    packages: sortPackages(packages)
  };
}

async function resolveDescriptor(project: ProjectContext, descriptor: Descriptor): Promise<ResolvedPackage> {
  if (descriptor.range === "workspace:*") {
    const workspace = project.workspacesByName.get(descriptor.name);

    if (!workspace) {
      throw new Error(`Unknown workspace dependency: ${descriptor.name}`);
    }

    const reference = `workspace:${toPortablePath(path.relative(project.rootDir, workspace.dir))}`;

    return {
      locatorKey: locatorKey(descriptor.name, reference),
      name: descriptor.name,
      version: workspace.manifest.version ?? "0.0.0",
      reference,
      source: "workspace",
      dependencies: sortRecord(workspace.manifest.dependencies ?? {}),
      bin: normalizeBin(descriptor.name, workspace.manifest.bin),
      scripts: sortRecord(workspace.manifest.scripts ?? {}),
      workspaceDir: workspace.dir
    };
  }

  if (!isExactVersion(descriptor.range)) {
    throw new Error(`Unsupported dependency range: ${descriptor.name}@${descriptor.range}`);
  }

  const response = await fetch(`${project.registryUrl}/${encodeURIComponent(descriptor.name)}`);

  if (!response.ok) {
    throw new Error(`Could not resolve ${descriptor.name}@${descriptor.range}`);
  }

  const metadata = (await response.json()) as {
    versions?: Record<string, {
      version?: string;
      dependencies?: Record<string, string>;
      bin?: Record<string, string> | string;
      scripts?: Record<string, string>;
      dist?: {
        tarball?: string;
        integrity?: string;
      };
    }>;
  };

  const versionMetadata = metadata.versions?.[descriptor.range];

  if (!versionMetadata?.dist?.tarball) {
    throw new Error(`Missing metadata for ${descriptor.name}@${descriptor.range}`);
  }

  const reference = `npm:${descriptor.range}`;

  return {
    locatorKey: locatorKey(descriptor.name, reference),
    name: descriptor.name,
    version: versionMetadata.version ?? descriptor.range,
    reference,
    source: "npm",
    dependencies: sortRecord(versionMetadata.dependencies ?? {}),
    bin: normalizeBin(descriptor.name, versionMetadata.bin),
    scripts: sortRecord(versionMetadata.scripts ?? {}),
    dist: {
      tarball: versionMetadata.dist.tarball,
      integrity: versionMetadata.dist.integrity
    }
  };
}

function sortPackages(packages: Record<string, ResolvedPackage>): Record<string, ResolvedPackage> {
  return Object.fromEntries(
    Object.entries(packages)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, pkg]) => [
        key,
        {
          ...pkg,
          dependencies: sortRecord(pkg.dependencies),
          bin: sortRecord(pkg.bin),
          scripts: sortRecord(pkg.scripts)
        }
      ])
  );
}

