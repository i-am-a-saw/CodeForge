<template>
  <div class="main-container">
    <div class="content-wrapper">
      <div class="controls-row">
        <div class="control-group">
          <label for="gapsNumber" class="label-text">Количество пропусков</label>
          <input type="number" id="gapsNumber" v-model.number="gapsNumber" class="input-field" min="1" />
        </div>
        <div class="control-group">
          <label for="language" class="label-text">Язык</label>
          <select id="language" v-model="selectedLanguage" class="select-field">
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="Csharp">C#</option>
            <option value="Cpp">C++</option>
          </select>
        </div>
        <button class="generate-button" @click="generateGaps" :disabled="isLoading">
          <span v-if="!isLoading">Генерировать</span>
          <span v-else class="spinner"></span>
        </button>
      </div>

      <div class="code-editors-wrapper">
        <div class="editor-container">
          <label class="editor-label">Исходный код</label>
          <textarea ref="editorEl" class="code-mirror-textarea"></textarea>
        </div>
        <div class="editor-container">
          <label class="editor-label">Результат</label>
          <textarea ref="resultEditorEl" class="code-mirror-textarea"></textarea>
        </div>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './src/stores/auth' // Убедитесь, что путь правильный
import UserProfile from './UserProfile.vue'
import AliasPage from "./AliasPage.vue";
import {useTaskStore} from "./src/stores/task"; // Убедитесь, что путь правильный

// CodeMirror imports (мы будем загружать их динамически, чтобы не засорять глобальную область)
// import CodeMirror from 'codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/dracula.css'; // Пример темы

// Импорты режимов для CodeMirror
// import 'codemirror/mode/javascript/javascript.js';
// import 'codemirror/mode/python/python.js';
// import 'codemirror/mode/clike/clike.js'; // Для Java, C++, C#

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const useStore = useTaskStore()

const gapsNumber = ref(1)
const selectedLanguage = ref('javascript')
const editorEl = ref(null)
const resultEditorEl = ref(null)
const error = ref('')
const isLoading = ref(false)

let editorInstance = null
let resultEditorInstance = null

// Динамическая загрузка CodeMirror
const loadCodeMirror = async () => {
  if (window.CodeMirror) return // Уже загружен

  await Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js'),
    loadLink('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css'),
    loadLink('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css')
  ]);

  // Загрузка режимов после основной библиотеки
  await Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js') // Для Java, C++, C#
  ]);

  // Установка начального значения и режима после загрузки CodeMirror
  if (editorEl.value && window.CodeMirror) {
    editorInstance = window.CodeMirror.fromTextArea(editorEl.value, {
      lineNumbers: true,
      mode: selectedLanguage.value,
      theme: 'dracula',
      indentUnit: 4,
      tabSize: 4,
    })
    editorInstance.setValue('function greet(name) {\n  console.log("Hello, " + name + "!");\n}')

    resultEditorInstance = window.CodeMirror.fromTextArea(resultEditorEl.value, {
      lineNumbers: true,
      mode: selectedLanguage.value,
      theme: 'dracula',
      readOnly: true,
      indentUnit: 4,
      tabSize: 4,
    })
  }
};

// Хелперы для динамической загрузки
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const loadLink = (href) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
};


onMounted(async () => {
  await loadCodeMirror();
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.toTextArea()
  }
  if (resultEditorInstance) {
    resultEditorInstance.toTextArea()
  }
})

const generateGaps = async () => {
  error.value = '';
  isLoading.value = true;

  const sourceCode = editorInstance ? editorInstance.getValue() : '';

  const requestData = {
    programmingLanguage: selectedLanguage.value,
    skipsNumber: gapsNumber.value,
    sourceCode: sourceCode,
  };

  console.log('Отправляемые данные:', JSON.stringify(requestData, null, 2));

  try {
    const response = await fetch('https://api.codular.ru/api/v1/skips/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authStore.accessToken && { Authorization: `Bearer ${authStore.accessToken}` }),
      },
      body: JSON.stringify(requestData),
    });

    console.log('sent')
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Полученный результат:', result);

    // Если сервер вернул taskAlias, начинаем опрос статуса
    if (result.taskAlias) {
      console.log('taskAlias: ', result.taskAlias)
      const taskAlias = result.taskAlias;
      let attempts = 0;
      const maxAttempts = 30; // Максимум 30 попыток (1 минута при интервале 2 сек)

      const checkInterval = setInterval(async () => {
        try {
          attempts++;
          const statusResponse = await fetch(`https://api.codular.ru/api/v1/task-status/${taskAlias}`, {
            headers: {
              'Authorization': `Bearer ${authStore.accessToken}`
            }
          });
          console.log("statusResponse", statusResponse)

          if (!statusResponse.ok) throw new Error('Status check failed');

          const statusData = await statusResponse.json();
          console.log("statusData", statusData)

          if (statusResponse.status === 200) {
            console.log("completed")
            clearInterval(checkInterval);
            resultEditorInstance.setValue(JSON.stringify(statusData, null, 2));

            useStore.setTaskAlias(taskAlias)
            await navigateTo(`task/${taskAlias}`);
          } else if (statusData.status === 'failed' || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            error.value = statusData.message || 'Task processing failed or timed out';
          }
        } catch (err) {
          console.error('Polling error:', err);
          if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            error.value = 'Failed to check task status';
          }
        }
      }, 2000); // Проверяем каждые 2 секунды

      // Очистка интервала при размонтировании компонента
      onBeforeUnmount(() => {
        clearInterval(checkInterval);
      });
    } else if (resultEditorInstance) {
      // Если нет taskAlias, показываем результат напрямую
      resultEditorInstance.setValue(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error('Ошибка:', err);
    error.value = `Ошибка генерации: ${err.message}`;
    if (resultEditorInstance) {
      resultEditorInstance.setValue(`Error: ${err.message}`);
    }
  } finally {
    isLoading.value = false;
  }
};

