export const useAddMountedEventCallback = (
  eventName: string,
  callback: EventListenerOrEventListenerObject,
  host: Window | Document = window
) => {
  onMounted(() => {
    host.addEventListener(eventName, callback)
    return () => host.removeEventListener(eventName, callback)
  })
}
