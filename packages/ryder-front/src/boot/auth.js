import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth-store'

export default boot(async () => {
  await useAuthStore().init()
})
