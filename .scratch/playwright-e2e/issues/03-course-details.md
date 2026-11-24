# 03: Course details

**What to build:** End-to-end coverage of the details section of the course editor: an author edits title, subtitle and price and finds them saved after a reload, sees errors for invalid input, and uploads a thumbnail that replaces the placeholder.

**Blocked by:** 01

**Status:** resolved

- [x] Edited title, subtitle and price are shown after a reload.
- [x] An empty title and an out-of-range price show an error and are not saved.
- [x] A course without a thumbnail shows the placeholder.
- [x] Uploading an image (an existing seed thumbnail) shows it as the course thumbnail, also after a reload.

## Steps

1. Add the details editing and validation specs
2. Add the thumbnail specs
