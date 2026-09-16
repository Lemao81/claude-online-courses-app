---
status: accepted
---

# Two-zone course outline

A course's outline has two zones: lessons that sit directly on the course come first, then the
course's chapters, each holding its own lessons. We chose this because short courses, and single
lessons that do not earn a chapter of their own, should not need a chapter invented just to hold
them. We also did not want the cost of ordering chapters and lessons together in one sequence.

## Considered Options

- **Every lesson belongs to a chapter.** This gives the simplest tree, but it makes authors wrap
  single lessons in chapters that mean nothing, and learners then see those empty groupings.
- **One sequence mixing lessons and chapters.** This is the most flexible, but it needs a shared
  position across two tables. Every reorder then touches both tables, and nobody has asked to put a
  loose lesson between two chapters.
- **Two zones, with each parent ordering its own children** (chosen).

## Consequences

- `lessons.chapterId` is nullable. A lesson whose `chapterId` is null sits directly on its course.
- `lessons.position` and `chapters.position` are counted separately for each parent. A course orders
  its own lessons and its chapters as two separate lists, and a chapter orders its lessons. So
  position numbers repeat across a course, and only mean something next to the lesson's parent.
- A lesson can move between the course and a chapter, in either direction. Deleting a chapter moves
  its lessons to the end of the course-level lessons, instead of deleting them.
- Code that walks the outline has to read both zones: course-level lessons first, then chapters.
  Loading only chapters silently drops the course-level lessons.
