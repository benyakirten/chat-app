export const waitFor = async (time: number) => new Promise((resolve) => setTimeout(() => resolve(true), time))
export const retry = async (callback: () => boolean, time: number = 50, maxRetries: number = 10) => {
  for (let i = 0; i < maxRetries; i++) {
    await waitFor(time)
    if (callback()) {
      return true
    }
  }

  return false
}
