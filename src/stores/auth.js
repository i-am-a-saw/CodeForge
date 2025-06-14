// src/stores/auth.js
import { defineStore } from 'pinia'
import authApi from '../api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        user: null,
        isAuthenticated: false // Вернули как реактивное свойство
    }),

    actions: {
        async login(credentials) {
            const response = await authApi.login(credentials)
            this.accessToken = response.access_token
            this.isAuthenticated = true // Устанавливаем в true при логине
            // this.user = response.user_data; // Если получаете данные пользователя
        },

        async register(userData) {
            const response = await authApi.register(userData)
            this.accessToken = response.access_token
            this.isAuthenticated = true // Устанавливаем в true при регистрации
            // this.user = response.user_data;
        },

        async refreshToken() {
            try {
                const response = await authApi.refresh()
                this.accessToken = response.access_token
                this.isAuthenticated = true // Устанавливаем в true при успешном refresh
            } catch (error) {
                console.error("Failed to refresh token:", error)
                this.reset() // Сбрасываем авторизацию, если refresh не удался
                throw error
            }
        },

        async logout() {
            try {
                await authApi.logout() // Отправляем запрос на бэк
            } catch (error) {
                console.error("Logout failed on backend:", error);
            } finally {
                this.reset(); // Сбрасываем состояние Pinia
            }
        },

        reset() {
            this.accessToken = null
            this.user = null
            this.isAuthenticated = false // Устанавливаем в false при сбросе
        },

        initialize() {
            this.isAuthenticated = !!this.accessToken
        }
    },

    persist: true
})