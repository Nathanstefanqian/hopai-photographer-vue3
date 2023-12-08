import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

export const useTheme = () => {
  const themeStore = useThemeStore()
  const { toggleTheme, toggleBarCollapsed } = themeStore
  const { isDark, barCollapsed } = storeToRefs(themeStore)
  if (isDark.value) {
    document.body.classList.add('dark')
  }
  const setCss = async () => {
    if (isDark.value) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  watch(
    () => isDark.value,
    () => setCss()
  )
  return {
    toggleTheme,
    isDark,
    barCollapsed,
    toggleBarCollapsed
  }
}
