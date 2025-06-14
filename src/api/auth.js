// src/api/auth.js
import api from './axios'

// checkAuth может быть использован для первоначальной проверки, но Pinia Store предпочтительнее
// export const checkAuth = () => {
//   const token = localStorage.getItem('access_token')
//   return !!token
// }

export default {
    async login(credentials) {
        const response = await api.post('/auth/login', credentials)
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token) // Сохраняем токен
        }
        return response.data
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData)
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token) // Сохраняем токен
        }
        return response.data
    },

    async refresh() {
        const response = await api.post('/auth/refresh')
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token) // Сохраняем токен
        }
        return response.data
    },

    async logout() {
        localStorage.removeItem('access_token') // Удаляем токен при выходе
        const response = await api.post('/auth/logout')
        return response.data
    },
}