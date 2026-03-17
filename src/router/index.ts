import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import { constantRoutes } from './routes'

export const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export function setupRouter(app: App) {
  setupRouterGuards(router)
  app.use(router)
}

