export type PackageJson = {
  name?: string;
  version?: string;
  private?: boolean;
  workspaces?: string[];
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  bin?: Record<string, string> | string;
};

export type Workspace = {
  name: string;
  dir: string;
  manifest: PackageJson;
};

export type ProjectContext = {
  rootDir: string;
  rootManifest: PackageJson;
  workspacesByName: Map<string, Workspace>;
  registryUrl: string;
  storeDir: string;
  tarballStoreDir: string;
  lockfilePath: string;
};

export type ResolvedPackage = {
  locatorKey: string;
  name: string;
  version: string;
  reference: string;
  source: "npm" | "workspace";
  dependencies: Record<string, string>;
  bin: Record<string, string>;
  scripts: Record<string, string>;
  dist?: {
    tarball: string;
    integrity?: string;
  };
  workspaceDir?: string;
};

export type ResolutionResult = {
  version: 1;
  resolutions: Record<string, string>;
  packages: Record<string, ResolvedPackage>;
};

export type FetchResult = {
  locatorKey: string;
  tarballPath?: string;
};

