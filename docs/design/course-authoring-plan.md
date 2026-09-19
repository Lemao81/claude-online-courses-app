# Course Authoring — Implementation Plan

This plan builds the design in [`course-authoring-grill.md`](course-authoring-grill.md). "Settled N"
refers to decision N in that file.

## How to work through it

- **One commit at a time.** Implement a single unchecked commit below, type-check it, then stop and
  report what changed and the proposed commit message. The user reviews, runs `pnpm check` /
  `pnpm test`, and says when to commit. Move on only when the user says to, never automatically
  after a commit.
- **Tick the box in the same commit** that does the work, so the first unchecked box is always the
  next commit, in any session.
- **When a commit turns out wrong-sized** (too big to review, or too small to stand alone), change
  this list in that commit instead of drifting away from it.
- **Resolve a commit's open question with the user** before implementing it, and replace the
  _Open:_ note with the decision in that same commit.
- **Resume in a new session** by reading this file and starting at the first unchecked box.

## Step 1 — Outline read path

- [x] **1.1 Rename the lesson row for use in both zones.** `ChapterLessonList` /
      `ChapterLessonListItem` become `LessonList` / `LessonListItem` in `components/lessons/`, and
      `ChapterLessonVideo` becomes `LessonVideo`. Rename only (Settled 35).
- [x] **1.2 Load the whole outline.** `getAuthoredCourseOutline` returns
      `CourseOutline = Course & { lessons, chapters }`, with course-level lessons ordered by position,
      replacing `getAuthoredCourseWithChapters` and `CourseWithChapters` (Settled 19).
- [x] **1.3 Show course-level lessons** in a Lessons section of `EditCoursePage`, before the
      chapters (Settled 5, 18).

## Step 2 — Creating lessons and chapters

- [x] **2.1 Add `createLesson`** for a course or a chapter parent, titled "Untitled lesson" unless a
      title is given, at `max + 1` (Settled 9, 27).
- [x] **2.2 Attach uploads to an existing lesson.** `completeVideoUpload` takes a lesson id instead
      of a chapter id and a title; `VideoUpload` creates the lesson first, titled from the file name,
      then attaches (Settled 9).
- [x] **2.3 "Add lesson"** creates the lesson and drops into inline rename, in both zones
      (Settled 10, 31).
- [x] **2.4 `VideoUpload` in the course-level zone**, with an optional chapter id (Settled 31).
- [x] **2.5 Add `createChapter` and "Add chapter"**, which appends "Untitled chapter" and opens its
      `EditChapter` panel with the title focused (Settled 31).

## Step 3 — Deleting chapters and courses

- [x] **3.1 Set up Vitest for server rules.** A Testcontainers Postgres, started and migrated once
      per run, with each test inside a rolled-back transaction. Rules take a `Database | Transaction`
      so the tests can call them without auth.
- [x] **3.2 Add `deleteChapter`**, appending its lessons to the course-level zone in chapter order in
      one transaction, with tests (Settled 7, 28). Chapter numbers in the UI come from list order,
      not `position`, since deletion leaves gaps (Settled 27).
- [x] **3.3 "Remove Chapter" control** with a confirmation naming how many lessons move (Settled 28).
- [ ] **3.4 Add `deleteCourse`**, allowed only for a draft that never had an enrollment, soft-deleting
      and enqueuing its assets, with tests (Settled 37).
- [ ] **3.5 Delete-course control** with confirmation.
      _Open:_ where it lives before the step 6 header exists — `/mycourses`, or the editor.

## Step 4 — Reordering

- [ ] **4.1 Add chapter reordering on the server** — whole order for one course, rewrite `0..n`,
      reject stale id sets, with tests (Settled 20, 38).
- [ ] **4.2 Add lesson reordering and re-parenting on the server** — one or two parent lists in one
      transaction, recompute durations, reject stale id sets, with tests (Settled 6, 20, 38).
- [ ] **4.3 Drag lessons within one parent** by a grip handle, optimistic with rollback and an
      error toast (Settled 29).
- [ ] **4.4 Drag lessons across parents**, including empty-chapter drop zones and an open
      `EditChapter` panel (Settled 30).
- [ ] **4.5 Drag chapters** among chapters (Settled 30).
- [ ] **4.6 "Move to…"** menu action for keyboard re-parenting (Settled 20).

## Step 5 — Course details

- [ ] **5.1 Add `updateCourse`** for title, subtitle, description and price, validated as in
      Settled 21.
- [ ] **5.2 Details section** auto-saving on blur, errors only (Settled 21, 35).
- [ ] **5.3 Thumbnail upload on the server** — presigned URL into an image bucket, JPEG/PNG/WebP up to
      5 MB, replacing soft-deletes and enqueues the old asset (Settled 17, 34).
- [ ] **5.4 Thumbnail control** in the Details section, 16:9 cover, placeholder and "Replace"
      (Settled 34).

## Step 6 — Lifecycle

- [ ] **6.1 Course readiness rule** — at least one lesson, and which lessons lack a ready video —
      shared by publishing and the checklist, with tests (Settled 12).
- [ ] **6.2 Add `publishCourse`, `unpublishCourse`, `archiveCourse`**, with tests (Settled 13, 24,
      39).
- [ ] **6.3 Sticky header** built from the editor's title row, keeping its centred title and back
      link, and adding status, Publish/Unpublish, the missing-video count and the free note
      (Settled 18, 32, 33).
- [ ] **6.4 Readiness checklist** atop the Lessons section, each item jumping to its lesson
      (Settled 14, 32).
- [ ] **6.5 "Archive course"** in the header's overflow menu with confirmation (Settled 23).
- [ ] **6.6 Reject changes to archived courses on the server** (Settled 36).
      _Open:_ confirm the server enforces read-only, not only the UI.
- [ ] **6.7 Read-only editor** for archived courses (Settled 36).
- [ ] **6.8 `/mycourses`** lists archived courses last, dimmed, with "View" (Settled 40).

## Step 7 — Replacing a video

- [ ] **7.1 Replace a lesson's video on the server**, soft-deleting and enqueuing the old asset
      (Settled 25).
- [ ] **7.2 "Replace video"** action on the lesson row, keeping the old video if the upload fails
      (Settled 25).
