# Playwright end-to-end tests — Plan

Spec: [spec.md](spec.md)

## [01 Shell & access, with the e2e infrastructure](issues/01-shell-and-access.md)

- [x] 1.1 Make the factories usable outside a test transaction
- [x] 1.2 📦 Add Playwright with containers, migrations, dev server, a signed-out smoke spec and the Playwright reference
- [x] 1.3 📦 Add the provided Clerk test users' saved sessions and the per-test truncate fixture
- [x] 1.4 Add the Shell & access specs
- [x] 1.5 Document how to run the e2e tests in the README

## [02 My Courses](issues/02-my-courses.md)

- [ ] 2.1 Add the list, empty state and New Course specs
- [ ] 2.2 Add the delete and archive specs

## [03 Course details](issues/03-course-details.md)

- [ ] 3.1 Add the details editing and validation specs
- [ ] 3.2 Add the thumbnail specs

## [04 Outline](issues/04-outline.md)

- [ ] 4.1 Add the lesson and chapter add, rename and delete specs
- [ ] 4.2 Add the drag reordering specs
- [ ] 4.3 Add the move menu specs

## [05 Video upload](issues/05-video-upload.md)

- [ ] 5.1 Add the WebM fixture and the multi-file upload specs
- [ ] 5.2 Add the chapter upload, file filtering and video replacement specs

## [06 Lifecycle](issues/06-lifecycle.md)

- [ ] 6.1 Add the readiness and publish specs
- [ ] 6.2 Add the unpublish, archive and read-only editor specs
