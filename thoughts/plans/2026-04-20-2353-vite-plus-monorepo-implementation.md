# Plan: Vite+ oriented Yarn Berry monorepo scaffold

Date: 2026-04-20 23:53 KST
Input: `thoughts/research/2026-04-20-2350-vite-plus-monorepo.md`

## Goal

Keep Yarn Berry with `nodeLinker: node-modules`, add a Vite+-oriented monorepo root, and provide one workspace project that can be validated with Vite+ commands.

## Non-goals

- Do not add a custom scaffolding CLI in this step.
- Do not introduce Turbo/Nx or another task runner.
- Do not optimize for multiple framework templates beyond placeholder directories and conventions.

## Risks and Mitigations

- Risk: active shell Node version is too low for current `vite-plus`.
  - Mitigation: set `.node-version` to `20.19.0` and validate commands using `fnm exec --using 20.19.0`.
- Risk: Vite+ command surface may keep changing during alpha.
  - Mitigation: expose Vite+ through root wrapper scripts so future churn is absorbed at the repo boundary.
- Risk: root package is not a Vite app, so built-in `vp build` at the workspace root is not the desired entry point.
  - Mitigation: root scripts should orchestrate workspace packages through `vp run --filter "@poc/*" ...`.
- Risk: `vp check` may fail to load local TypeScript config files in this environment.
  - Mitigation: keep Vite+ config files as `vite.config.mjs` unless TypeScript config loading is revalidated.

## Definition of Done

- Root has:
  - Yarn Berry workspace config with `projects/*` and `packages/*`
  - `.node-version`
  - root `vite.config.ts`
  - root wrapper scripts for `build`, `check`, `test`, and one sample app entry
- Repo has a common config workspace package for TypeScript base configs.
- Repo has template placeholder directories for future POCs.
- Repo has one Vite+ compatible sample app workspace under `projects/*`.
- Validation passes with a Vite+-compatible Node version.

## Validation Commands

- `fnm exec --using 20.19.0 corepack yarn install`
- `fnm exec --using 20.19.0 corepack yarn build`
- `fnm exec --using 20.19.0 corepack yarn check`
- `fnm exec --using 20.19.0 corepack yarn test`
- `fnm exec --using 20.19.0 corepack yarn dev:sample-web` then HTTP smoke check

## Phases

- [x] Phase 1. Reshape the root for Vite+ orchestration.
  - Add `.node-version`
  - Expand workspaces to include `packages/*`
  - Add root wrapper scripts and Vite+ dependency
  - Add root `vite.config.mjs`

- [x] Phase 2. Add reusable config and template placeholders.
  - Add `packages/tsconfig`
  - Add `templates/` placeholder structure
  - Update root documentation

- [x] Phase 3. Replace the current sample with a Vite+ compatible web sample.
  - Remove the old Node-only sample
  - Add `projects/sample-web` with `vp dev/build/check/test`
  - Wire it to the shared tsconfig package

- [x] Phase 4. Install and validate.
  - Install dependencies under Node `20.19.0`
  - Run build/check/test
  - Run one dev-server smoke test
