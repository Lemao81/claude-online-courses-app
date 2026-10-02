import type { CourseOutline, LessonVideo } from '#/types'

const courseLevelGroup = 'course'

export function toLessonGroup(chapterId: number | null): number | string {
  return chapterId ?? courseLevelGroup
}

export function toChapterId(group: number | string | undefined): number | null {
  return typeof group === 'number' ? group : null
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const moved = [...items]
  const [item] = moved.splice(from, 1)
  moved.splice(to, 0, item)

  return moved
}

export function getParentLessons(outline: CourseOutline, chapterId: number | null): LessonVideo[] {
  if (chapterId === null) {
    return outline.lessons
  }

  return outline.chapters.find((c) => c.id === chapterId)?.lessons ?? []
}

export function setParentLessons(
  outline: CourseOutline,
  chapterId: number | null,
  lessons: LessonVideo[],
): CourseOutline {
  if (chapterId === null) {
    return { ...outline, lessons }
  }

  return {
    ...outline,
    chapters: outline.chapters.map((c) => (c.id === chapterId ? { ...c, lessons } : c)),
  }
}
