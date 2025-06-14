<template>
  <div class="p-6 w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">{{ isLogin ? 'Log In' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block mb-1">Password</label>
        <input v-model="password" type="password" required class="w-full p-2 border rounded" />
      </div>
      <div v-if="!isLogin">
        <label class="block mb-1">Confirm Password</label>
        <input v-model="confirmPassword" type="password" required class="w-full p-2 border rounded" />
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {{ isLogin ? 'Log In' : 'Register' }}
      </button>
      <p class="mt-2 text-sm">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <a href="#" @click.prevent="toggleForm" class="text-blue-600 hover:underline">
          {{ isLogin ? 'Register' : 'Log In' }}
        </a>
      </p>
    </form>
    <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue' // Добавляем watch
import { useAuthStore } from './src/stores/auth.js'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLogin = ref(true)

const toggleForm = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

// Функция для установки режима на основе параметра запроса
const setModeFromQuery = () => {
  isLogin.value = !(route.query.register === 'true')
  // Очищаем поля и ошибки при смене режима
  error.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

// При монтировании компонента проверяем параметр запроса
onMounted(() => {
  setModeFromQuery()
})

// Наблюдаем за изменением параметров запроса
watch(
  () => route.query.register,
  (newVal) => {
    setModeFromQuery()
  }
)

const handleSubmit = async () => {
  try {
    error.value = ''
    if (isLogin.value) {
      await authStore.login({ email: email.value, password: password.value })
      router.push('/') // Перенаправление на главную после логина
    } else {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match'
        return
      }
      await authStore.register({ email: email.value, password: password.value })
      router.push('/') // Перенаправление на главную, так как залогинен
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
  }
}
</script>