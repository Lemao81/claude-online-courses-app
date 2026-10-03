import { courseLevelGroup } from '#/constants'
import type { CourseOutline, LessonOrder, LessonVideo } from '#/types'

export type LessonGroups = Record<string, LessonVideo[]>

export function toLessonGroup(chapterId: number | null): string {
  return chapterId === null ? courseLevelGroup : `chapter-${chapterId}`
}

export function toChapterSortableId(chapterId: number): string {
  return `chapter-sortable-${chapterId}`
}

export function toLessonGroups(outline: CourseOutline): LessonGroups {
  const groups: LessonGroups = { [toLessonGroup(null)]: outline.lessons }
  for (const chapter of outline.chapters) {
    groups[toLessonGroup(chapter.id)] = chapter.lessons
  }

  return groups
}

export function setLessonGroups(outline: CourseOutline, groups: LessonGroups): CourseOutline {
  return {
    ...outline,
    lessons: groups[toLessonGroup(null)],
    chapters: outline.chapters.map((c) => ({ ...c, lessons: groups[toLessonGroup(c.id)] })),
  }
}

export function getParentLessons(outline: CourseOutline, chapterId: number | null): LessonVideo[] {
  if (chapterId === null) {
    return outline.lessons
  }

  return outline.chapters.find((c) => c.id === chapterId)?.lessons ?? []
}

export function getChangedLessonOrders(before: CourseOutline, after: CourseOutline): LessonOrder[] {
  const chapterIds = [null, ...after.chapters.map((c) => c.id)]

  return chapterIds
    .map((i) => ({ chapterId: i, lessonIds: getLessonIds(after, i) }))
    .filter((o) => !isSameOrder(getLessonIds(before, o.chapterId), o.lessonIds))
}

function getLessonIds(outline: CourseOutline, chapterId: number | null): number[] {
  return getParentLessons(outline, chapterId).map((l) => l.id)
}

function isSameOrder(ids: number[], otherIds: number[]): boolean {
  return ids.length === otherIds.length && ids.every((id, i) => id === otherIds[i])
}
