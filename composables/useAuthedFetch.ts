import { UseFetchOptions } from 'nuxt/app'

export const useAuthedFetch = <T>(
  url: string,
  method: 'POST' | 'PATCH' | 'GET' | 'DELETE',
  body?: object,
  options: UseFetchOptions<T> = {}
) => {
  const userStore = useUsersStore()
  const token = userStore.me?.token
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  return useFetch(url, { ...options, method, body })
}
