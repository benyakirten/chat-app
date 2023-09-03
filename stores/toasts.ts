// Should toasts allow a string or template?

import { defineStore } from "pinia"
import { v4 as uuid } from "uuid"

export type ToastId = string
// TODO: Consider how that would be implemented/typed
export interface Toast {
  id: string
  content: string
  closeable: boolean
  type: 'success' | 'warning' | 'error'
}

type ToastOptions = Partial<Omit<Toast, 'id' | 'content'> & { timeout: number }>

export const useToastStore = defineStore('toasts', () => {
  const toasts = ref<Map<ToastId, Toast>>(new Map())

  /**
   * If timeout is null, the toast won't close on its own.
   * If closeable is false then the user cannot remove the toast.
   */
  function addToast(content: string, { closeable = true, type = 'success', timeout = 3000 }: ToastOptions) {
    const id = uuid()
    const toast: Toast = { id, content, closeable, type }

    toasts.value.set(id, toast)

    if (timeout) {
      setTimeout(() => {
        toasts.value.delete(id)
      }, timeout)
    }

    return id
  }

  function removeToast(id: ToastId) {
    return toasts.value.delete(id)
  }

  function clearToasts() {
    toasts.value = new Map()
  }

  return { toasts, addToast, removeToast, clearToasts }
})
