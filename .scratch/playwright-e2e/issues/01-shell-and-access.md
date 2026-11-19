# 01: Shell & access, with the e2e infrastructure

**What to build:** A developer runs one command and gets a complete, isolated end-to-end run: fresh Postgres and RustFS containers with migrations applied, saved sessions for two developer-provided Clerk test users (an author and an other user), and a dev server on its own port, all torn down afterwards. The first area's specs run through it: a signed-out visitor sees the landing page and is sent back to the root from guarded pages, a signed-in user sees the overview, the sidebar navigates, color mode switches, and a user who is not a course's author is sent to Courses when opening its editor.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] The e2e test script runs the whole suite without the Compose services running and without touching the dev database or buckets.
- [x] Global setup starts Postgres and RustFS through testcontainers (same images as the `db` Vitest project), runs the migrations, creates the e2e buckets and allows the e2e origin for CORS.
- [x] Global setup looks up both developer-provided Clerk test users by `E2E_AUTHOR_EMAIL` and `E2E_OTHER_EMAIL` from the local env file, stops the run with a message naming the variable when one is unset or its user doesn't exist, and never creates or changes Clerk users.
- [x] Global setup spawns the dev server on port 3100 with the container connection details in env and waits until it responds; Playwright's `webServer` is not used.
- [x] Teardown stops the dev server and both containers, also after a failed run.
- [x] Each user has a saved signed-in session produced once per run with Clerk testing tokens.
- [x] A fixture truncates all application tables before each test; tests run serially with one worker; failing tests keep a trace.
- [x] The DB factories can arrange data against the e2e database outside a test transaction, and the `db` Vitest project stays green.
- [x] Specs cover: landing at the root when signed out, overview at the root when signed in, redirect to the root from My Courses, overview and a course editor when signed out, sidebar navigation to every link, color mode toggle, and a non-author opening a course editor being sent to Courses.
- [x] Chromium only; e2e is not in the pre-commit hook.
- [x] A Playwright tests reference doc holds the locator, title, fixture and isolation rules, and the agent instructions point to it in one line, both in place before the first spec is written.
- [ ] README has an "End-to-end tests" section (prerequisites, Clerk dev instance and the two test users to provide, Docker, command, sandbox firewall domains).

## Decisions

- Sandbox firewall, allowed by the user: `cdn.playwright.dev` and `playwright.download.prss.microsoft.com` for the browser download, `large-martin-86.clerk.accounts.dev` for the Clerk frontend API, `api.clerk.com` for the Clerk Backend API.
- Chromium's system libraries are installed in the sandbox with `sudo env "PATH=$PATH" pnpm exec playwright install-deps chromium`.
- Dependency changes are installed on the host first; done for `@playwright/test` 1.65.0 and `@clerk/testing` 2.2.55, each the newest release older than `minimumReleaseAge`. The lockfile was regenerated along the way; `@dnd-kit/*` 0.5.3, `@tanstack/react-query(-devtools)` 5.107.1 and `@tanstack/react-router-ssr-query` 1.167.2 were upgraded so each shares a single copy of `@dnd-kit/abstract` and `@tanstack/query-core`.
- The two Clerk test users are provided by the developer and named by `E2E_AUTHOR_EMAIL` and `E2E_OTHER_EMAIL`; global setup never creates them.

## Steps

1. Make the factories usable outside a test transaction
2. 📦 Add Playwright with containers, migrations, dev server, a signed-out smoke spec and the Playwright reference
3. 📦 Add the provided Clerk test users' saved sessions and the per-test truncate fixture
4. Add the Shell & access specs
5. Document how to run the e2e tests in the README
