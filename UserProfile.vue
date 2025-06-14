<template>
  <div class="user-profile-container" @click="toggleDropdown" @mouseleave="closeDropdown">
    <div class="profile-circle">
      <span class="profile-initial">U</span> </div>
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <div class="dropdown-item" @click="handleLogout">Logout</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './src/stores/auth' // Путь к вашему Pinia store

const authStore = useAuthStore()
const router = useRouter()
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  // Закрываем меню, когда курсор уходит с контейнера
  isDropdownOpen.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout() // Вызываем функцию logout из Pinia store
    router.push('/') // Перенаправляем на главную страницу после выхода
  } catch (error) {
    console.error('Logout failed:', error)
    // Можно добавить уведомление пользователю об ошибке выхода
    router.push('/') // Все равно перенаправляем, даже если бэк вернул ошибку, чтобы обновить UI
  }
}
</script>

<style scoped>
/* Стили для UserProfile.vue */

.user-profile-container {
  position: relative;
  width: 60px; /* Ширина круга */
  height: 60px; /* Высота круга */
  border-radius: 50%; /* Делаем круглым */
  background-color: #4f46e5; /* Цвет фона круга */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: auto; /* Для выравнивания справа внутри .log-in-start */
  z-index: 10; /* Убедимся, что он выше других элементов */
}

.profile-circle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px; /* Размер буквы */
  font-weight: bold;
}

.dropdown-menu {
  position: absolute;
  top: 70px; /* Отступ от круга */
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  z-index: 100; /* Должен быть выше всего остального */
  overflow: hidden; /* Чтобы border-radius работал с внутренними элементами */
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>