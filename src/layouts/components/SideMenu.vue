<template>
  <el-menu
    class="menu"
    :default-active="activePath"
    :collapse="collapsed"
    router
    background-color="#001529"
    text-color="rgba(255,255,255,0.85)"
    active-text-color="#fff"
  >
    <template v-for="item in menus" :key="item.path">
      <SideMenuItem :item="item" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { constantRoutes } from '@/router/routes'
import type { AppRouteRecordRaw } from '@/router/types'
import SideMenuItem from './SideMenuItem.vue'

defineProps<{ collapsed: boolean }>()

const route = useRoute()
const user = useUserStore()

const activePath = computed(() => route.path)

function hasAccess(r: AppRouteRecordRaw): boolean {
  const roles = r.meta?.roles ?? []
  if (roles.length === 0) return true
  return roles.some((x) => user.roles.includes(x))
}

function toMenuRoutes(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
  return routes
    .filter((r) => r.meta?.hidden !== true)
    .filter((r) => hasAccess(r))
    .map((r) => {
      const children = (r.children ?? []).filter((c) => c.meta?.hidden !== true).filter(hasAccess)
      return { ...r, children }
    })
    .filter((r) => (r.children?.length ?? 0) > 0 || typeof r.name === 'string')
}

const menus = computed(() => {
  // 侧边栏菜单：取所有 layout 下的 children
  const topLevel = constantRoutes.filter((r) => r.path !== '/login' && r.path !== '/:pathMatch(.*)*')
  const flattened: AppRouteRecordRaw[] = []
  for (const r of topLevel) {
    if (r.children && r.children.length > 0) {
      flattened.push({ ...r, children: r.children })
    }
  }
  return toMenuRoutes(flattened)
})
</script>

<style scoped>
.menu {
  border-right: none;
}
</style>

