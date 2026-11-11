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
