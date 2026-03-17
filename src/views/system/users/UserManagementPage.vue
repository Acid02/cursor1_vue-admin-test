<template>
  <div class="page">
    <el-card>
      <div class="toolbar">
        <el-form :inline="true" :model="query" @submit.prevent>
          <el-form-item label="关键字">
            <el-input v-model="query.keyword" placeholder="用户名 / 昵称" clearable @clear="reload" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reload">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="actions">
          <el-button type="primary" @click="openCreate">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="mt12">
      <el-table :data="table.list" v-loading="loading" height="520">
        <el-table-column prop="username" label="用户名" min-width="160" />
        <el-table-column prop="nickname" label="昵称" min-width="160" />
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" effect="plain">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'warning'" effect="plain">
              {{ row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="200">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="table.total"
          @change="reload"
        />
      </div>
    </el-card>

    <UserEditDialog
      v-model="dialog.visible"
      :mode="dialog.mode"
      :initial="dialog.initial"
      :loading="dialog.loading"
      @submit="onSubmitDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import UserEditDialog from './UserEditDialog.vue'
import { createUser, deleteUser, queryUsers, updateUser, type UserRow } from '@/api/users'

const loading = ref(false)

const query = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})

const table = reactive({
  list: [] as UserRow[],
  total: 0
})

const dialog = reactive({
  visible: false,
  mode: 'create' as 'create' | 'edit',
  initial: undefined as Partial<UserRow> | undefined,
  loading: false
})

function formatTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}:${p(d.getSeconds())}`
}

async function reload() {
  loading.value = true
  try {
    const res = await queryUsers({
      keyword: query.keyword,
      page: query.page,
      pageSize: query.pageSize
    })
    table.list = res.list
    table.total = res.total
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  query.keyword = ''
  query.page = 1
  query.pageSize = 10
  reload()
}

function openCreate() {
  dialog.mode = 'create'
  dialog.initial = { username: '', nickname: '', role: 'user', status: 'enabled' }
  dialog.visible = true
}

function openEdit(row: UserRow) {
  dialog.mode = 'edit'
  dialog.initial = { ...row }
  dialog.visible = true
}

async function onSubmitDialog(payload: Omit<UserRow, 'id' | 'createdAt'>) {
  dialog.loading = true
  try {
    if (dialog.mode === 'create') {
      await createUser(payload)
      ElMessage.success('新增成功')
      dialog.visible = false
      query.page = 1
      await reload()
      return
    }
    const id = String(dialog.initial?.id || '')
    await updateUser(id, payload)
    ElMessage.success('保存成功')
    dialog.visible = false
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message || '操作失败')
  } finally {
    dialog.loading = false
  }
}

async function onDelete(row: UserRow) {
  const ok = await ElMessageBox.confirm(`确定删除用户「${row.username}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
    .then(() => true)
    .catch(() => false)
  if (!ok) return
  try {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    // 删除后可能出现当前页为空，做一次回退
    if (table.list.length === 1 && query.page > 1) query.page -= 1
    await reload()
  } catch (e: any) {
    ElMessage.error(e?.message || '删除失败')
  }
}

reload()
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mt12 {
  margin-top: 12px;
}

.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.actions {
  display: flex;
  align-items: center;
}

.pager {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}
</style>

