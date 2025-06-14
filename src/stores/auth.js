import { defineStore } from 'pinia'
import authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        user: null,
        isAuthenticated: false
    }),

    actions: {
        async login(credentials) {
            try {
                const response = await authApi.login(credentials)
                this.accessToken = response.access_token
                this.isAuthenticated = true
                // Можно добавить загрузку данных пользователя
                // await this.fetchUser()
                return response
            } catch (error) {
                this.reset()
                throw error
            }
        },

        async register(userData) {
            try {
                const response = await authApi.register(userData)
                this.accessToken = response.access_token
                this.isAuthenticated = true
                return response
            } catch (error) {
                this.reset()
                throw error
            }
        },

        async refreshToken() {
            try {
                const response = await authApi.refresh()
                this.accessToken = response.access_token
                this.isAuthenticated = true
                return response
            } catch (error) {
                this.reset()
                throw error
            }
        },

        async logout() {
            try {
                await authApi.logout()
            } finally {
                this.reset()
            }
        },

        reset() {
            this.accessToken = null
            this.user = null
            this.isAuthenticated = false
        },

        async fetchUser() {
            try {
                this.user = await authApi.getUserProfile()
            } catch (error) {
                this.user = null
                throw error
            }
        },

        async initialize() {
            if (this.accessToken) return

            try {
                await this.refreshToken()
                await this.fetchUser()
            } catch (error) {
                this.reset()
            }
        }
    },

    persist: true // Для сохранения состояния при перезагрузке страницы
})