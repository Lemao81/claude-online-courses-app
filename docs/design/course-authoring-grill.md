# Course Authoring — Design Session

A design interview about the **authoring** half of the app. The tree is closed: every branch below
is settled, confirmed as a shared understanding. The build is tracked commit by commit in
[`course-authoring-plan.md`](course-authoring-plan.md).

Vocabulary settled here lives in [`CONTEXT.md`](../../CONTEXT.md), not in this file.

Session date: 2026-09-16.

## Settled

### Scope

1. **The subject is the authoring experience** — publishing flow, reordering, thumbnails, pricing —
   not the learner-facing side, which stays untouched for now.
2. **Course-level lessons are built first.** They currently have no read path, no creation path and
   no UI, so nothing else in the branch can be dragged, published or priced around them.
3. **Documentation**: `CONTEXT.md` is kept current as terms resolve; ADRs are written only for
   decisions that are hard to reverse, surprising, and a real trade-off.

### The outline model

4. **A lesson may sit directly on a course**, without a chapter, when it does not earn a chapter of
   its own.
5. **Two zones, parent-scoped order.** Course-level lessons come before all chapters. Every parent
   orders its own children: a course orders its lessons and its chapters, a chapter orders its
   lessons. No migration follows from this — `lessons.position` is simply read as parent-scoped,
   which makes both existing indexes (`lessons_course_id_position_idx` and
   `lessons_chapter_id_position_idx`) correct as written.
6. **A lesson may change parent in either direction**, course to chapter and back. It is one
   re-parent operation.
7. **Deleting a chapter promotes its lessons to course level.** It does not delete them. Note the
   composite FK declares no `onDelete`, so a chapter holding lessons cannot currently be deleted at
   all; and neither `createChapter` nor `deleteChapter` exists yet — both must be built.

### Lessons

8. **A lesson holds at most one video and may exist before that video does**, so an author can
   outline a course before recording it.
9. **Lesson creation and video attachment are separate operations.** `createLesson` makes a titled
   empty lesson; `completeVideoUpload` attaches an asset to a lesson that already exists. Uploading
   from "Add lesson" runs both. One way for a lesson to be born.
10. **"Add lesson" creates "Untitled lesson" immediately** and drops into inline rename via the
    existing `EditableText`. No dialog.
11. **`isFreePreview` is deferred**, not dropped — the toggle waits for a learner experience to
    preview into.

### Lifecycle

12. **Publishing requires** at least one lesson, and every lesson to have a `ready` video. Thumbnail
    and price are nudges, not gates.
13. **Published may return to draft. Archived is terminal.** Archiving withdraws a course from the
    catalog and does not revoke access from learners already enrolled.
14. **An unready course shows a readiness checklist**, naming each lesson still missing a video —
    never a disabled publish button.
15. **An enrollment is an access grant** recording the price at the moment access was granted. It is
    not a payment record; payments come later as a separate record.
16. **Price may change at any time**, published or not. The enrollment snapshot is what makes this
    safe.
17. **A thumbnail reuses the video pipeline shape** — presigned MinIO URL, an `assets` row of kind
    `image`, in its own bucket. Replacing one soft-deletes the old asset and enqueues its deletion,
    exactly as `deleteLesson` does.

### Authoring page

18. **Course-level controls live on one page**, `/editcourse/$courseId`, as stacked sections —
    Details, Lessons, Chapters — under a sticky header that holds the status and publish control.
19. **`CourseWithChapters` is replaced** by `getAuthoredCourseOutline` returning
    `CourseOutline = Course & { lessons, chapters }`.
20. **A reorder sends the whole new order for one parent** and rewrites positions `0..n` in a
    transaction. Drag re-parents: a cross-zone drop sends both parents' lists in one transaction. A
    "Move to…" menu action offers the same operation from the keyboard.
21. **Course details auto-save** on blur the way `EditChapter` does — title, subtitle, description
    and price alike. Title is required; price is `>= 0` with two decimals; lengths match the schema.
22. **The publish gate applies only at the moment of publishing.** A published course may gain empty
    lessons or lose videos; learners see only lessons with a ready video, and the readiness
    checklist warns the author.
