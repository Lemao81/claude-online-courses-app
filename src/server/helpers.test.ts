import { describe, expect, it } from 'vitest'
import { hasSameIds } from '#/server/helpers'

describe('hasSameIds', () => {
  it('accepts the same ids', () => {
    expect(hasSameIds([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('ignores order', () => {
    expect(hasSameIds([1, 2, 3], [3, 1, 2])).toBe(true)
  })

  it('accepts two empty lists', () => {
    expect(hasSameIds([], [])).toBe(true)
  })

  it('rejects a missing id', () => {
    expect(hasSameIds([1, 2, 3], [1, 2])).toBe(false)
  })

  it('rejects an extra id', () => {
    expect(hasSameIds([1, 2], [1, 2, 3])).toBe(false)
  })

  it('rejects a swapped id', () => {
    expect(hasSameIds([1, 2, 3], [1, 2, 4])).toBe(false)
  })

  it('rejects a duplicate id', () => {
    expect(hasSameIds([1, 2], [1, 1])).toBe(false)
  })

  it('rejects a duplicate padding a missing id', () => {
    expect(hasSameIds([1, 2, 3], [1, 2, 2])).toBe(false)
  })
})
