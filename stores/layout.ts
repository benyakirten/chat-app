import { defineStore } from 'pinia'

export interface LayoutState {
  sidebarOpen: boolean
  sidebarTabOpened: "chat" | "account" | "other" | null
}

export const useLayoutStore = defineStore('layout', () => {
  const sidebarOpen = ref(false)
  const sidebarTabOpened = ref<LayoutState['sidebarTabOpened']>(null)

  function toggleOpen() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setSidebarState(state: boolean) {
    sidebarOpen.value = state
  }

  function setTabOpened(tab: LayoutState["sidebarTabOpened"]) {
    sidebarTabOpened.value = tab
  }

  function toggleTabOpened(tab: LayoutState["sidebarTabOpened"]) {
    sidebarTabOpened.value = sidebarTabOpened.value === tab ? null : tab
  }

  const isOpen = computed(() => (tab: LayoutState["sidebarTabOpened"]) => sidebarTabOpened.value === tab)

  return { sidebarOpen, sidebarTabOpened, toggleOpen, setSidebarState, setTabOpened, toggleTabOpened, isOpen }
})

