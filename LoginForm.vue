<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Пароль" />
    <button type="submit">Войти</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, isLoggedIn } = useAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    console.log('Вход выполнен. Авторизован:', isLoggedIn.value)
  } catch (e) {
    alert('Ошибка входа')
  }
}
</script>
