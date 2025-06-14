// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null
    }),
    actions: {
        async login(email, password) {
            const { data } = await api.post('/auth/login', { email, password })
            this.accessToken = data.access_token
        },
        async register(email, password) {
            const { data } = await api.post('/auth/register', { email, password })
            this.accessToken = data.access_token
        },
        async refreshToken() {
            const { data } = await api.post('/auth/refresh')
            this.accessToken = data.access_token
        },
        async logout() {
            await api.post('/auth/logout')
            this.accessToken = null
        }
    }
})
