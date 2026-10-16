import { describe, expect, it } from 'vitest'
import type { ChapterWithLessons, CourseOutline, LessonVideo } from '@/types'
import { moveLessonToParent, toLessonGroups } from '@/utils/outline-helpers'

const createdAt = new Date('2026-01-01')

function makeLesson(id: number): LessonVideo {
  return { id, title: `Lesson ${id}`, durationSec: 60 }
}

function makeChapter(id: number, lessonIds: number[]): ChapterWithLessons {
  return {
    id,
    courseId: 1,
    position: 0,
    title: `Chapter ${id}`,
    description: '',
    durationSec: 0,
    createdAt,
    updatedAt: createdAt,
    lessons: lessonIds.map(makeLesson),
  }
}

function makeOutline(lessonIds: number[], chapters: ChapterWithLessons[]): CourseOutline {
  return {
    id: 1,
    title: 'Course',
    subtitle: '',
    description: '',
    authorId: 'user_1',
    status: 'draft',
    publishedAt: null,
    thumbnailAssetId: null,
    price: '0',
    rating: null,
    ratingCount: 0,
    durationSec: 0,
    createdAt,
    updatedAt: createdAt,
    lessons: lessonIds.map(makeLesson),
    chapters,
    thumbnailUrl: null,
  }
}

function toLessonIds(outline: CourseOutline): Record<string, number[]> {
  return Object.fromEntries(
    Object.entries(toLessonGroups(outline)).map(([group, lessons]) => [
      group,
      lessons.map((l) => l.id),
    ]),
  )
}

describe('moveLessonToParent', () => {
  const outline = makeOutline([1, 2], [makeChapter(10, [3, 4]), makeChapter(11, [])])

  it('appends a course-level lesson to a chapter', () => {
    expect(toLessonIds(moveLessonToParent(outline, 1, 10))).toEqual({
      course: [2],
      'chapter-10': [3, 4, 1],
      'chapter-11': [],
    })
  })

  it('appends a chapter lesson to the course-level lessons', () => {
    expect(toLessonIds(moveLessonToParent(outline, 3, null))).toEqual({
      course: [1, 2, 3],
      'chapter-10': [4],
      'chapter-11': [],
    })
  })

  it('moves a lesson into an empty chapter', () => {
    expect(toLessonIds(moveLessonToParent(outline, 4, 11))).toEqual({
      course: [1, 2],
      'chapter-10': [3],
      'chapter-11': [4],
    })
  })

  it('keeps the outline for an unknown lesson', () => {
    expect(moveLessonToParent(outline, 99, 10)).toBe(outline)
  })

  it('keeps the outline for an unknown chapter', () => {
    expect(moveLessonToParent(outline, 1, 99)).toBe(outline)
  })
})
