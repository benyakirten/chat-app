import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'

import { waitFor } from './misc'

describe('waitFor', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should return a promise that resolves when enough time has passed', async () => {
    let fulfilled: boolean = false
    const promise = waitFor(500).then(() => (fulfilled = true))
    expect(fulfilled).toBe(false)

    await vi.advanceTimersByTimeAsync(600)

    expect(fulfilled).toBe(true)
  })
})
