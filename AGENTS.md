# Agent Playbook
**Single source of truth. Follow every instruction.**

## Mission & Mindset
- Operate from the repository reality—never invent APIs, files, or behaviour. When unsure, investigate or ask.
- Treat every change as auditable: state assumptions, cite evidence, and document outcomes.
- Optimise for determinism. Prefer explicit steps, reproducible commands, and verifiable outputs.

## Before You Start
1. Skim this file entirely.
2. Review relevant `.cursor/rules/*.mdc` documents (see index below).
3. Check existing implementations with `ls`, `rg`, or `nl` before proposing changes.
4. Read `convex-aihost.md` whenever work touches data, Convex functions, or product flows.

## Core Operating Constraints
- **No network calls.** Avoid commands or code that rely on external connectivity.
- **Do not start dev/build servers** unless the user explicitly orders it (`bun dev`, `npm run dev`, `next dev`, `bunx convex dev`, etc.).
- **Use Bun tooling** already defined here: `bun install`, `bun run <script>`, `bun test`, `bun run lint`, `bun run tsc`.
- **Deployments**: describe `npx convex deploy` steps if asked, but never execute them.

## Cursor Rule Index
Consult the relevant guide before editing matching code, and reference the applied guidance in your reasoning.
- `.cursor/rules/development_workflow.mdc` – Global workflow: Bun-first commands, schema documentation, update `convex-aihost.md` after major work.
- `.cursor/rules/never-start-the-dev-server-please.mdc` – Reinforces the no-dev-server rule.
- `.cursor/rules/nextjs_rules.mdc` – Next.js App Router structure, component conventions, Tailwind usage, import ordering.
- `.cursor/rules/typescript_rules.mdc` – Strict typing, avoiding `any`, organising and sharing types.
- `.cursor/rules/ui_components.mdc` – Use established UI kits (`components/ui`, shadcn), honour accessibility and theming.
- `.cursor/rules/authentication_clerk.mdc` – Clerk + Convex integration patterns, route protection, identity handling.
- `.cursor/rules/convex_rules.mdc` – New Convex function syntax, validators, schema design, internal actions/queries.

## Repository Facts
- Stack: Next.js (App Router) + Convex backend + Clerk authentication.
- Source lives directly under `app/`, `components/`, `convex/`, etc. There is no separate `frontend/` or `backend/` workspace.
- `convex-aihost.md` documents schema, major features, and migrations—keep it current after meaningful changes.

## Project Structure
- Root contains Next.js App Router pages under `app/` with route groups like `(landing)/`.
- Shared UI lives in `components/` (including `components/ui`, `components/react-bits`, etc.).
- Convex backend logic resides in `convex/` alongside generated types.
- Utility code is organised in `lib/` and `hooks/`.
- Configuration files (e.g., `next.config.ts`, `tsconfig.json`, `.eslintrc.json`) sit at the repo root for transparency.
- Static assets are stored in `public/`.

## Version Control for Development
- Work in feature branches; keep commits focused and descriptive.
- Respect existing uncommitted changes—never revert user edits without instruction.
- Use conventional or clearly scoped commit messages when asked to commit.
- Run lint/tests before publishing changes when possible and note any skipped checks.

## Coding Agent Considerations
- Environment is non-interactive: prefer scripts/commands that run unattended.
- Avoid long-running processes and clean up artefacts you create.
- Call out assumptions, limitations, and verification status in your responses.
- When you cannot complete a task due to constraints, explain precisely what blocked you.

## Additional Resources
- Next.js App Router docs: https://nextjs.org/docs/app
- Convex documentation: https://docs.convex.dev
- Clerk authentication guides: https://clerk.com/docs
- Bun tooling reference: https://bun.sh/docs

## Execution Checklist
- **Lint:** `bun run lint` (Next.js ESLint config).
- **Types:** `bun run tsc` (or `bun run tsc-watch`).
- **Tests:** `bun test`. Stub/skip network-dependent tests; document decisions.
- Add new scripts only when required; document usage when introduced.

## Documentation & Housekeeping
- `CHANGELOG.md`: append a UTC timestamped line per change (create file if missing). Indent any encountered errors beneath the entry.
- `convex-aihost.md`: update after schema, migration, or major Convex/product work.
- `DEVELOPMENT.md`: record manual setup or runtime steps; mirror additions in `dev_init.sh`.
- `.env.template`: maintain placeholders for required environment variables. Document new tooling that consumes env files.

## Special Task Triggers
- `TaskMaster` → open `.project-management/process-tasks-cloud.md` for instructions.
- `CreatePrd` → `.project-management/create-prd.md`.
- `CreateTasks` → `.project-management/generate-tasks.md`.
- `ClosePrd` → `.project-management/close-prd.md`.

## Communication Standards
- Spell out verification steps and remaining unknowns to prevent hallucinations.
- Reference files with explicit paths and 1-based line numbers (e.g., `app/page.tsx:42`).
- If instructions conflict or gaps appear, ask the user instead of guessing.

Stay precise, stay grounded, and leave the workspace better documented than you found it.


