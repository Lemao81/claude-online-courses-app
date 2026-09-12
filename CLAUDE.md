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
- **Server/DB**: Drizzle ORM with PostgreSQL (`src/server/db/schema.ts` → `src/server/db/client.ts`). Requires `DATABASE_URL` in `.env.local`.
- **Client state**: TanStack Query for server-fetched data.

**Auth**: Clerk (`@clerk/tanstack-react-start`). Provider is at `src/providers/AppClerkProvider.tsx`, rendered by `src/layouts/RootDocument.tsx`. Requires `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local`. Use `<Show when="signed-in">` / `<Show when="signed-out">` for client-side guarding, or `requireSignedIn()` from `src/server/functions/auth.functions.ts` in a route's `beforeLoad`.

**Styling**: Chakra UI v3. The design system lives in `src/theme/` — `index.ts` holds global CSS, color tokens, semantic tokens, text styles, layer styles and animation styles, `recipes/` extends the built-in single-part recipes, and `slot-recipes/` the multi-part ones. Components style themselves with `variant`, `textStyle` and `layerStyle` props rather than `css` objects. `src/styles.css` holds only the font imports and the nav link classes. Theme (light/dark/auto) is toggled via `localStorage` and resolved by an inline script injected in `__root.tsx` to prevent flash.

**Forms**: TanStack Form via `useForm` + `form.Field`, with Chakra UI field primitives styled by the `field` slot recipe and the `input`/`textarea` recipes.

**Linting/Formatting**: Biome (not ESLint/Prettier). Config in `biome.json` — tabs for indentation, double quotes for JS/TS. `src/routeTree.gen.ts` and `src/styles.css` are excluded from Biome.

**Path alias**: `#/*` maps to `src/*` (configured in `tsconfig.json` `paths`; Vite picks it up via `resolve.tsconfigPaths`).

## Key conventions

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
  - Omit the braces and `return` when an arrow function body is a single expression, except in React components; keep them where the implicit return would change behaviour, such as a `useEffect` callback, or where it would return a value from a `forEach` callback, such as `Map.set` or `Array.push`.
  - Shorten an inline callback's parameter to the first letter of the last word in its name when the body is a single expression on one line. Keep the full name when the body spans multiple lines, when two parameters would collide on the same letter, when that letter is already bound in scope, or when the parameter is used as a JSX namespace.
  - Add an explicit return type to every named function, except React components; inline callbacks may rely on inference. Omit it where the annotation would only restate an unspellable inferred type.
  - Use a `type` alias for React component props, never an `interface`.
  - Always use single quotes, matching the Biome config's `quoteStyle`.
  - Import a directory's `index` module by the directory alone — `<dir>`, never `<dir>/index`.
  - Insert an empty line after a multi-line block statement (`if`, `for`, `while`, `do`/`while`, `switch`, `try`/`catch`), unless it is the last statement in its scope. Never insert one before a continuation keyword (`} else {`, `} catch {`, `} finally {`, `} while (…);`).
- Cypress:
  - Select elements only via `cy.get('[data-cy=...]')`; add a `data-cy` attribute to every element a test targets.
  - Keep `it()` titles to a few words naming the main thing, not action→result sentences.
