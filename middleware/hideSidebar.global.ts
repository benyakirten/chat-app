export default defineNuxtRouteMiddleware(() => {
  const layoutStore = useLayoutStore()
  layoutStore.setSidebarState(false)
})
