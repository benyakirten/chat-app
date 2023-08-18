import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebarOpen: false,
  }),
  actions: {
    toggleOpen() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setSidebar(state: boolean) {
      this.sidebarOpen = state
    }
  }
})
