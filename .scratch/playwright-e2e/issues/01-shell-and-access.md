# 01: Shell & access, with the e2e infrastructure

**What to build:** A developer runs one command and gets a complete, isolated end-to-end run: fresh Postgres and RustFS containers with migrations applied, two Clerk test users (an author and an other user) with saved sessions, and a dev server on its own port, all torn down afterwards. The first area's specs run through it: a signed-out visitor sees the landing page and is sent back to the root from guarded pages, a signed-in user sees the overview, the sidebar navigates, color mode switches, and a user who is not a course's author gets not found when opening its editor.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The e2e test script runs the whole suite without the Compose services running and without touching the dev database or buckets.
- [ ] Global setup starts Postgres and RustFS through testcontainers (same images as the `db` Vitest project), runs the migrations, creates the e2e buckets and allows the e2e origin for CORS.
- [ ] Global setup makes sure both Clerk test users exist, idempotently, using `+clerk_test` email addresses; only the Clerk keys already in the local env file are needed.
- [ ] Global setup spawns the dev server on port 3100 with the container connection details in env and waits until it responds; Playwright's `webServer` is not used.
- [ ] Teardown stops the dev server and both containers, also after a failed run.
- [ ] Each user has a saved signed-in session produced once per run with Clerk testing tokens.
- [ ] A fixture truncates all application tables before each test; tests run serially with one worker; failing tests keep a trace.
- [ ] The DB factories can arrange data against the e2e database outside a test transaction, and the `db` Vitest project stays green.
- [ ] Specs cover: landing at the root when signed out, overview at the root when signed in, redirect to the root from My Courses, overview and a course editor when signed out, sidebar navigation to every link, color mode toggle, and not found for a non-author opening a course editor.
- [ ] Chromium only; e2e is not in the pre-commit hook.
- [ ] A Playwright tests reference doc holds the locator, title, fixture and isolation rules, and the agent instructions point to it in one line, both in place before the first spec is written.
- [ ] README has an "End-to-end tests" section (prerequisites, Clerk dev instance, Docker, command, sandbox firewall domains).

## Steps

1. Make the factories usable outside a test transaction
2. 📦 Add Playwright with containers, migrations, dev server, a signed-out smoke spec and the Playwright reference
3. Add Clerk test users, saved sessions and the per-test truncate fixture
4. Add the Shell & access specs
5. Document how to run the e2e tests in the README
