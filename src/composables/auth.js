// src/composables/useAuth.js
import { useAuthStore } from '@/stores/auth'
import {computed} from "vue";

export const useAuth = () => {
    const auth = useAuthStore()
    const isLoggedIn = computed(() => !!auth.accessToken)
    return { ...auth, isLoggedIn }
}
