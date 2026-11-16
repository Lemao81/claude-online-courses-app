# 06: Lifecycle

**What to build:** End-to-end coverage of a course's lifecycle in the editor: the readiness checklist shows what blocks publishing, publishing stays blocked until the course has at least one lesson and every lesson has a ready video, and an author publishes, returns to draft and archives after confirmation. An archived course's editor is read-only, and the header always shows the current status.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The readiness checklist lists what is missing for an empty course and for a course with a lesson without a video.
- [ ] Publishing is unavailable while the course is not ready.
- [ ] A ready course (arranged through factories) can be published and shows published in the header, also after a reload.
- [ ] A published course can return to draft.
- [ ] Archiving asks for confirmation; afterwards the editor shows the course read-only with no editing controls.
- [ ] The header shows draft, published and archived as the status changes.

## Steps

1. Add the readiness and publish specs
2. Add the unpublish, archive and read-only editor specs
