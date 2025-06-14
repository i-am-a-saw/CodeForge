import api from './axios'

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

    async getUserProfile() {
        const response = await api.get('/user/profile')
        return response.data
    }
}