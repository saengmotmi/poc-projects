import { access, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { PackageJson } from "./types.js";

export async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

export async function ensureDirectory(directoryPath: string): Promise<void> {
  await mkdir(directoryPath, { recursive: true });
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function descriptorKey(name: string, range: string): string {
  return `${name}@${range}`;
}

export function locatorKey(name: string, reference: string): string {
  return `${name}@${reference}`;
}

export function normalizeBin(name: string, binField: PackageJson["bin"]): Record<string, string> {
  if (!binField) {
    return {};
  }

  if (typeof binField === "string") {
    return {
      [name.includes("/") ? name.split("/").at(-1)! : name]: binField
    };
  }

  return Object.fromEntries(Object.entries(binField).sort(([left], [right]) => left.localeCompare(right)));
}

export function isExactVersion(range: string): boolean {
  return /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(range);
}

export function sanitizePackageName(name: string): string {
  return name.replaceAll("/", "__");
}

export function packageDirectory(nodeModulesDir: string, name: string): string {
  return path.join(nodeModulesDir, ...name.split("/"));
}

export function toPortablePath(value: string): string {
  return value.split(path.sep).join("/");
}

export function sortRecord<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).sort(([left], [right]) => left.localeCompare(right)));
}

