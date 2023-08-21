import { defineStore } from 'pinia'

export interface LayoutState {
  sidebarOpen: boolean
  sidebarTabOpened: "chat" | "account" | "other" | null
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    sidebarOpen: false,
    sidebarTabOpened: null,
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
    },
    toggleTabOpened(tab: LayoutState["sidebarTabOpened"]) {
      this.sidebarTabOpened = this.sidebarTabOpened === tab ? null : tab
    },
  },
  getters: {
    isOpen: (state) => (tab: LayoutState["sidebarTabOpened"]) => state.sidebarTabOpened === tab
  }
})
