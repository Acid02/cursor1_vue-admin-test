import { storage } from '@/utils/storage'

export type UserRow = {
  id: string
  username: string
  nickname: string
  role: 'admin' | 'user'
  status: 'enabled' | 'disabled'
  createdAt: string
}

export type UserQuery = {
  keyword?: string
  page: number
  pageSize: number
}

export type Paged<T> = { list: T[]; total: number }

const DB_KEY = 'vue_admin_users_db'

function seedIfNeeded() {
  const existing = storage.get<UserRow[]>(DB_KEY)
  if (existing && Array.isArray(existing) && existing.length > 0) return
  const now = new Date()
  const data: UserRow[] = [
    {
      id: '1',
      username: 'admin',
      nickname: '管理员',
      role: 'admin',
      status: 'enabled',
      createdAt: now.toISOString()
    },
    {
      id: '2',
      username: 'demo',
      nickname: '演示用户',
      role: 'user',
      status: 'enabled',
      createdAt: now.toISOString()
    }
  ]
  storage.set(DB_KEY, data)
}

function readAll(): UserRow[] {
  seedIfNeeded()
  return storage.get<UserRow[]>(DB_KEY) ?? []
}

function writeAll(rows: UserRow[]) {
  storage.set(DB_KEY, rows)
}

function uuid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export async function queryUsers(q: UserQuery): Promise<Paged<UserRow>> {
  const all = readAll()
  const keyword = (q.keyword ?? '').trim().toLowerCase()
  const filtered = keyword
    ? all.filter(
        (r) =>
          r.username.toLowerCase().includes(keyword) || r.nickname.toLowerCase().includes(keyword)
      )
    : all

  const total = filtered.length
  const start = (q.page - 1) * q.pageSize
  const list = filtered.slice(start, start + q.pageSize)

  await new Promise((r) => setTimeout(r, 200))
  return { list, total }
}

export async function createUser(payload: Omit<UserRow, 'id' | 'createdAt'>): Promise<UserRow> {
  const all = readAll()
  if (all.some((u) => u.username === payload.username)) {
    throw new Error('用户名已存在')
  }
  const row: UserRow = { ...payload, id: uuid(), createdAt: new Date().toISOString() }
  writeAll([row, ...all])
  await new Promise((r) => setTimeout(r, 200))
  return row
}

export async function updateUser(id: string, payload: Partial<Omit<UserRow, 'id' | 'createdAt'>>) {
  const all = readAll()
  const idx = all.findIndex((u) => u.id === id)
  if (idx < 0) throw new Error('用户不存在')

  const next = { ...all[idx], ...payload }
  all[idx] = next
  writeAll(all)
  await new Promise((r) => setTimeout(r, 200))
  return next
}

export async function deleteUser(id: string) {
  const all = readAll()
  const next = all.filter((u) => u.id !== id)
  writeAll(next)
  await new Promise((r) => setTimeout(r, 200))
}

