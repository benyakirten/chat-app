import { useLayoutStore } from '@/stores/layout'

export default defineNuxtRouteMiddleware(() => {
  const layoutStore = useLayoutStore()
  layoutStore.setSidebarState(false)
})
