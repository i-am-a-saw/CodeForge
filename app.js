import { createRouter } from './router'
import { checkAuth } from './api'

const router = createRouter()

async function initApp() {
    // Проверяем авторизацию при загрузке
    await checkAuth()

    // Инициализируем роутер
    router.beforeEach((to, from, next) => {
        router.beforeEach(to, from, next)
    })

    // Запускаем приложение
    router.start()
}

initApp()