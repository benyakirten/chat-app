export const useDebounce = <T extends (...args: any[]) => void>(fn: T, timer: number = 800) => {
  const timeout = ref<NodeJS.Timeout | null>(null)

  const debouncer = (...args: Parameters<T>) => {
    if (timeout.value) {
      clearTimeout(timeout.value)
    }

    timeout.value = setTimeout(() => fn(...args), timer)
  }

  return debouncer
}
