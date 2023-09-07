export function isTextInputFocused() {
  const el = document.activeElement
  return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.hasAttribute('contenteditable')
}
