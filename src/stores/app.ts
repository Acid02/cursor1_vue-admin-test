import { defineStore } from 'pinia'

export type SidebarState = 'expanded' | 'collapsed'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: 'expanded' as SidebarState
  }),
  actions: {
    toggleSidebar() {
      this.sidebar = this.sidebar === 'expanded' ? 'collapsed' : 'expanded'
    }
  }
})

