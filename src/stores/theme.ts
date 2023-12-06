import { ref } from 'vue'
import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
// import type { GlobalTheme } from 'naive-ui'

export const useThemeStore = defineStore(
  'StoreTheme',
  () => {
    const theme = ref<any | null>(darkTheme)
    const isDark = ref<Boolean>(true)
    const toggleTheme = () => {
      if (theme.value == null) {
        theme.value = darkTheme
        isDark.value = true
      } else {
        theme.value = null
        isDark.value = false
      }
    }

    const barCollapsed = ref(false)
    const toggleBarCollapsed = () => (barCollapsed.value = !barCollapsed.value)

    return { theme, isDark, toggleTheme, barCollapsed, toggleBarCollapsed }
  },
  {
    persist: true
  }
)
