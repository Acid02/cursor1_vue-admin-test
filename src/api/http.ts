import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

http.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

http.interceptors.response.use(
  (resp) => {
    // 兼容：既支持后端统一包裹，也支持直接返回数据
    const data = resp.data as unknown
    if (data && typeof data === 'object' && 'code' in (data as any) && 'data' in (data as any)) {
      const wrapped = data as ApiResponse<unknown>
      if (wrapped.code !== 0) {
        const msg = wrapped.message || '请求失败'
        ElMessage.error(msg)
        return Promise.reject(new Error(msg))
      }
      return wrapped.data as any
    }
    return data as any
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status
    const msg =
      error.response?.data?.message ||
      (status ? `请求失败（${status}）` : '网络异常，请稍后重试')

    if (status === 401) {
      const userStore = useUserStore()
      userStore.reset()
    }

    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

