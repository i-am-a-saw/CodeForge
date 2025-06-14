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
        <template v-if="!authStore.isAuthenticated">
          <a class="log-in" href="#" @click.prevent="navigateToLogin()">Log in</a>
          <a class="get-started" href="#" @click.prevent="navigateToRegister()">Register</a>
        </template>
        <template v-else>
          <UserProfile />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './src/stores/auth' // Импорт Pinia store
import UserProfile from './UserProfile.vue' // Импорт нового компонента профиля

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore() // Инициализация store

const navigateTo = (path) => {
  if (route.path !== path || path === '/') {
    router.push(path)
  }
}

const navigateToLogin = () => {
  if (route.path === '/login' && !route.query.register) {
    return
  }
  router.push({ path: '/login', query: {} })
}

const navigateToRegister = () => {
  if (route.path === '/login' && route.query.register === 'true') {
    return
  }
  router.push({ path: '/login', query: { register: 'true' } })
}
</script>

<style>
/* Скопируйте сюда стили из вашего styles.css, относящиеся к шапке.
   Эти стили не менялись с предыдущего шага. */

.header-outer-wrapper {
  position: relative;
  width: 1820px;
  margin: 0 auto;
}

.flex-row {
  position: relative;
  width: 1437px;
  height: 65px;
  margin: 40px 0 0 277px;
  z-index: 5;
  display: flex;
  align-items: center;
}

.code-genius {
  cursor: pointer;
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
  position: absolute;
  height: 55px;
  top: 5px;
  left: 310px;
  z-index: 2;
}

.contribute-problem,
.solve-problems {
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
  position: absolute;
  width: 320px; /* Здесь может потребоваться регулировка ширины, если UserProfile занимает другое место */
  height: 65px;
  top: 0;
  left: 1117px;
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

.get-started {
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

:root {
  --default-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Ubuntu, 'Helvetica Neue', Helvetica, Arial, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft Yahei UI', 'Microsoft Yahei',
    'Source Han Sans CN', sans-serif;
}
</style>