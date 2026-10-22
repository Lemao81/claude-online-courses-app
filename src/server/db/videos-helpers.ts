import { eq } from 'drizzle-orm'
import { videoBucket } from '@/constants'
import { recomputeCourseDuration } from '@/server/db/aggregates-helpers'
import { assets, lessons } from '@/server/db/schema'
import type { Transaction } from '@/server/db/types'
import { statObject } from '@/server/storage/operations'
import type { Lesson, VideoMetadata } from '@/types'

type VideoUpload = VideoMetadata & {
  ownerId: string
  courseId: number
  lessonId: number
  objectName: string
}

export async function attachVideo(tx: Transaction, upload: VideoUpload): Promise<Lesson> {
  const [lesson] = await tx
    .select({ courseId: lessons.courseId, videoAssetId: lessons.videoAssetId })
    .from(lessons)
    .where(eq(lessons.id, upload.lessonId))
    .for('update')

  if (!lesson || lesson.courseId !== upload.courseId) {
    throw new Error('The lesson no longer exists')
  }

  if (lesson.videoAssetId !== null) {
    throw new Error('This lesson already has a video')
  }

  if (!upload.objectName.startsWith(`${upload.ownerId}/${upload.courseId}/`)) {
    throw new Error('The uploaded video does not belong to this course')
  }

  const stat = await statObject(videoBucket, upload.objectName).catch(() => null)

  if (!stat) {
    throw new Error('The uploaded video was not found')
  }

  const [asset] = await tx
    .insert(assets)
    .values({
      ownerId: upload.ownerId,
      kind: 'video',
      status: 'ready',
      bucket: videoBucket,
      objectName: upload.objectName,
      contentType: stat.contentType ?? 'application/octet-stream',
      sizeBytes: stat.size,
      checksum: stat.etag,
      durationSec: upload.durationSec === 0 ? null : upload.durationSec,
      width: upload.width === 0 ? null : upload.width,
      height: upload.height === 0 ? null : upload.height,
    })
    .returning({ id: assets.id })

  const [updated] = await tx
    .update(lessons)
    .set({ videoAssetId: asset.id, durationSec: upload.durationSec })
    .where(eq(lessons.id, upload.lessonId))
    .returning()

  await recomputeCourseDuration(tx, upload.courseId)

  return updated
}
