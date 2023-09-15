interface EventHost<T extends Event> {
  addEventListener(name: string, callback: (evt: T) => void): void
  removeEventListener(name: string, callback: (evt: T) => void): void
}

type HostGetter<T extends Event> = () => EventHost<T> | null

export const useAddMountedEventCallback = <T extends Event>(
  eventName: string,
  callback: (evt: T) => void,
  hostGetter: HostGetter<T> = () => globalThis
) => {
  function modifyHostEvents(eventType: 'add' | 'remove') {
    const host = hostGetter()
    if (!host) {
      return
    }
    host[`${eventType}EventListener`](eventName, callback)
  }

  onMounted(() => modifyHostEvents('add'))
  onUnmounted(() => modifyHostEvents('remove'))
}
