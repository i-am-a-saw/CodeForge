// src/api/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
    baseURL: 'https://api.codular.ru/api/v1',
    withCredentials: true // отправка http-only cookie (refresh токен)
})

// Добавляем access-токен в заголовки
api.interceptors.request.use(config => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
})

// Обработка 401 и попытка обновления access-токена
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        const authStore = useAuthStore()

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                await authStore.refreshToken()
                originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
                return api(originalRequest)
            } catch (e) {
                await authStore.logout()
                return Promise.reject(e)
            }
        }
        return Promise.reject(error)
    }
)

export default api
