<template>
  <div class="task-container">
    <!-- Заголовок и иконка настроек -->
    <div class="task-header">
      <h2 class="task-title">{{ task.description || 'Задача по программированию' }}</h2>
      <button @click="toggleSettings" class="settings-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </div>

    <!-- Блок с кодом задачи -->
    <!-- Поле для вставки пользовательского кода -->

    <div class="code-block">
      <div class="code-header">
        <span>Код для решения</span>
        <button @click="copyCode" class="copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Копировать
        </button>
      </div>
      <pre class="code-content">{{ task.codeToSolve }}</pre>
    </div>
<!--    <textarea-->
<!--        v-model="task.codeToSolve"-->
<!--        placeholder="Вставьте сюда код..."-->
<!--        rows="8"-->
<!--        class="code-textarea"-->
<!--    ></textarea>-->
    <!-- Ссылка для общего доступа -->
    <div class="share-link">
      <input
          type="text"
          :value="taskLink"
          readonly
          class="link-input"
          ref="linkInput"
      >
      <button @click="copyLink" class="link-copy-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </button>
    </div>

    <!-- Панель настроек (выдвижная) -->
    <div class="settings-panel" :class="{ 'visible': showSettings }">
      <div class="settings-content">
        <h3>Настройки задачи</h3>

        <div class="setting-item">
          <label class="switch">
            <input type="checkbox" v-model="isPublic" @change="updatePublicStatus">
            <span class="slider round"></span>
          </label>
          <span class="setting-label">Публичная задача</span>
        </div>

        <h4 class="regenerate-title">Регенерация задачи</h4>

        <div class="setting-item">
          <label>Количество пропусков:</label>
          <div class="slider-container">
            <input
                type="range"
                v-model.number="skipsNumber"
                min="1"
                max="10"
                class="compact-slider"
            >
            <span class="slider-value">{{ skipsNumber }}</span>
          </div>
        </div>

        <button @click="regenerateTask" class="regenerate-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
          Сгенерировать заново
        </button>
      </div>
    </div>

    <!-- Затемнение фона при открытых настройках -->
    <div class="overlay" :class="{ 'visible': showSettings }" @click="toggleSettings"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './src/stores/auth'
import {useTaskStore} from "./src/stores/task";

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const linkInput = ref(null)

const task = ref({
  codeToSolve: '',
  description: '',
  canEdit: false
})

const showSettings = ref(false)
const isPublic = ref(false)
const skipsNumber = ref(3)

// Получаем задачу при загрузке компонента
onMounted(async () => {
  try {

    const response = await fetch(`https://api.codular.ru/api/v1/task/${taskStore.taskAlias}`, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })

    if (!response.ok) throw new Error('Failed to load task')

    const data = await response.json()
    task.value = {
      codeToSolve: data.codeToSolve,
      description: data.description,
      canEdit: data.canEdit
    }

  } catch (error) {
    console.error('Error loading task:', error)
  }
})

// Ссылка для общего доступа
const taskLink = computed(() => {
  return `https://api.codular.ru/api/v1/task/${taskStore.taskAlias}`
})

// Переключение панели настроек
const toggleSettings = () => {
  showSettings.value = !showSettings.value
  document.body.style.overflow = showSettings.value ? 'hidden' : 'auto'
}

// Регенерация задачи
const regenerateTask = async () => {
  try {
    const response = await fetch(`https://api.codular.ru/api/v1/task/${taskStore.taskAlias}/regenerate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({
        skipsNumber: skipsNumber.value
      })
    })

    if (!response.ok) throw new Error('Regeneration failed')

    const result = await response.json()
    await navigateTo(`/task/${result.taskAlias}`)
    showSettings.value = false

  } catch (error) {
    console.error('Error regenerating task:', error)
  }
}

// Копирование кода
const copyCode = () => {
  navigator.clipboard.writeText(task.value.codeToSolve)
      .then(() => alert('Код скопирован в буфер обмена'))
      .catch(err => console.error('Copy failed:', err))
}
const navigateTo = (path) => {
  if (route.path !== path || path === '/') {
    router.push(path)
  }
}
// Копирование ссылки
const copyLink = () => {
  linkInput.value.select()
  document.execCommand('copy')
  alert('Ссылка скопирована в буфер обмена')
}

// Обновление публичности задачи
const updatePublicStatus = async () => {
  try {
    await fetch(`https://api.codular.ru/api/v1/task/${route.params.alias}/set-public`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify({
        public: isPublic.value
      })
    })
  } catch (error) {
    console.error('Error updating public status:', error)
  }
}
</script>

<style scoped>
.task-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  position: relative;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.task-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.settings-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.settings-btn:hover {
  color: #4f46e5;
}

.code-block {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #e9ecef;
  font-weight: 500;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #495057;
  cursor: pointer;
}

.code-content {
  padding: 16px;
  margin: 0;
  white-space: pre-wrap;
  background: white;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.share-link {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.link-input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px 0 0 6px;
  font-size: 14px;
}

.link-copy-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 6px 6px 0;
  background: #f8f9fa;
  cursor: pointer;
}

/* Панель настроек */
.settings-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  padding: 20px;
  box-sizing: border-box;
}

.settings-panel.visible {
  right: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-content h3 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: #333;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-item label {
  font-size: 14px;
  min-width: 150px;
}

.slider-input {
  flex-grow: 1;
}

.regenerate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 20px;
}

.regenerate-btn:hover {
  background: #3e38c2;
}

/* Затемнение фона */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.overlay.visible {
  opacity: 1;
  pointer-events: all;
}

/* Переключатель */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #4f46e5;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}.code-input {
   margin-bottom: 20px;
 }

.code-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  background-color: #fdfdfd;
  resize: vertical;
}

</style>