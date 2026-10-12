# Online Courses

An app where authors publish courses made of video material, and learners enroll in a course to
work through it at their own pace.

## Language

**Course**:
A body of teaching material owned by a single author and offered to learners as one unit.
_Avoid_: class, training, program

**Author**:
The user who owns a course and the only user permitted to change it.
_Avoid_: instructor, teacher, creator, owner

**Outline**:
The ordered structure of a course: its course-level lessons first, then its chapters. Every
parent orders its own children — a course orders its lessons and its chapters, a chapter orders
its lessons.
_Avoid_: curriculum, syllabus, table of contents

**Chapter**:
A named group of lessons within one course, used to give a long course structure.
_Avoid_: section, module, unit

**Lesson**:
A single piece of course material a learner works through, holding at most one video. Every
lesson belongs to a course; it may also belong to one chapter of that course, but a lesson that
does not earn a chapter of its own sits directly on the course. A lesson may exist before its
video does, so an author can outline a course before recording it.
_Avoid_: lecture, episode, topic

**Asset**:
A file an author has uploaded — a video, an image or an attachment — which counts as usable only
once it is ready.
_Avoid_: file, upload, media, attachment (as a general term)

**Draft**:
A course that no learner can see and its author may change freely.
_Avoid_: unpublished, private, hidden

**Published**:
A course that appears in the catalog and accepts enrollments. A course may only be published once
it has at least one lesson and every one of its lessons has a ready video. It may return to draft.
_Avoid_: live, public, released

**Archived**:
A course permanently withdrawn from the catalog. Archiving is final and does not take access away
from learners already enrolled; an archived course can no longer be changed, even by its author.
Only a draft that has never had an enrollment may be deleted instead.
_Avoid_: deleted, retired, disabled

**Enrollment**:
A grant of access to one course for one learner, which records the price at the moment access was
granted. An enrollment is not a payment record.
_Avoid_: purchase, order, subscription, registration
