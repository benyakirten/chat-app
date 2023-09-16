import { describe, expect, beforeEach, afterAll, vi, it, test } from 'vitest'
import { isTextInputFocused, isClickWithinElement, getMouseRelativePosition } from './dom'

describe('isTextInputFocused', () => {
  it('should return true if a text input is focused', () => {
    ;(globalThis as any).document = {
      activeElement: {
        tagName: 'INPUT',
        getAttribute: () => 'text',
      },
    }
    const got = isTextInputFocused()
    expect(got).toBe(true)
  })

  it('should return true if a textarea is focused', () => {
    ;(globalThis as any).document = {
      activeElement: {
        tagName: 'TEXTAREA',
      },
    }
    const got = isTextInputFocused()
    expect(got).toBe(true)
  })

  it('should return true if the element has a contenteditable property', () => {
    ;(globalThis as any).document = {
      activeElement: {
        tagName: 'DIV',
        hasAttribute: (attr: string) => attr === 'contenteditable' && true,
      },
    }
    const got = isTextInputFocused()
    expect(got).toBe(true)
  })

  it('should return false otherwise', () => {
    ;(globalThis as any).document = {
      activeElement: {
        tagName: 'DIV',
        hasAttribute: (attr: string) => false,
      },
    }

    const got = isTextInputFocused()
    expect(got).toBe(false)
  })
})

describe('isClickWithinElement', () => {
  const el = {
    getBoundingClientRect: () => ({
      y: 50,
      height: 100,
      x: 150,
      width: 50,
    }),
  } as any

  it('should return true if the clientX and clientY coordinates of the click is within the top + height and left + width of the element', () => {
    const click = {
      clientX: 150,
      clientY: 75,
    } as any

    const got = isClickWithinElement(click, el)
    expect(got).toBe(true)
  })

  it('should return false if either the clientX or the clientY is not within the element', () => {
    const click = {
      clientX: 2000,
      clientY: 75,
    } as any

    let got = isClickWithinElement(click, el)
    expect(got).toBe(false)
    ;(click.clientX = 150), (click.clientY = 2000)

    got = isClickWithinElement(click, el)
    expect(got).toBe(false)
  })
})

describe('getMouseRelativePosition', () => {
  const el = {
    getBoundingClientRect: () => ({
      top: 75,
      left: 115,
    }),
  } as any

  it('should return the relative coordinates of the click', () => {
    const click = {
      clientY: 85,
      clientX: 170,
      target: el,
    } as any

    const got = getMouseRelativePosition(click)
    expect(got).toEqual({ y: 10, x: 55 })
  })

  it('should return 0,0 if the getBoundingClientRect method on the targe is incorrect for a dom node', () => {
    const click = {
      clientY: 85,
      clientX: 170,
    } as any

    let got = getMouseRelativePosition(click)
    expect(got).toEqual({ x: 0, y: 0 })

    click.target = {
      getBoundingClientRect: 5,
    }

    got = getMouseRelativePosition(click)
    expect(got).toEqual({ x: 0, y: 0 })

    click.target = {
      getBoundingClientRect: () => null,
    }

    got = getMouseRelativePosition(click)
    expect(got).toEqual({ x: 0, y: 0 })
  })
})
