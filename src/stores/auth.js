// src/stores/auth.js
import { defineStore } from 'pinia'
import authApi from '../api/auth' // Убедитесь, что это импортируется

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    userEmail: null,
  }),

  actions: {
    async login(credentials) {
      const response = await authApi.login(credentials)
      this.accessToken = response.access_token
      this.isAuthenticated = true
      await this.fetchUserEmail()
    },

    async register(userData) {
      const response = await authApi.register(userData)
      this.accessToken = response.access_token
      this.isAuthenticated = true
      await this.fetchUserEmail()
    },

    async refreshToken() {
      try {
        const response = await authApi.refresh()
        this.accessToken = response.access_token
        this.isAuthenticated = true
        await this.fetchUserEmail()
      } catch (error) {
        console.error('Failed to refresh token:', error)
        this.reset()
        throw error
      }
    },

    async logout() {
      try {
        await authApi.logout()
      } catch (error) {
        console.error('Logout failed on backend:', error)
      } finally {
        this.reset()
      }
    },

    reset() {
      this.accessToken = null
      this.user = null
      this.isAuthenticated = false
      this.userEmail = null;
    },

    async fetchUserEmail() {
      if (!this.accessToken) {
        console.warn('Access token is not available. Cannot fetch user email.');
        this.userEmail = null;
        return;
      }
      try {
        // <-- ИСПОЛЬЗУЕМ НОВУЮ ФУНКЦИЮ ИЗ authApi
        const responseData = await authApi.getUserEmail();
        
        if (responseData && responseData.responseInfo && responseData.responseInfo.status === 'OK') {
          this.userEmail = responseData.email;
        } else {
          // Если ответ не содержит ожидаемого статуса 'OK'
          console.error('Failed to fetch user email: Unexpected response format', responseData);
          this.userEmail = null;
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
        this.userEmail = null;
        // Интерцептор в axios.js должен обработать 401 инициировать рефреш/разлогинивание
      }
    },
  },

  persist: true,
})