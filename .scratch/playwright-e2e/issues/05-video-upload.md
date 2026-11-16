# 05: Video upload

**What to build:** End-to-end coverage of uploading videos straight to storage: an author picks or drops several video files, removes one before uploading, and each uploaded video becomes a lesson named after its file with its duration shown, in the course or in a chapter. Non-video files are ignored, a success message counts the uploads, and a lesson's video can be replaced.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] A tiny WebM (VP8) clip is committed as an e2e fixture.
- [ ] Uploading several videos at the course level creates one lesson per file, named after the file, with its duration shown, also after a reload.
- [ ] Uploading into a chapter creates the lessons inside that chapter.
- [ ] Non-video files are ignored by the drop zone.
- [ ] A picked file can be removed before uploading and is not uploaded.
- [ ] A success message states how many videos were uploaded.
- [ ] Replacing a lesson's video keeps the lesson and shows the new video.

## Steps

1. Add the WebM fixture and the multi-file upload specs
2. Add the chapter upload, file filtering and video replacement specs