// Навигационные функции (как в AppHeader, чтобы компонент был самодостаточным)
const navigateTo = (path) => {
  if (route.path !== path || path === '/') {
    router.push(path)
  }
}

const navigateToLogin = () => {
  if (!(route.path === '/login' && !route.query.register)) {
    router.push('/login')
  }
}

const navigateToRegister = () => {
  if (!(route.path === '/login' && route.query.register === 'true')) {
    router.push({ path: '/login', query: { register: 'true' } })
  }
}
</script>

<style scoped>
/* Стили из style-gaps.css */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap');

:root {
  --default-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Ubuntu, 'Helvetica Neue', Helvetica, Arial, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft Yahei UI', 'Microsoft Yahei',
    'Source Han Sans CN', sans-serif;
}

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f0f2f5; /* Светлый фон для всей страницы */
}

/* Header styles (как в AppHeader) */
.header-outer-wrapper {
  background: #ffffff; /* Белый фон для шапки */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Легкая тень */
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.flex-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1600px; /* Увеличена ширина для контента */
  margin: 0 auto;
  padding: 0 20px;
}

.code-genius {
  font-family: Friska, var(--default-font-family);
  font-size: 32px;
  font-weight: 600;
  color: #4f46e5;
  cursor: pointer;
  flex-shrink: 0;
}

.menu {
  display: flex;
  gap: 30px;
  flex-grow: 1; /* Позволяет меню занимать доступное пространство */
  justify-content: center; /* Центрируем элементы меню */
}

.menu a {
  font-family: Friska, var(--default-font-family);
  font-size: 18px;
  color: #333;
  text-decoration: none;
  transition: color 0.2s ease;
}

.menu a:hover {
  color: #4f46e5;
}

.log-in-start {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.log-in {
  color: #6f6a6a;
  font-family: Friska, var(--default-font-family);
  font-size: 18px;
  text-decoration: none;
  white-space: nowrap;
  padding: 8px 15px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.log-in:hover {
  background-color: #f0f2f5;
  color: #4f46e5;
}

.get-started { /* Этот класс для кнопки Register */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: #4f46e5;
  border-radius: 10px;
  color: #ffffff;
  font-family: Friska, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.3s ease;
}

.get-started:hover {
  background-color: #3e38c2;
}


.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
  flex-wrap: wrap; /* Позволяет элементам переноситься на новую строку на маленьких экранах */
  justify-content: center;
  width: 100%;
}

.control-group {
  display: flex;
  flex-direction: column; /* Элементы в колонку: надпись сверху, поле снизу */
  align-items: flex-start; /* Выравнивание по левому краю */
  gap: 8px;
  white-space: nowrap;
}

.label-text {
  font-family: Friska, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.input-field,
.select-field {
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: var(--default-font-family);
  font-size: 16px;
  color: #333;
  width: 200px; /* Фиксированная ширина для полей ввода */
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.input-field:focus,
.select-field:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.generate-button {
  padding: 12px 25px;
  background-color: #4f46e5;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-family: Friska, var(--default-font-family);
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  margin-top: 10px; /* Чтобы кнопка была ниже полей */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.generate-button:hover:not(:disabled) {
  background-color: #3e38c2;
}

.generate-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.code-editors-wrapper {
  display: flex;
  gap: 30px;
  width: 100%;
  max-width: 1600px;
  margin-top: 30px;
  flex-wrap: wrap; /* Позволяет редакторам переноситься на новую строку */
  justify-content: center;
}

.editor-container {
  flex: 1; /* Позволяет каждому редактору занимать равное пространство */
  min-width: 450px; /* Минимальная ширина для редактора, чтобы не сильно сжимался */
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.editor-label {
  font-family: Friska, var(--default-font-family);
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}

.code-mirror-textarea {
  width: 100%;
  min-height: 400px; /* Увеличил высоту для лучшего отображения */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Roboto Mono', monospace; /* Моноширинный шрифт для кода */
  font-size: 14px;
  resize: vertical; /* Разрешаем изменение размера по вертикали */
}

/* Стили для CodeMirror (переопределение дефолтных) */
.CodeMirror {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  height: 400px; /* Фиксированная высота для CodeMirror */
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  background-color: #282a36; /* Цвет фона темы Dracula */
}

.CodeMirror-scroll {
  max-height: 400px; /* Важно для прокрутки внутри редактора */
}


.error-message {
  color: #ef4444;
  font-family: var(--default-font-family);
  font-size: 16px;
  margin-top: 25px;
  text-align: center;
  width: 100%;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .flex-row {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .menu {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .log-in-start {
    flex-direction: column;
    gap: 10px;
  }

  .controls-row {
    flex-direction: column;
    gap: 20px;
  }

  .input-field,
  .select-field {
    width: 100%;
    max-width: 300px; /* Ограничим ширину на мобильных */
  }

  .code-editors-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .editor-container {
    min-width: unset; /* Сбросим минимальную ширину */
    width: 100%;
    padding: 15px;
  }

  .CodeMirror {
    height: 300px; /* Меньшая высота на мобильных */
  }
}
</style>