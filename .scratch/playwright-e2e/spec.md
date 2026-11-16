# Playwright end-to-end tests

Status: ready-for-agent

## Problem Statement

The app is tested only below the UI: unit tests for pure helpers and `db` tests for DB helpers and storage operations, run against throwaway containers. Nothing checks that the pages an author actually uses work end to end. Nothing confirms that signing in, opening My Courses, editing a course, shaping its outline, uploading videos and moving it through draft, published and archived all work together through the browser, the server functions, Clerk, Postgres and RustFS. A regression in wiring, routing, an access guard, drag-and-drop or the direct-to-storage upload goes unnoticed until someone clicks through the app by hand.

## Solution

Add a Playwright end-to-end suite that drives the real app in a browser, organised as one spec file per app area: Shell & access, My Courses, Course details, Outline, Video upload and Lifecycle. A single command starts everything the suite needs: fresh Postgres and RustFS containers, two Clerk test users and a dev server on its own port. It then runs each test from an empty database and tears everything down afterwards. Developers run it on demand, on the host or in the sandbox, without touching their dev data or their running dev server.

## User Stories

1. As a developer, I want one command that runs the whole e2e suite, so that I can check the app end to end before a change goes in.
2. As a developer, I want the suite to start its own Postgres and RustFS containers, so that I don't need the Compose services up and my dev data and buckets stay untouched.
3. As a developer, I want the suite to run the database migrations on its fresh database, so that the schema under test always matches the code.
4. As a developer, I want the suite to start its own dev server on a separate port, so that a run never attaches to or disturbs my running dev server.
5. As a developer, I want the suite to tear down its containers and dev server when it finishes or fails, so that runs leave nothing behind.
6. As a developer, I want the two Clerk test users to be created automatically if they don't exist, so that a fresh clone or a new Clerk dev instance needs no manual dashboard setup.
7. As a developer, I want test users signed in through Clerk testing tokens and a saved session per user, so that tests don't go through the sign-in UI every time and aren't stopped by bot protection.
8. As a developer, I want every test to start from an empty database, so that tests are deterministic and can assert exact lists and empty states.
9. As a developer, I want to arrange preconditions through the existing factories, so that tests needing many lessons, ready videos or enrollments stay fast and readable.
10. As a developer, I want e2e kept out of the pre-commit hook, so that commits stay fast and work offline.
11. As a developer, I want clear README instructions for running e2e tests, so that I know the prerequisites and the command.
12. As an agent, I want a Playwright reference doc with locator, naming, fixture and isolation rules, so that new e2e tests follow the same conventions.
13. As a developer, I want failing tests to keep a trace, so that I can see what the browser showed when a test failed.
14. As a signed-out visitor, I want to see the landing page at the root, so that I learn what the app is before signing in.
15. As a signed-in user, I want to see my overview at the root, so that I land in the app rather than on marketing content.
16. As a signed-out visitor, I want to be sent back to the root when I open My Courses, the overview or a course editor, so that private pages stay private.
17. As a user, I want the sidebar links to take me to Overview, Courses, My Courses and About, so that I can move around the app.
18. As a user, I want to switch between light and dark color mode, so that the app suits my surroundings.
19. As a user who is not the author of a course, I want opening its editor to show not found, so that I can neither see nor change another author's course.
20. As an author with no courses, I want My Courses to show an empty state, so that I know I haven't created anything yet.
21. As an author, I want My Courses to list exactly my own courses, so that other authors' courses never appear among mine.
22. As an author, I want to create a course from the New Course dialog, so that I can start building it.
23. As an author, I want the New Course dialog to reject an invalid title, so that I can't create a course without a proper title.
24. As an author, I want a newly created course to open in or link to its editor, so that I can go on working on it immediately.
25. As an author, I want to delete a draft that has never had an enrollment, so that I can get rid of a course I abandoned.
26. As an author, I want deletion confirmed in a dialog, so that I don't delete a course by accident.
27. As an author, I want deletion to be unavailable for a draft that has had an enrollment, so that learners who were granted access are never silently cut off.
28. As an author, I want to archive a course from its overflow menu, so that I can withdraw it permanently.
29. As an author, I want to edit a course's title, subtitle and price, so that its details describe it correctly.
30. As an author, I want my details edits to still be there after a reload, so that I know they were saved.
31. As an author, I want invalid details such as an empty title or an out-of-range price rejected with an error, so that a course never holds bad data.
32. As an author, I want to upload a thumbnail image, so that my course has a recognisable picture.
33. As an author, I want a course without a thumbnail to show a placeholder, so that the page still looks complete.
34. As an author, I want to add a lesson directly to the course, so that short material doesn't need a chapter.
35. As an author, I want to add a chapter, so that I can give a long course structure.
36. As an author, I want to add a lesson inside a chapter, so that related lessons sit together.
37. As an author, I want to rename a lesson and a chapter in place, so that titles stay accurate.
38. As an author, I want to delete a lesson and a chapter after confirming, so that I can remove material I no longer need.
39. As an author, I want to reorder course-level lessons by dragging, so that the outline reads in the order I teach.
40. As an author, I want to reorder chapters by dragging, so that chapters follow my teaching order.
41. As an author, I want to reorder lessons within a chapter by dragging, so that each chapter reads in order.
42. As an author, I want to move a lesson between the course level and a chapter, or between chapters, with the move menu, so that I can restructure without precise dragging.
43. As an author, I want every outline change to still be there after a reload, so that I know the order and structure were saved.
44. As an author, I want course-level lessons always shown before chapters, so that the outline matches the two-zone structure.
45. As an author, I want to drop or pick several video files at once, so that I can add a batch of recordings in one go.
46. As an author, I want non-video files ignored by the drop zone, so that I can't upload the wrong kind of file.
47. As an author, I want to remove a picked file before uploading, so that I can correct my selection.
48. As an author, I want each uploaded video to become a new lesson named after its file, so that my outline grows straight from my recordings.
49. As an author, I want videos uploaded into a chapter to become lessons of that chapter, so that I don't have to move them afterwards.
50. As an author, I want an uploaded lesson to show its video duration, so that I can see how long each lesson is.
51. As an author, I want to replace a lesson's video, so that I can fix a bad recording without recreating the lesson.
52. As an author, I want a success message saying how many videos were uploaded, so that I know the upload finished.
53. As an author, I want a readiness checklist showing what still blocks publishing, so that I know what to do before going live.
54. As an author, I want publishing blocked while my course has no lessons or a lesson lacks a ready video, so that learners never see an incomplete course.
55. As an author, I want to publish a course once it is ready, so that it appears in the catalog and accepts enrollments.
56. As an author, I want to return a published course to draft, so that I can rework it.
57. As an author, I want to archive a course after confirming, so that I can withdraw it permanently.
58. As an author, I want an archived course's editor to be read-only, so that it is clear the course can no longer be changed.
59. As an author, I want the editor header to show the course's current status, so that I always know whether it is draft, published or archived.

