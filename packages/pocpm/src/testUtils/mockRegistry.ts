import { createServer, type Server } from "node:http";
import { mkdtemp, mkdir, rm, writeFile, chmod, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import * as tar from "tar";

type RegistryPackage = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  bin?: Record<string, string> | string;
  files: Record<string, string>;
};

export type MockRegistry = {
  registryUrl: string;
  close: () => Promise<void>;
};

type PackedPackage = {
  metadata: RegistryPackage & {
    dist: {
      tarball: string;
      integrity: string;
    };
  };
  tarballPath: string;
};

export async function startMockRegistry(packages: RegistryPackage[]): Promise<MockRegistry> {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "pocpm-registry-"));
  const packedPackages = new Map<string, PackedPackage>();

  for (const pkg of packages) {
    const pack = await packFixturePackage(tempRoot, pkg);
    packedPackages.set(pkgKey(pkg.name, pkg.version), pack);
  }

  const server = createServer(async (request, response) => {
    if (!request.url) {
      response.statusCode = 400;
      response.end("Missing URL");
      return;
    }

    const url = new URL(request.url, "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/tarballs/")) {
      const [, , name, version] = pathname.split("/");

      if (!name || !version) {
        response.statusCode = 400;
        response.end("Invalid tarball path");
        return;
      }
      const pack = packedPackages.get(pkgKey(name, version));

      if (!pack) {
        response.statusCode = 404;
        response.end("Not found");
        return;
      }

      response.setHeader("content-type", "application/octet-stream");
      response.end(await readFile(pack.tarballPath));
      return;
    }

    const packageName = pathname.slice(1);
    const versions = [...packedPackages.values()]
      .filter(pack => pack.metadata.name === packageName)
      .reduce<Record<string, PackedPackage["metadata"]>>((accumulator, pack) => {
        accumulator[pack.metadata.version] = pack.metadata;
        return accumulator;
      }, {});

    if (Object.keys(versions).length === 0) {
      response.statusCode = 404;
      response.end("Not found");
      return;
    }

    response.setHeader("content-type", "application/json");
    response.end(
      JSON.stringify({
        name: packageName,
        versions
      })
    );
  });

  await new Promise<void>(resolve => {
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not determine mock registry address.");
  }

  const registryUrl = `http://127.0.0.1:${address.port}`;

  for (const pack of packedPackages.values()) {
    pack.metadata.dist.tarball = `${registryUrl}${pack.metadata.dist.tarball}`;
  }

  return {
    registryUrl,
    close: async () => {
      await closeServer(server);
      await rm(tempRoot, { recursive: true, force: true });
    }
  };
}

async function packFixturePackage(tempRoot: string, pkg: RegistryPackage): Promise<PackedPackage> {
  const packageDir = path.join(tempRoot, "sources", sanitizeName(pkg.name), pkg.version, "package");
  await mkdir(packageDir, { recursive: true });

  const packageJson = {
    name: pkg.name,
    version: pkg.version,
    dependencies: pkg.dependencies ?? {},
    bin: pkg.bin
  };

  await writeFile(path.join(packageDir, "package.json"), JSON.stringify(packageJson, null, 2));

  for (const [relativePath, content] of Object.entries(pkg.files)) {
    const absolutePath = path.join(packageDir, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content);

    if (relativePath.startsWith("bin/")) {
      await chmod(absolutePath, 0o755);
    }
  }

  const tarballDir = path.join(tempRoot, "tarballs");
  await mkdir(tarballDir, { recursive: true });
  const tarballPath = path.join(tarballDir, `${sanitizeName(pkg.name)}-${pkg.version}.tgz`);
  await tar.c(
    {
      gzip: true,
      cwd: path.dirname(packageDir),
      file: tarballPath
    },
    ["package"]
  );

  return {
    metadata: {
      ...pkg,
      dist: {
        tarball: `/tarballs/${encodeURIComponent(pkg.name)}/${pkg.version}`,
        integrity: ""
      }
    },
    tarballPath
  };
}

function sanitizeName(value: string): string {
  return value.replaceAll("/", "__");
}

function pkgKey(name: string, version: string): string {
  return `${name}@${version}`;
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
