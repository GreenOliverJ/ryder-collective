import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from 'src/services/auth-api'

const TOKEN_KEY = 'ryder_token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const ready = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  function setSession ({ user: u, token: t }) {
    user.value = u
    token.value = t
    localStorage.setItem(TOKEN_KEY, t)
  }

  function logout () {
    user.value = null
    token.value = ''
    localStorage.removeItem(TOKEN_KEY)
  }

  async function register (payload) {
    const { data } = await authApi.register(payload)
    setSession(data)
    return data
  }

  async function login (payload) {
    const { data } = await authApi.login(payload)
    setSession(data)
    return data
  }

  async function fetchMe () {
    if (!token.value) return null
    try {
      const { data } = await authApi.me()
      user.value = data.user
      return data.user
    } catch {
      logout()
      return null
    }
  }

  async function init () {
    if (token.value && !user.value) {
      await fetchMe()
    }
    ready.value = true
  }

  return { user, token, ready, isAuthenticated, register, login, logout, fetchMe, init }
})
