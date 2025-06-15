<template>
  <div class="user-profile-container" @mouseenter="openDropdown" @mouseleave="closeDropdownWithDelay">
    <div class="profile-circle">
      <svg
        v-if="!profileImageUrl"
        class="profile-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      <img v-else :src="profileImageUrl" alt="Profile" class="profile-image" />
    </div>
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <div class="dropdown-item" @click="handleLogout">Logout</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router' // useRouter больше не нужен для полного обновления страницы
import { useAuthStore } from './src/stores/auth' // Путь к вашему Pinia store

const authStore = useAuthStore()
// const router = useRouter() // Убираем, так как не будем использовать router.push
const isDropdownOpen = ref(false)
let logoutTimeout = null; // Для задержки скрытия меню

// Пока заглушка для URL изображения профиля
const profileImageUrl = ref(null);

const openDropdown = () => {
  clearTimeout(logoutTimeout); // Отменяем возможное скрытие
  isDropdownOpen.value = true;
}

const closeDropdownWithDelay = () => {
  // Задержка перед скрытием, чтобы пользователь успел переместить курсор
  logoutTimeout = setTimeout(() => {
    isDropdownOpen.value = false;
  }, 200); // 200 миллисекунд задержки
}

const handleLogout = async () => {
  clearTimeout(logoutTimeout); // Отменяем скрытие, если оно было запланировано
  try {
    await authStore.logout(); // Вызываем функцию logout из Pinia store
    // Перенаправляем на корневую страницу и полностью обновляем ее
    window.location.href = '/';
    // window.location.reload(); // Это вызовет перезагрузку, но установка href уже вызовет ее
  } catch (error) {
    console.error('Logout failed:', error);
    // Даже если произошла ошибка на бэкенде, мы все равно разлогиниваем пользователя на фронте
    window.location.href = '/';
    // window.location.reload();
  }
}
</script>

<style scoped>
/* Стили остаются такими же, как и в предыдущем ответе */

.user-profile-container {
  position: relative;
  width: 60px; /* Ширина круга */
  height: 60px; /* Высота круга */
  border-radius: 50%; /* Делаем круглым */
  background-color: #ffffff; /* Белый фон для аватарки */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: auto; /* Для выравнивания справа внутри .log-in-start */
  z-index: 10; /* Убедимся, что он выше других элементов */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1); /* Легкая обводка, если нужна */
}

.profile-circle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-initial {
  /* Если решите использовать первую букву */
  color: #4f46e5; /* Цвет текста */
  font-size: 24px;
  font-weight: bold;
}

.profile-icon {
  /* Стиль для иконки человечка */
  width: 40px; /* Размер иконки */
  height: 40px;
  color: #a0a0a0; /* Серый цвет иконки */
}

.profile-image {
  /* Стили для реального изображения профиля */
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover; /* Чтобы изображение заполняло круг */
}

.dropdown-menu {
  position: absolute;
  top: 70px; /* Отступ от круга */
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px; /* Скругленные края */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Увеличил тень */
  min-width: 150px; /* Увеличил минимальную ширину */
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  padding: 12px 20px; /* Увеличил отступы */
  cursor: pointer;
  font-size: 18px; /* Увеличил шрифт */
  color: #333;
  transition: background-color 0.2s;
  white-space: nowrap; /* Чтобы текст не переносился */
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>