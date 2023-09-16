import { withinRange } from './numbers'

export const isTextInputFocused = () => {
  const el = document.activeElement
  return (
    (el?.tagName === 'INPUT' && el.getAttribute('type') === 'text') ||
    el?.tagName === 'TEXTAREA' ||
    el?.hasAttribute('contenteditable')
  )
}

export const isClickWithinElement = (e: MouseEvent, el: HTMLElement) => {
  const { clientX, clientY } = e
  const { x, y, width, height } = el.getBoundingClientRect()

  return withinRange(clientX, x, x + width) && withinRange(clientY, y, y + height)
}

export const getMouseRelativePosition = (e: MouseEvent) => {
  if (!e.target || !('getBoundingClientRect' in e.target) || typeof e.target.getBoundingClientRect !== 'function') {
    return { x: 0, y: 0 }
  }

  const rect = e.target.getBoundingClientRect()
  if (
    rect === null ||
    typeof rect !== 'object' ||
    !('top' in rect) ||
    !('left' in rect) ||
    typeof rect.top !== 'number' ||
    typeof rect.left !== 'number'
  ) {
    return { x: 0, y: 0 }
  }

  const { left, top } = rect
  const { clientX, clientY } = e

  const x = clientX - left
  const y = clientY - top

  return { x, y }
}
