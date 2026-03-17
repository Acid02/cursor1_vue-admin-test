import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export type UserProfile = {
  id: string
  username: string
  nickname: string
  roles: string[]
}

const TOKEN_KEY = 'vue_admin_token'
const PROFILE_KEY = 'vue_admin_profile'

function fakeToken(username: string) {
  return btoa(`${username}:${Date.now()}`)
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: storage.get<string>(TOKEN_KEY) ?? '',
    profile: (storage.get<UserProfile>(PROFILE_KEY) ?? null) as UserProfile | null,
    isLoaded: false
  }),
  getters: {
    username: (s) => s.profile?.username ?? '',
    nickname: (s) => s.profile?.nickname ?? '',
    roles: (s) => s.profile?.roles ?? []
  },
  actions: {
    async login(payload: { username: string; password: string }) {
      // demo：仅做演示。实际项目请接真实接口
      const { username, password } = payload
      if (!username || !password) throw new Error('用户名或密码不能为空')

      const roles = username === 'admin' ? ['admin'] : ['user']
      const profile: UserProfile = {
        id: username === 'admin' ? '1' : '2',
        username,
        nickname: username === 'admin' ? '管理员' : '普通用户',
        roles
      }

      this.token = fakeToken(username)
      this.profile = profile
      this.isLoaded = true

      storage.set(TOKEN_KEY, this.token)
      storage.set(PROFILE_KEY, profile)
    },
    async loadProfile() {
      // demo：从 localStorage 恢复；也可改为请求 /me
      const profile = storage.get<UserProfile>(PROFILE_KEY)
      if (!profile) throw new Error('未登录')
      this.profile = profile
      this.isLoaded = true
    },
    logout() {
      this.reset()
    },
    reset() {
      this.token = ''
      this.profile = null
      this.isLoaded = false
      storage.remove(TOKEN_KEY)
      storage.remove(PROFILE_KEY)
    }
  }
})

