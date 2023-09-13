import { withinRange } from './numbers'

export const isTextInputFocused = () => {
  const el = document.activeElement
  return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.hasAttribute('contenteditable')
}

export const isClickWithinElement = (e: MouseEvent, el: HTMLElement) => {
  const { clientX, clientY } = e
  const { x, y, width, height } = el.getBoundingClientRect()

  return withinRange(clientX, x, x + width) && withinRange(clientY, y, y + height)
}

export const getMouseRelativePosition = (e: MouseEvent) => {
  if (!(e.target instanceof HTMLElement)) {
    return { x: 0, y: 0 }
  }
  const { left, top } = e.target.getBoundingClientRect()
  const { clientX, clientY } = e

  const x = clientX - left
  const y = clientY - top

  return { x, y }
}
