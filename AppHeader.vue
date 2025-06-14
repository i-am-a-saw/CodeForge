<template>
  <div class="header-outer-wrapper">
    <div class="flex-row">
      <span class="code-genius" @click="navigateTo('/')">Codular</span>
      <div class="menu">
        <a class="contribute-problem" href="#" @click.prevent="navigateTo('/fill-gaps')">Fill in the gaps</a>
        <a class="solve-problems" href="#" @click.prevent="navigateTo('/remove-noices')">Remove noices</a>
        <a class="solve-problems" href="#" @click.prevent="navigateTo('/solve')">Solve problems</a>
      </div>
      <div class="log-in-start">
        <a class="log-in" href="#" @click.prevent="navigateToLogin()">Log in</a>
        <a class="get-started" href="#" @click.prevent="navigateToRegister()">Register</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navigateTo = (path) => {
  // Простая навигация, если путь не текущий, или если это корневой путь
  if (route.path !== path || path === '/') {
    router.push(path)
  }
}

const navigateToLogin = () => {
  // Если мы уже на /login и НЕ в режиме регистрации, то ничего не делаем.
  // Иначе, переходим на /login без параметра register.
  if (route.path === '/login' && !route.query.register) {
    return; // Уже на странице логина, не в режиме регистрации
  }
  router.push({ path: '/login', query: {} }) // Пустой query, чтобы сбросить 'register'
}

const navigateToRegister = () => {
  // Если мы уже на /login И в режиме регистрации, то ничего не делаем.
  // Иначе, переходим на /login с параметром register.
  if (route.path === '/login' && route.query.register === 'true') {
    return; // Уже на странице регистрации
  }
  router.push({ path: '/login', query: { register: 'true' } })
}
</script>

<style>
/* Скопируйте сюда стили из вашего styles.css, относящиеся к шапке.
   Это те стили, которые были в предыдущем рабочем состоянии. */

.header-outer-wrapper {
  position: relative;
  width: 1820px; /* Убедитесь, что это соответствует ширине вашего макета */
  margin: 0 auto;
}

.flex-row {
  position: relative;
  width: 1437px;
  height: 65px;
  margin: 40px 0 0 277px;
  z-index: 5;
  display: flex; /* Используем flexbox для расположения элементов */
  align-items: center;
}

.code-genius { /* Сделаем его кликабельным */
  cursor: pointer; /* Добавим курсор для указания на кликабельность */
  position: absolute;
  height: 55px;
  top: 5px;
  left: 0;
  color: #4f46e5;
  font-family: Friska, var(--default-font-family);
  font-size: 30px;
  font-weight: 400;
  line-height: 55px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 1.8px;
  z-index: 1;
}

.menu {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 45px;
  position: absolute; /* Сохраняем абсолютное позиционирование, как в styles.css */
  height: 55px;
  top: 5px;
  left: 310px; /* Позиция из styles.css */
  z-index: 2;
}

.contribute-problem, .solve-problems {
  flex-shrink: 0;
  flex-basis: auto;
  position: relative;
  height: 55px;
  color: #6f6a6a;
  text-decoration: none;
  font-family: Friska, var(--default-font-family);
  font-size: 22px;
  font-weight: 400;
  line-height: 55px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 1.32px;
  z-index: 3;
}

.log-in-start {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 42px;
  position: absolute; /* Сохраняем абсолютное позиционирование, как в styles.css */
  width: 320px;
  height: 65px;
  top: 0;
  left: 1117px; /* Позиция из styles.css */
  z-index: 5;
}

.log-in {
  flex-shrink: 0;
  flex-basis: auto;
  position: relative;
  height: 55px;
  color: #6f6a6a;
  font-family: Friska, var(--default-font-family);
  font-size: 22px;
  font-weight: 400;
  line-height: 55px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 1.32px;
  text-decoration: none;
  z-index: 6;
}

.get-started { /* Этот класс для кнопки Register */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  position: relative;
  width: 210px;
  height: 65px;
  background: #4f46e5;
  border-radius: 15px;
  flex-basis: auto;
  color: #ffffff;
  font-family: Friska, var(--default-font-family);
  font-size: 24px;
  font-weight: 400;
  line-height: 23px;
  text-align: left;
  white-space: nowrap;
  text-decoration: none;
  letter-spacing: 1.44px;
  z-index: 8;
}

/* Убедитесь, что переменная --default-font-family определена,
   например, в вашем styles.css или в этом же блоке style. */
:root {
  --default-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Ubuntu, 'Helvetica Neue', Helvetica, Arial, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft Yahei UI', 'Microsoft Yahei',
    'Source Han Sans CN', sans-serif;
}
</style>