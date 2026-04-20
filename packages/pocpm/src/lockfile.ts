import { writeFile } from "node:fs/promises";

import type { ProjectContext, ResolutionResult } from "./types.js";

export async function writeLockfile(project: ProjectContext, resolution: ResolutionResult): Promise<void> {
  await writeFile(project.lockfilePath, JSON.stringify(resolution, null, 2) + "\n");
}

