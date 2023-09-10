interface EventHost<T extends Event> {
  addEventListener(name: string, callback: (evt: T) => void): void
  removeEventListener(name: string, callback: (evt: T) => void): void
}

export const useAddMountedEventCallback = <T extends Event>(
  eventName: string,
  callback: (evt: T) => void,
  host: EventHost<T> = globalThis
) => {
  onMounted(() => host.addEventListener(eventName, callback))
  onUnmounted(() => host.removeEventListener(eventName, callback))
}
