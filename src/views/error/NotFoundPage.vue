<template>
  <el-empty description="页面不存在">
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </el-empty>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() {
  router.replace('/')
}
</script>

