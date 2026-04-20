# Research: Vite+ oriented monorepo scaffold

Date: 2026-04-20 23:50 KST

## Normal vs Current

- Normal behavior: `poc-projects` should keep Yarn Berry with `nodeLinker: node-modules` and expose a Vite+-oriented root structure that makes adding new POC projects under `projects/*` straightforward.
- Current behavior: `poc-projects` is a minimal Yarn workspace with one sample Node app and no Vite+ root config, common config package, template placeholders, or wrapper scripts.

## Output Axes

- Input: project slug and project kind for future POCs.
- State: current root only contains `projects/sample-app` and basic Yarn workspace settings.
- Environment: shell reports `node v20.10.0`; `fnm` is installed and already has `v20.19.0`, `v22.12.0`, and newer versions available locally.
- Time: Vite+ command surface is recent and has changed between the 2025-10 announcement and the 2026-03 alpha announcement.

## Repository Observations

### Current root files

Observed files at the root:

- `.yarnrc.yml`
- `package.json`
- `tsconfig.base.json`
- `README.md`
- `projects/sample-app/*`

Current root `package.json`:

```json
{
  "name": "poc-projects",
  "private": true,
  "packageManager": "yarn@4.9.1",
  "workspaces": [
    "projects/*"
  ],
  "scripts": {
    "dev:sample-app": "yarn workspace @poc/sample-app dev",
    "build": "yarn workspaces foreach -A run build"
  }
}
```

### Existing sample project

- Workspace package name: `@poc/sample-app`
- Type: Node HTTP server written in TypeScript
- Validation already passed before this change:
  - `corepack yarn install`
  - `corepack yarn build`
  - runtime smoke test on port `3210`

## Toolchain Observations

### Yarn

- Root already uses `packageManager: "yarn@4.9.1"`.
- `.yarnrc.yml` currently sets `nodeLinker: node-modules`.

### Node runtime

Shell observation:

```text
node --version => v20.10.0
```

`fnm list` observation:

```text
* v16.16.0
* v18.20.4
* v20.10.0
* v20.19.0
* v22.11.0
* v22.12.0
* v22.22.0
* v24.13.1
* v25.6.1 default
* system
```

This means a Vite+-compatible Node version is already available locally through `fnm`.

## Vite+ Surface Observations

### npm metadata

Observed with `npm view vite-plus ... --json`:

```json
{
  "version": "0.1.18",
  "dist-tags": {
    "test": "0.0.2-g9a3a310d.20260303-0757",
    "latest": "0.1.18",
    "alpha": "0.1.19-alpha.2"
  }
}
```

Observed package metadata:

```json
{
  "bin": {
    "vp": "bin/vp",
    "oxfmt": "bin/oxfmt",
    "oxlint": "bin/oxlint"
  },
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  }
}
```

### Official docs / announcements

Official sources observed:

- GitHub: `https://github.com/voidzero-dev/vite-plus`
- VoidZero announcement (2025-10-13): `https://voidzero.dev/posts/announcing-vite-plus`
- VoidZero alpha announcement (2026-03-13): `https://voidzero.dev/posts/announcing-vite-plus-alpha`

Observed command surface from the GitHub README / alpha announcement:

- `vp env`
- `vp install`
- `vp dev`
- `vp check`
- `vp test`
- `vp build`
- `vp run`
- `vp pack`
- `vp create`
- `vp migrate`

Observed monorepo/task-related claims from official docs:

- Vite+ is positioned as a unified toolchain and entry point.
- `vp run` is documented as a monorepo task runner with caching and dependency-aware execution.
- `vp create` is documented as scaffolding projects and monorepos.
- `vp install` is documented as delegating to the detected package manager.

### Surface change over time

- 2025-10 announcement examples used `vite new`.
- 2026-03 alpha announcement uses `vp create`.

This is a direct sign that the public command surface has been evolving recently.

## Constraints Observed

- User requirement: use Yarn Berry with `nodeLinker: node_modules`.
- Existing repo already satisfies the Yarn requirement and should not regress it.
- Vite+ latest stable package requires a newer Node version than the current active shell version.
- Vite+ public surface is still moving, so direct exposure without a wrapper layer may increase churn at the repo boundary.
