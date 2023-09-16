import { describe, expect, it } from 'vitest'

import { arrayify, getFirstSetItem } from './collections'

describe('arrayify', () => {
  it('should return the item unchanged if the argument is already an array', () => {
    const arg = [{ foo: 'bar' }]
    const got = arrayify(arg)
    expect(got).toBe(arg)
  })

  it('should return the argument wrapped in an array if it s not already an array', () => {
    const got = arrayify({ foo: 'bar' })
    expect(got).toEqual([{ foo: 'bar' }])
  })
})

describe('getFirstSetItem', () => {
  it('should return undefined if the set is empty', () => {
    const got = getFirstSetItem(new Set())
    expect(got).toBeUndefined()
  })

  it('should return the first item in the set otherwise', () => {
    const set = new Set<string>()
    set.add('first')
    set.add('second')
    set.add('third')

    const got = getFirstSetItem(set)
    expect(got).toEqual('first')
  })
})
