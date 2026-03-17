import type { RouteRecordRaw } from 'vue-router'

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
    roles?: string[]
    affix?: boolean
  }
  children?: AppRouteRecordRaw[]
}

