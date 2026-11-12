import { describe, expect, it } from 'vitest'
import type { AssetStatus, LessonVideo, OutlineLessons } from '@/types'
import { getCourseReadiness, isCourseReady, toReadinessNote } from '@/utils/readiness-helpers'

function makeLesson(id: number, videoStatus: AssetStatus | null = 'ready'): LessonVideo {
  return { id, title: `Lesson ${id}`, durationSec: 60, videoStatus }
}

function toMissingIds(outline: OutlineLessons): number[] {
  return getCourseReadiness(outline).lessonsMissingVideo.map((l) => l.id)
}

describe('getCourseReadiness', () => {
  it('reports a course without lessons', () => {
    expect(getCourseReadiness({ lessons: [], chapters: [{ lessons: [] }] })).toEqual({
      hasLessons: false,
      lessonsMissingVideo: [],
    })
  })

  it('counts chapter lessons as lessons', () => {
    expect(getCourseReadiness({ lessons: [], chapters: [{ lessons: [makeLesson(1)] }] })).toEqual({
      hasLessons: true,
      lessonsMissingVideo: [],
    })
  })

  it('lists a lesson without a video', () => {
    expect(toMissingIds({ lessons: [makeLesson(1), makeLesson(2, null)], chapters: [] })).toEqual([
      2,
    ])
  })

  it('lists a lesson whose video is not ready', () => {
    const lessons = [makeLesson(1, 'pending'), makeLesson(2, 'failed'), makeLesson(3)]

    expect(toMissingIds({ lessons, chapters: [] })).toEqual([1, 2])
  })

  it('lists course-level lessons first, then each chapter in order', () => {
    const outline = {
      lessons: [makeLesson(5, null)],
      chapters: [
        { lessons: [makeLesson(1, null), makeLesson(2)] },
        { lessons: [makeLesson(3, null)] },
      ],
    }

    expect(toMissingIds(outline)).toEqual([5, 1, 3])
  })
})

describe('isCourseReady', () => {
  it('rejects a course without lessons', () => {
    expect(isCourseReady({ hasLessons: false, lessonsMissingVideo: [] })).toBe(false)
  })

  it('rejects a course with a lesson missing its video', () => {
    expect(isCourseReady({ hasLessons: true, lessonsMissingVideo: [makeLesson(1, null)] })).toBe(
      false,
    )
  })

  it('accepts a course whose every lesson has a ready video', () => {
    expect(isCourseReady({ hasLessons: true, lessonsMissingVideo: [] })).toBe(true)
  })
})

describe('toReadinessNote', () => {
  it('notes a course without lessons', () => {
    expect(toReadinessNote({ hasLessons: false, lessonsMissingVideo: [] })).toBe('No lessons yet')
  })

  it('counts one lesson missing a video', () => {
    expect(toReadinessNote({ hasLessons: true, lessonsMissingVideo: [makeLesson(1, null)] })).toBe(
      '1 lesson missing a video',
    )
  })

  it('counts several lessons missing a video', () => {
    const lessonsMissingVideo = [makeLesson(1, null), makeLesson(2, 'pending')]

    expect(toReadinessNote({ hasLessons: true, lessonsMissingVideo })).toBe(
      '2 lessons missing a video',
    )
  })

  it('has no note for a ready course', () => {
    expect(toReadinessNote({ hasLessons: true, lessonsMissingVideo: [] })).toBeNull()
  })
})
