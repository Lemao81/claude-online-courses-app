# 02: My Courses

**What to build:** End-to-end coverage of an author's My Courses page: it shows an empty state or exactly the author's own courses, the New Course dialog creates a course and rejects an invalid title, and the overflow menu deletes a draft after confirmation or archives a course. Deletion is unavailable for a draft that has had an enrollment.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] With no courses, the page shows its empty state.
- [ ] The list shows exactly the author's courses; a course of the other user never appears.
- [ ] Creating a course through the New Course dialog adds it to the list and leads to its editor.
- [ ] The dialog shows an error for an invalid title and creates nothing.
- [ ] Deleting a draft asks for confirmation and removes it from the list, also after a reload; cancelling keeps it.
- [ ] Deletion is unavailable for a draft with an enrollment (arranged through a factory).
- [ ] Archiving from the overflow menu shows the course as archived, also after a reload.

## Steps

1. Add the list, empty state and New Course specs
2. Add the delete and archive specs