## Implementation Decisions

- The suite covers six app areas, one spec file and one implementation issue each, in this order: Shell & access, My Courses, Course details, Outline, Video upload, Lifecycle. The Courses catalog and Overview pages are placeholders and get no area of their own beyond the navigation and root checks in Shell & access.
- The first area (Shell & access) also delivers the whole e2e infrastructure as its tracer bullet. There is no separate infrastructure issue, so every issue ships runnable tests.
- Tooling: `@playwright/test` and `@clerk/testing` as dev dependencies, Chromium only (the bundled build, not branded Chrome). One Playwright config at the repo root, specs in a top-level e2e folder named after their area, and a `test:e2e` script. Adding further browsers later is a config change only.
- Playwright global setup owns the full environment, in this order:
  1. Start Postgres and RustFS through testcontainers, matching the images and approach of the existing `db` Vitest project's global setup.
  2. Run the Drizzle migrations against the fresh database.
  3. Make sure the two Clerk test users exist on the Clerk dev instance through the Backend API, idempotently, using `+clerk_test` email addresses so sign-in needs no real inbox.
  4. Spawn the Vite dev server itself on a dedicated port (3100), with the container database URL, the RustFS endpoint and port and its credentials passed through env, then wait until it responds.
  5. Teardown stops the dev server and both containers.
