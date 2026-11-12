import type { CourseReadiness, OutlineLessons } from '@/types'

export function getCourseReadiness(outline: OutlineLessons): CourseReadiness {
  const lessons = [...outline.lessons, ...outline.chapters.flatMap((c) => c.lessons)]

  return {
    hasLessons: lessons.length > 0,
    lessonsMissingVideo: lessons.filter((l) => l.videoStatus !== 'ready'),
  }
}

export function isCourseReady(readiness: CourseReadiness): boolean {
  return readiness.hasLessons && readiness.lessonsMissingVideo.length === 0
}

export function toReadinessNote(readiness: CourseReadiness): string | null {
  if (!readiness.hasLessons) {
    return 'No lessons yet'
  }

  const count = readiness.lessonsMissingVideo.length
  if (count === 0) {
    return null
  }

  return `${count} ${count === 1 ? 'lesson' : 'lessons'} missing a video`
}
