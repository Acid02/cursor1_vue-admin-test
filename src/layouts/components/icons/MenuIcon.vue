<template>
  <el-icon v-if="Icon">
    <component :is="Icon" />
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps<{ name?: string }>()

const Icon = computed(() => {
  const n = props.name
  if (!n) return null
  return (Icons as any)[n] ?? null
})
</script>

