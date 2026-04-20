import { fetchPackages } from "./fetch.js";
import { linkProject } from "./link.js";
import { writeLockfile } from "./lockfile.js";
import { loadProject } from "./project.js";
import { resolveProjectDependencies } from "./resolve.js";
export { runScript } from "./run.js";

export type InstallOptions = {
  cwd: string;
  registryUrl?: string;
};

export async function installProject(options: InstallOptions): Promise<void> {
  const project = await loadProject(options.cwd, options.registryUrl);
  const resolution = await resolveProjectDependencies(project);
  const fetched = await fetchPackages(project, resolution);
  await writeLockfile(project, resolution);
  await linkProject(project, resolution, fetched);
}
