import { describe, expect, it } from 'vitest'

import { clamp, withinRange, rem } from './numbers'

describe('clamp', () => {
  it('should return the minimum value if the value is less than the minimum', () => {
    const got = clamp(1, 3, 0)
    expect(got).toEqual(1)
  })

  it('should return the maximum value if the value is less than the maximum', () => {
    const got = clamp(1, 3, 4)
    expect(got).toEqual(3)
  })

  it('should return the actual value if it is between the minimum and the maximum', () => {
    const got = clamp(1, 3, 2)
    expect(got).toEqual(2)
  })
})

describe('withinRange', () => {
  it('should return true if the value is between the minimum and the maximum', () => {
    const got = withinRange(4, 1, 10)
    expect(got).toBe(true)
  })

  it('should return false if the value is less than the minimum', () => {
    const got = withinRange(0, 1, 10)
    expect(got).toBe(false)
  })

  it('should return false if the value is moore than the minimum', () => {
    const got = withinRange(12, 1, 10)
    expect(got).toBe(false)
  })
})

describe('rem', () => {
  it('should return the normal value of modulus if the value is positive', () => {
    const got = rem(9, 5)
    expect(got).toEqual(9 % 5)
  })

  it('should work wrap correctly around if provided a negative number', () => {
    const got = rem(-8, 5)
    expect(got).toEqual(2)
  })
})
