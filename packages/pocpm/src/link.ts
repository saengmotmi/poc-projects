import { mkdir, readlink, rm, symlink } from "node:fs/promises";
import path from "node:path";

import * as tar from "tar";

import type { FetchResult, ProjectContext, ResolutionResult } from "./types.js";
import { descriptorKey, packageDirectory } from "./utils.js";

type LinkContext = {
  project: ProjectContext;
  resolution: ResolutionResult;
  fetched: Map<string, FetchResult>;
  preparedWorkspaceLocators: Set<string>;
};

export async function linkProject(
  project: ProjectContext,
  resolution: ResolutionResult,
  fetched: Map<string, FetchResult>
): Promise<void> {
  await rm(path.join(project.rootDir, "node_modules"), { recursive: true, force: true });

  for (const workspace of project.workspacesByName.values()) {
    await rm(path.join(workspace.dir, "node_modules"), { recursive: true, force: true });
  }

  const context: LinkContext = {
    project,
    resolution,
    fetched,
    preparedWorkspaceLocators: new Set()
  };

  await installDependenciesIntoDirectory(
    context,
    project.rootDir,
    project.rootManifest.dependencies ?? {}
  );
}

async function installDependenciesIntoDirectory(
  context: LinkContext,
  packageDir: string,
  dependencies: Record<string, string>
): Promise<void> {
  const nodeModulesDir = path.join(packageDir, "node_modules");
  await rm(nodeModulesDir, { recursive: true, force: true });
  await mkdir(nodeModulesDir, { recursive: true });

  for (const [name, range] of Object.entries(dependencies)) {
    const resolved = getResolvedPackage(context, name, range);
    const targetDir = packageDirectory(nodeModulesDir, name);
    await linkPackageIntoDirectory(context, resolved.locatorKey, targetDir);
  }

  await createBinEntries(context, nodeModulesDir, dependencies);
}

async function linkPackageIntoDirectory(
  context: LinkContext,
  locatorKey: string,
  targetDir: string
): Promise<void> {
  const pkg = context.resolution.packages[locatorKey];

  if (!pkg) {
    throw new Error(`Unknown resolved package: ${locatorKey}`);
  }

  await rm(targetDir, { recursive: true, force: true });
  await mkdir(path.dirname(targetDir), { recursive: true });

  if (pkg.source === "workspace") {
    if (!pkg.workspaceDir) {
      throw new Error(`Missing workspace dir for ${locatorKey}`);
    }

    await symlinkRelative(pkg.workspaceDir, targetDir);

    if (!context.preparedWorkspaceLocators.has(locatorKey)) {
      context.preparedWorkspaceLocators.add(locatorKey);
      await installDependenciesIntoDirectory(context, pkg.workspaceDir, pkg.dependencies);
    }

    return;
  }

  const fetched = context.fetched.get(locatorKey);

  if (!fetched?.tarballPath) {
    throw new Error(`Missing fetched tarball for ${locatorKey}`);
  }

  await mkdir(targetDir, { recursive: true });
  await tar.x({
    cwd: targetDir,
    file: fetched.tarballPath,
    strip: 1
  });

  await installDependenciesIntoDirectory(context, targetDir, pkg.dependencies);
}

async function createBinEntries(
  context: LinkContext,
  nodeModulesDir: string,
  dependencies: Record<string, string>
): Promise<void> {
  if (Object.keys(dependencies).length === 0) {
    return;
  }

  const binDir = path.join(nodeModulesDir, ".bin");
  await mkdir(binDir, { recursive: true });

  for (const [name, range] of Object.entries(dependencies)) {
    const pkg = getResolvedPackage(context, name, range);
    const packageDirOnDisk = packageDirectory(nodeModulesDir, name);

    for (const [binName, relativeBinPath] of Object.entries(pkg.bin)) {
      const binTarget = path.join(packageDirOnDisk, relativeBinPath);
      const binLink = path.join(binDir, binName);
      await rm(binLink, { recursive: true, force: true });
      await symlinkRelative(binTarget, binLink);
    }
  }
}

function getResolvedPackage(context: LinkContext, name: string, range: string) {
  const locator = context.resolution.resolutions[descriptorKey(name, range)];

  if (!locator) {
    throw new Error(`Missing resolution for ${name}@${range}`);
  }

  const pkg = context.resolution.packages[locator];

  if (!pkg) {
    throw new Error(`Missing package for locator ${locator}`);
  }

  return pkg;
}

async function symlinkRelative(sourcePath: string, targetPath: string): Promise<void> {
  const relativeTarget = path.relative(path.dirname(targetPath), sourcePath);
  await symlink(relativeTarget, targetPath, "junction");
}

export async function isSymlinkPointingTo(targetPath: string, sourcePath: string): Promise<boolean> {
  const linkValue = await readlink(targetPath);
  return path.resolve(path.dirname(targetPath), linkValue) === sourcePath;
}