23. **Unpublishing needs no confirmation; archiving does.** "Archive course" sits in the header's
    overflow menu, not beside Publish, and its dialog says it is permanent and that enrolled
    learners keep access.
24. **`publishedAt` is set on every publish**, so a returning course sorts as new in the catalog.
25. **"Replace video"** uploads a new asset and attaches it to the existing lesson through
    `completeVideoUpload`; the old asset is soft-deleted and its deletion enqueued. Title and
    position are kept, and a failed upload leaves the old video in place.

### Outline editing

27. **Deletion leaves position gaps.** Order is by position, new items take `max + 1`, and the next
    reorder of that parent rewrites `0..n`.
28. **Deleting a chapter appends its lessons** to the end of the course-level lessons, in their
    chapter order, in one transaction. It asks for confirmation ("Remove Chapter"), naming how many
    lessons will move when there are any.
29. **Drag uses a grip handle** per row, with `@dnd-kit/react`, and updates optimistically: on failure
    it rolls back, shows an error toast and invalidates the router.
30. **Drop rules**: lessons drop into the course-level list or any chapter's list, including empty
    chapters (which render a drop zone) and an open `EditChapter` panel. Chapters reorder only among
    chapters.
31. **"Add chapter"** creates "Untitled chapter" at the end and opens its `EditChapter` panel with the
    title focused. "Add lesson" and `VideoUpload` appear under the course-level lessons and inside
    each chapter.

### Readiness, price and thumbnail

32. **The readiness checklist** is summarised as a count in the sticky header beside Publish, which
    scrolls to the full checklist atop the Lessons section; each item jumps to its lesson. It
    disappears when empty, and on a published course the count shows as a warning beside Unpublish.
33. **A price of 0 means free.** The price nudge is a one-line note beside Publish — "This course is
    free". Currency is USD only.
34. **Thumbnails** are JPEG, PNG or WebP up to 5 MB, validated on the client and in the complete
    step, shown at 16:9 with `object-fit: cover`, with no cropping. The Details section shows a
    placeholder and "Replace", with no "Remove".
35. **One lesson row for both zones**: `ChapterLessonListItem` / `ChapterLessonVideo` become
    `LessonListItem` / `LessonVideo` under `components/lessons/`. Course-detail auto-save surfaces
    errors only, as `EditChapter` does.

### Guards and build order

36. **An archived course is read-only** to its author: the editor shows outline and details without
    controls. A new version is a new course.
37. **Only a draft that has never had an enrollment can be deleted**, with confirmation, enforced on
    the server. Its assets are soft-deleted and their deletion enqueued. Every other course can only
    be archived.
38. **A stale reorder is rejected.** The server checks that the sent ids exactly match the parent's
    current children (both parents for a cross-zone drop, allowing for the moved lesson); on mismatch
    nothing is written and the client rolls back with "The outline changed — refreshed".
39. **Status changes are separate server functions** — `publishCourse` (readiness gate, sets
    `publishedAt`), `unpublishCourse` (published only), `archiveCourse` (from draft or published).
40. **`/mycourses` sorts archived courses last**, dimmed, with "View" instead of the edit pencil. No
    filters yet.
41. **Build order**, each slice shippable: (1) outline read path, course-level lesson list, shared
    `LessonListItem`; (2) `createLesson`/`createChapter` with the add controls in both zones;
    (3) `deleteChapter` with promotion, and course delete; (4) drag and "Move to…" reorder;
    (5) Details section with auto-save and thumbnail; (6) status mutations, header, checklist and
    the archived read-only view; (7) "Replace video". The ADR is written first. Vitest
    covers the server rules — publish gate, status transitions, stale reorder, chapter-delete
    promotion, course-delete guard — with no component tests yet.

### Documentation

26. **The two-zone ADR is accepted** (Settled 4–5), and written at
    [`docs/adr/0001-two-zone-course-outline.md`](../adr/0001-two-zone-course-outline.md).

## Out of scope

The authoring tree is closed. What remains is excluded by decision 1:

- Everything learner-facing — catalog, course detail, player, progress, reviews, tags, search — is
  out of scope by decision 1, and is where `enrollments`, `lessonProgress` and `reviews` remain
  unused.
