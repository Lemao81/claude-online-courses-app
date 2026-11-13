import { isRedirect } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { requireEditableCourse } from '@/server/functions/access-helpers'

function catchThrown(run: () => void): unknown {
  try {
    run()
  } catch (error) {
    return error
  }

  return undefined
}

describe('requireEditableCourse', () => {
  it('accepts the author of a draft', () => {
    expect(() =>
      requireEditableCourse({ authorId: 'user_1', status: 'draft' }, 'user_1'),
    ).not.toThrow()
  })

  it('accepts the author of a published course', () => {
    expect(() =>
      requireEditableCourse({ authorId: 'user_1', status: 'published' }, 'user_1'),
    ).not.toThrow()
  })

  it('redirects another user', () => {
    const thrown = catchThrown(() =>
      requireEditableCourse({ authorId: 'user_1', status: 'draft' }, 'user_2'),
    )

    expect(isRedirect(thrown)).toBe(true)
  })

  it('redirects another user before revealing the archived status', () => {
    const thrown = catchThrown(() =>
      requireEditableCourse({ authorId: 'user_1', status: 'archived' }, 'user_2'),
    )

    expect(isRedirect(thrown)).toBe(true)
  })

  it('rejects an archived course', () => {
    expect(() =>
      requireEditableCourse({ authorId: 'user_1', status: 'archived' }, 'user_1'),
    ).toThrow('An archived course can no longer be changed')
  })
})
