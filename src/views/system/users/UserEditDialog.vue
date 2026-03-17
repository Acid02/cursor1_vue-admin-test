<template>
  <el-dialog v-model="visible" :title="title" width="520px" destroy-on-close>
    <el-form ref="formRef" :model="model" :rules="rules" label-width="92px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="model.username" :disabled="mode === 'edit'" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="model.nickname" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="model.role" class="w-full">
          <el-option label="管理员" value="admin" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="model.status">
          <el-radio-button label="enabled">启用</el-radio-button>
          <el-radio-button label="disabled">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onOk">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UserRow } from '@/api/users'

type Mode = 'create' | 'edit'

const props = defineProps<{
  modelValue: boolean
  mode: Mode
  initial?: Partial<UserRow>
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', v: Omit<UserRow, 'id' | 'createdAt'>): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const loading = computed(() => props.loading ?? false)
const formRef = ref<FormInstance>()

const model = reactive<Omit<UserRow, 'id' | 'createdAt'>>({
  username: '',
  nickname: '',
  role: 'user',
  status: 'enabled'
})

watch(
  () => props.initial,
  (v) => {
    model.username = v?.username ?? ''
    model.nickname = v?.nickname ?? ''
    model.role = (v?.role as any) ?? 'user'
    model.status = (v?.status as any) ?? 'enabled'
  },
  { immediate: true }
)

const title = computed(() => (props.mode === 'create' ? '新增用户' : '编辑用户'))

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

async function onOk() {
  const ok = await formRef.value?.validate().catch(() => false)
  if (!ok) return
  emit('submit', { ...model })
}
</script>

