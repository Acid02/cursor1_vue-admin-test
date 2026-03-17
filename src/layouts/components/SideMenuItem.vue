<template>
  <el-sub-menu v-if="hasChildren" :index="resolvedSelfPath">
    <template #title>
      <MenuIcon :name="item.meta?.icon" />
      <span>{{ item.meta?.title }}</span>
    </template>
    <template v-for="c in item.children" :key="c.path">
      <SideMenuItem :item="normalizeChild(c)" :base-path="resolvedSelfPath" />
    </template>
  </el-sub-menu>

  <el-menu-item v-else :index="resolvedSelfPath">
    <MenuIcon :name="item.meta?.icon" />
    <span>{{ item.meta?.title }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AppRouteRecordRaw } from '@/router/types'
import MenuIcon from './icons/MenuIcon.vue'

const props = defineProps<{ item: AppRouteRecordRaw; basePath?: string }>()

const hasChildren = computed(() => (props.item.children?.length ?? 0) > 0)

function resolvePath(r: AppRouteRecordRaw) {
  const base = props.basePath ?? ''
  if (r.path.startsWith('/')) return r.path
  const normalized = `${base}/${r.path}`.replaceAll('//', '/')
  return normalized
}

function normalizeChild(c: AppRouteRecordRaw): AppRouteRecordRaw {
  return { ...c, path: c.path, meta: c.meta, children: c.children }
}

const resolvedSelfPath = computed(() => resolvePath(props.item))
</script>

