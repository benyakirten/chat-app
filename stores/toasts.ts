// Should toasts allow a string or template?

import { defineStore } from 'pinia'

const DEFAULT_TOAST_TIMEOUT = 3_000

export type ToastId = string
// TODO: Consider how that would be implemented/typed
export interface Toast {
  id: string
  content: string
  closeable: boolean
  type: 'success' | 'warning' | 'error' | 'info'
}

type ToastOptions = Partial<Omit<Toast, 'id' | 'content'> & { timeout: number | null }>

export const useToastStore = defineStore('toasts', () => {
  const toasts = ref<Map<ToastId, Toast>>(new Map())

  /**
   * If timeout is null, the toast won't close on its own.
   * If closeable is false then the user cannot remove the toast.
   */
  function add(
    content: string,
    { closeable = true, type = 'success', timeout = DEFAULT_TOAST_TIMEOUT }: ToastOptions = {}
  ) {
    const id = crypto.randomUUID()
    const toast: Toast = { id, content, closeable, type }

    toasts.value.set(id, toast)

    if (timeout) {
      setTimeout(() => {
        dismiss(id)
      }, timeout)
    }

    return id
  }

  function dismiss(id: ToastId) {
    return toasts.value.delete(id)
  }

  function clear() {
    toasts.value = new Map()
  }

  function addErrorToast(err: any, msg: string) {
    add(msg, {
      type: 'error',
      timeout: 1800,
    })

    if (err) {
      console.error(err)
    }
  }

  return { toasts, add, dismiss, clear, addErrorToast }
})
