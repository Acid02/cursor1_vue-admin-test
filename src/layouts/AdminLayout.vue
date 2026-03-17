<template>
  <div class="layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="brand">
        <span class="logo">VA</span>
        <span v-if="!isCollapsed" class="title">Vue Admin</span>
      </div>
      <SideMenu :collapsed="isCollapsed" />
    </aside>

    <section class="main">
      <header class="header">
        <div class="left">
          <el-button text @click="app.toggleSidebar()">
            <el-icon><Menu /></el-icon>
          </el-button>
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="b in breadcrumbs" :key="b.path">
                {{ b.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="right">
          <el-tag type="info" effect="plain">{{ user.nickname || user.username || '未登录' }}</el-tag>
          <el-dropdown>
            <span class="dropdown-trigger">
              <el-icon><User /></el-icon>
              <span class="ml8">账户</span>
              <el-icon class="ml4"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="onLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, User, ArrowDown } from '@element-plus/icons-vue'
import SideMenu from './components/SideMenu.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const app = useAppStore()
const user = useUserStore()
const route = useRoute()
const router = useRouter()

const isCollapsed = computed(() => app.sidebar === 'collapsed')

const breadcrumbs = computed(() => {
  return route.matched
    .filter((m) => m.meta?.title && m.meta?.hidden !== true)
    .map((m) => ({ path: m.path, title: String(m.meta?.title) }))
})

async function onLogout() {
  user.logout()
  await router.replace('/login')
}
</script>

<style scoped>
.layout {
  height: 100%;
  display: flex;
}

.sidebar {
  width: 220px;
  background: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
}

.sidebar.collapsed {
  width: 64px;
}

.brand {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  font-weight: 700;
}

.title {
  font-weight: 600;
  letter-spacing: 0.3px;
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.header {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.breadcrumb {
  min-width: 0;
  overflow: hidden;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.ml4 {
  margin-left: 4px;
}
.ml8 {
  margin-left: 8px;
}

.content {
  padding: 16px;
  overflow: auto;
  flex: 1;
}
</style>

