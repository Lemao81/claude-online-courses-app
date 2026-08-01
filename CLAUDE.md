# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # start dev server on port 3000
pnpm build            # production build
pnpm test             # run Vitest tests
pnpm check            # Biome lint + format check (use before committing)
pnpm lint             # Biome lint only
pnpm format           # Biome format only
pnpm generate-routes  # regenerate src/routeTree.gen.ts (run after adding/removing routes)

# Database (requires DATABASE_URL in .env.local)
pnpm db:generate      # generate Drizzle migrations from schema changes
pnpm db:migrate       # apply migrations
pnpm db:push          # push schema directly (dev only)
pnpm db:studio        # open Drizzle Studio
```

## Architecture

**Framework**: TanStack Start (SSR-capable React meta-framework) with TanStack Router for file-based routing. The router is configured in `src/router.tsx` and the auto-generated route tree lives in `src/routeTree.gen.ts` (do not edit manually).

**Routing**: All routes are files under `src/routes/`. The root layout (`src/routes/__root.tsx`) wraps every page with `<ClerkProvider>`, `<Header>`, `<Footer>`, and devtools. Route context carries a `QueryClient` instance, enabling SSR-integrated data fetching via `@tanstack/react-router-ssr-query`.

**Data layer**:
- **Server/DB**: Drizzle ORM with PostgreSQL (`src/server/db/schema.ts` → `src/server/db/index.ts`). Requires `DATABASE_URL` in `.env.local`.
- **Client state**: TanStack Query for server-fetched data; `@tanstack/react-db` for local-only reactive collections (see `src/server/db-collections/index.ts`).

**Auth**: Clerk (`@clerk/clerk-react`). Provider is at `src/integrations/clerk/provider.tsx`. Requires `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local`. Use `<SignedIn>` / `<SignedOut>` for client-side route guarding.

**Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Global styles in `src/styles.css`. Theme (light/dark/auto) is toggled via `localStorage` and resolved by an inline script injected in `__root.tsx` to prevent flash.

**Forms**: TanStack Form with a shared `useAppForm` hook (`src/hooks/demo.form.ts`) and reusable field components (`src/components/demo.FormComponents.tsx`).

**Linting/Formatting**: Biome (not ESLint/Prettier). Config in `biome.json` — tabs for indentation, double quotes for JS/TS. `src/routeTree.gen.ts` and `src/styles.css` are excluded from Biome.

**Path alias**: `#/*` maps to `src/*` (configured in `package.json` `imports` and `tsconfig.json`).

## Key conventions

- Files prefixed with `demo.` are starter examples and can be deleted.
- After adding or removing route files, run `pnpm generate-routes` to update `routeTree.gen.ts`.
- Server functions use `createServerFn` from `@tanstack/react-start`; API routes use the `server.handlers` property on a file route.
- Drizzle schema changes require `pnpm db:generate` followed by `pnpm db:migrate` (or `pnpm db:push` in dev).

## Agent Instructions

- Never execute `pnpm install`, `pnpm add`, `pnpm remove`, or any other command that installs/mutates dependencies. Edit `package.json` directly and tell the user to run the install themselves.
- Never execute `git commit` on your own without explicit instruction. After explicit instruction, execute without asking for additional confirmation.
- In this sandbox, `node_modules` was installed on Windows: `pnpm` is unavailable, `.bin` shims fail, and platform-specific binaries (e.g. Biome's Linux CLI) are missing. Never attempt `npx <tool>`, `pnpm exec <tool>`, `pnpm <script>`, or login-shell fallbacks. To verify changes, run `node node_modules/typescript/bin/tsc --noEmit` (ignore pre-existing errors in unrelated files) and skip lint/format checks — the user runs `pnpm check` on the host.
- When the entire user message is `coa`, treat it as the command `commit all`.

## Code Style
- General:
  - Insert an empty line before `return`, unless it is the first statement in its block.
  - Always brace a control-flow body and put its statement on its own line — never `if (x) return`.
  - Never add comments, except tool-control directive comments when explicitly instructed — e.g. suppression/ignore/pragma comments for linters, formatters, type-checkers, or static analyzers.
  - Preserve a file's existing line endings; write new files with CRLF.
- C#:
  - Tests:
    - Structure tests with the Arrange-Act-Assert pattern, marking each section with an `// Arrange`, `// Act` or `// Assert` comment.
- TypeScript:
  - Omit the braces and `return` when an arrow function body is a single expression, except in React components; keep them where the implicit return would change behaviour, such as a `useEffect` callback.
  - Add an explicit return type to every named function, except React components; inline callbacks may rely on inference. Omit it where the annotation would only restate an unspellable inferred type.
  - Use a `type` alias for React component props, never an `interface`.
  - Always use single quotes, matching the Biome config's `quoteStyle`.
  - Insert an empty line after a multi-line block statement (`if`, `for`, `while`, `do`/`while`, `switch`, `try`/`catch`), unless it is the last statement in its scope. Never insert one before a continuation keyword (`} else {`, `} catch {`, `} finally {`, `} while (…);`).
- Cypress:
  - Select elements only via `cy.get('[data-cy=...]')`; add a `data-cy` attribute to every element a test targets.
  - Keep `it()` titles to a few words naming the main thing, not action→result sentences.
