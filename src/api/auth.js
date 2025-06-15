// src/api/auth.js
import api from './axios' // Это ваш настроенный экземпляр axios из axios.js

export default {
    async login(credentials) {
        const response = await api.post('/auth/login', credentials)
        return response.data
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData)
        return response.data
    },

    async refresh() {
        const response = await api.post('/auth/refresh')
        return response.data
    },

    async logout() {
        const response = await api.post('/auth/logout')
        return response.data
    },

    // <-- НОВАЯ ФУНКЦИЯ для получения email
    async getUserEmail() {
        // Использование 'api' гарантирует, что baseURL 'https://api.codular.ru/api/v1'
        // и интерцепторы применяются автоматически.
        // Маршрут будет выглядеть как 'https://api.codular.ru/api/v1/user/email'
        const response = await api.get('/user/email')
        return response.data // Возвращаем только data из ответа
    },
}