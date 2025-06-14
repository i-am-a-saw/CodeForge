<template>
  <div>
    <AppHeader /> <router-view></router-view>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue' // Импортируем новый компонент шапки
</script>

<script>
import TaskGenerator from './test.vue'

export default {
  components: {
    TaskGenerator,
    AppHeader, // Регистрируем AppHeader
  },
}
</script>