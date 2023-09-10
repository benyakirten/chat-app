import { withinRange } from './numbers'

export function isTextInputFocused() {
  const el = document.activeElement
  return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.hasAttribute('contenteditable')
}

export function isClickWithinElement(e: MouseEvent, el: HTMLElement) {
  const { clientX, clientY } = e
  const { x, y, width, height } = el.getBoundingClientRect()

  return withinRange(clientX, x, x + width) && withinRange(clientY, y, y + height)
}
