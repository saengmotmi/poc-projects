# Plan: Rust FE tooling learning track

Date: 2026-07-05 21:03 KST
Input: `thoughts/research/2026-07-05-2103-rust-fe-tooling-learning.md`

## Goal

Add a repository home for learning Rust through frontend tooling work.

The first track should answer three questions:

- What should a TypeScript-first frontend developer learn first in Rust?
- How should each study session be recorded so progress is visible?
- What small Rust tool should anchor the learning loop?

## Non-goals

- Do not implement the Rust CLI in this change.
- Do not add Rust toolchain installation steps to root scripts yet.
- Do not change the existing Yarn/Vite+ validation flow.
- Do not cover advanced Rust topics such as async, procedural macros, `unsafe`, or full compiler architecture.

## Risks and Mitigations

- Risk: the plan becomes another document that is read once and forgotten.
  - Mitigation: add a session log template under the project directory and require a weekly artifact.
- Risk: Rust concepts become detached from actual frontend work.
  - Mitigation: make `package.json`, workspace walking, TypeScript import scanning, and AST parsing the project milestones.
- Risk: the project becomes too ambitious too early.
  - Mitigation: start with a read-only CLI and delay mutation, lint autofix, async, and parallelism.
- Risk: Rust code cannot be verified on machines without Rust installed.
  - Mitigation: keep this PR documentation-only and add implementation once `cargo check` and `cargo test` can run locally.

## Definition of Done

- `docs/rust-fe-tooling-learning-plan.md` explains the evidence-based learning loop.
- `projects/fe-scan-rs/README.md` defines the first Rust tooling POC.
- `projects/fe-scan-rs/learning-log/TEMPLATE.md` provides a repeatable session log shape.
- `projects/fe-scan-rs/learning-log/2026-07-05-week-0.md` records the initial decision.
- Root README links to the new Rust learning track.
- Existing root validation still passes.

## Validation Commands

- `corepack yarn install --immutable`
- `corepack yarn check`
- `corepack yarn modern-screenshot --file docs/rust-fe-tooling-learning-plan.md --output docs/assets/rust-fe-tooling-learning-plan.png`

## Phases

- [x] Phase 1. Capture research assumptions and learning-science constraints.
- [x] Phase 2. Add the Rust FE tooling learning plan.
- [x] Phase 3. Add the `fe-scan-rs` project home and learning log template.
- [x] Phase 4. Link the new track from the root README.
- [ ] Phase 5. In a later PR, add the first verified Rust implementation for `fe-scan-rs deps`.
