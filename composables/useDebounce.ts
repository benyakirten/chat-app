export const useDebounce = <T extends (...args: any[]) => void | Promise<void>>(fn: T, timer: number = 800) => {
  const timeout = ref<NodeJS.Timeout | null>(null)

  const clear = () => timeout.value !== null && clearTimeout(timeout.value)

  const debouncer = (...args: Parameters<T>) => {
    clear()
    timeout.value = setTimeout(async () => {
      await fn(...args)
      timeout.value = null
    }, timer)
  }

  return { clear, debouncer }
}
