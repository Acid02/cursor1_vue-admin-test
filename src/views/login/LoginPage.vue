<template>
  <div class="page">
    <div class="card">
      <div class="title">后台管理系统</div>
      <div class="sub">Vue 3 + Vite + Element Plus</div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keyup.enter="onSubmit">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="admin / demo" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="任意非空"
            type="password"
            show-password
            autocomplete="current-password"
          />
        </el-form-item>

        <el-button class="w-full" type="primary" :loading="loading" @click="onSubmit">登录</el-button>

        <div class="tip">
          <div>示例账号：</div>
          <div><b>admin</b>（拥有用户管理权限） / <b>demo</b>（无该权限）</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  username: 'admin',
  password: ''
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function onSubmit() {
  if (loading.value) return
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return

  loading.value = true
  try {
    await user.login({ username: form.username.trim(), password: form.password })
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(1200px 600px at 20% 10%, #e8f2ff 0%, transparent 60%),
    radial-gradient(1000px 500px at 80% 30%, #e9fff6 0%, transparent 55%),
    linear-gradient(180deg, #f5f7fa 0%, #eef2f8 100%);
}

.card {
  width: 420px;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 22px 22px 18px;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.sub {
  margin-top: 6px;
  color: rgba(0, 0, 0, 0.55);
  margin-bottom: 16px;
}

.tip {
  margin-top: 12px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  line-height: 1.6;
}
</style>

