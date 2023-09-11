export const useLoading = <T extends (...args: any[]) => Promise<any>>(callback: T) => {
  const loading = ref(false)
  const invoke = async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | Error> => {
    try {
      loading.value = true
      const val = await callback(...args)
      return val
    } catch (e) {
      return e as Error
    } finally {
      loading.value = false
    }
  }

  return { loading, invoke }
}
