import { defineStore } from 'pinia'

export interface LayoutState {
  sidebarOpen: boolean
  sidebarTabOpened: "chat" | "account" | "other" | null
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    sidebarOpen: false,
    sidebarTabOpened: null
  }),
  actions: {
    toggleOpen() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setSidebarState(state: boolean) {
      this.sidebarOpen = state
    },
    setTabOpened(tab: LayoutState["sidebarTabOpened"]) {
      this.sidebarTabOpened = tab
    }
  }
})
