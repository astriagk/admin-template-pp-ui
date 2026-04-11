import { STORAGE_KEYS } from '@src/shared/constants/enums'
import LocalStorage from '@src/utils/LocalStorage'
import axios, { AxiosInstance } from 'axios'
import NProgress from 'nprogress'

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

// Request interceptor - Start NProgress and add Authorization header
api.interceptors.request.use(
  (config) => {
    NProgress.start()

    // Add Authorization header if token exists
    if (typeof window !== 'undefined') {
      const token = LocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    NProgress.done()
    return Promise.reject(error)
  }
)

// Response interceptor - Complete NProgress on API response
api.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response
  },
  (error) => {
    NProgress.done()
    return Promise.reject(error)
  }
)

export default api
