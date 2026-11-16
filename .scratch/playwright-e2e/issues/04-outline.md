# 04: Outline

**What to build:** End-to-end coverage of shaping a course's outline: an author adds, renames and deletes lessons and chapters, reorders course-level lessons, chapters and lessons within a chapter by dragging, and moves lessons between the course level and chapters with the move menu. Every change survives a reload, and course-level lessons always come before chapters.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Adding a course-level lesson, a chapter and a lesson inside a chapter shows each in the right place after a reload.
- [ ] Course-level lessons are shown before chapters.
- [ ] Renaming a lesson and a chapter in place is kept after a reload.
- [ ] Deleting a lesson and a chapter asks for confirmation and removes them after a reload.
- [ ] Dragging reorders course-level lessons, chapters, and lessons within a chapter, each order kept after a reload.
- [ ] The move menu moves a lesson from the course level into a chapter, between chapters and back, kept after a reload.
- [ ] Drag-and-drop is driven by real pointer movements; `data-testid` is added only where a drag handle or target has no accessible name.

## Steps

1. Add the lesson and chapter add, rename and delete specs
2. Add the drag reordering specs
3. Add the move menu specs
