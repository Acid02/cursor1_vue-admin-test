import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const WHITE_LIST = ['/login']

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (WHITE_LIST.includes(to.path)) {
      if (to.path === '/login' && token) return next({ path: '/' })
      return next()
    }

    if (!token) return next({ path: '/login', query: { redirect: to.fullPath } })

    // 确保用户信息已加载
    if (!userStore.isLoaded) {
      try {
        await userStore.loadProfile()
      } catch (e) {
        userStore.reset()
        return next({ path: '/login', query: { redirect: to.fullPath } })
      }
    }

    const requiredRoles = (to.meta?.roles as string[] | undefined) ?? []
    if (requiredRoles.length > 0 && !requiredRoles.some((r) => userStore.roles.includes(r))) {
      ElMessage.error('无权限访问该页面')
      return next({ path: '/' })
    }

    next()
  })
}

