// main.js
import { createApp } from 'vue'
import App from './app.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