- Playwright's `webServer` option is not used. Playwright starts `webServer` before `globalSetup`, so it can't receive the container ports, which are only known once global setup has started the containers. Container ports stay dynamic, as in the `db` project.
- The RustFS container allows the e2e dev server's origin for CORS, because the browser uploads straight to storage through presigned URLs. Buckets are created in the e2e storage the same way the app and the seed create them.
- The pg-boss worker is not started: a video becomes ready synchronously when its upload completes, and the worker only deletes assets, which has no visible effect in the UI.
- Two test users: an author, who owns the courses under test, and an other user, who has no access to them. Each user gets a saved signed-in session produced once per run with Clerk testing tokens. Tests pick the session they need. Only `CLERK_SECRET_KEY` and `VITE_CLERK_PUBLISHABLE_KEY`, already present in the local env file, are required.
- Isolation: tests run serially with a single worker, and a fixture truncates all application tables before each test. A user row is recreated on demand, by the app's own upsert on course creation or by a factory.
- Arranging state: the existing DB factories are reused against the e2e database, for data the UI can't create (enrollments) and for preconditions that would be slow through the UI (a course whose lessons all have ready videos, a published or archived course). The factories may need a variant that runs outside a test transaction.
- Fixtures: a tiny WebM (VP8) video clip is committed with the e2e tests, so the browser's metadata probe reads a real duration. An existing seed thumbnail image is reused for thumbnail uploads.
- Locators: role and label based locators first, with `data-testid` added to production components only where an element has no accessible name. No other production change and no test-only auth bypass.
- Documentation: a "End-to-end tests" section in the README for people (prerequisites, Clerk dev instance, Docker, the command, firewall domains for the sandbox). A new Playwright tests reference doc for agents (locators, test title style, fixtures, isolation, arranging through factories). A one-line pointer to it in the agent instructions.
- e2e is not part of the pre-commit hook and has no CI job yet. It runs on demand, on the host and in the sandbox. In the sandbox, the Playwright browser download and the Clerk dev instance domain must be allowed through the firewall, and dependency changes are installed on the host first.

## Testing Decisions

- A good e2e test acts and asserts only through the browser, as a user would: navigate, click, type, drag, drop files, and read what is visible, reloading where it has to prove that a change was saved. Tests never call server functions directly, never assert on DB rows or storage objects, and never stub network calls. DB factories are used only to arrange preconditions.
- Each area covers its main flows plus the domain rules the UI enforces: publishing blocked until every lesson has a ready video, an archived course being read-only, deletion only for a draft that has never had an enrollment, form validation errors, and course-level lessons coming before chapters. Rules already covered in depth by the `db` tests (ordering arithmetic, access helpers) are checked once through the UI, not exhaustively.
- Modules under test, by area:
  - Shell & access: root page by sign-in state, sidebar navigation, guarded-route redirects, color mode, not-found for a non-author.
  - My Courses: list, empty state, the New Course dialog, the overflow menu (delete and archive).
  - Course details: the details form and thumbnail upload.
  - Outline: lesson and chapter add, rename and delete, drag reordering, the move menu.
  - Video upload: the drop zone, multi-file upload, video replacement.
  - Lifecycle: the readiness checklist, publish, unpublish and archive, the read-only editor.
- Drag-and-drop reordering is driven with real pointer movements in the browser, and the resulting order is checked after a reload.
- Test titles stay short, naming the main thing rather than an action-to-result sentence, in line with the existing Cypress reference.
- Prior art: the `db` Vitest project's global setup (testcontainers for Postgres and RustFS, migrations, provided connection details) and its factories are the model for the e2e environment and data arrangement. The Cypress reference is the model for the new Playwright reference doc.

## Out of Scope

- The Courses catalog and the Overview page content, both placeholders today.
- Learner-facing flows: enrolling, watching lessons, progress tracking. They don't exist yet.
- The pg-boss worker and asset deletion jobs.
- Firefox, WebKit, branded Chrome and mobile viewports.
- A CI pipeline for e2e.
- Visual regression and accessibility audits.
- Real sign-up and sign-in UI flows beyond what Clerk testing tokens require.

## Further Notes

- The domain vocabulary follows the glossary: course, author, outline, chapter, lesson, asset, draft, published, archived, enrollment. The outline's two-zone structure (ADR 0001) and enrollment as an access grant (ADR 0002) are what the Outline and My Courses tests assert.
- The exact firewall domains for the sandbox are listed when the first issue starts.
- Adding `@playwright/test` and `@clerk/testing` to `package.json` requires the install to be run on the host before the sandbox's frozen install.
