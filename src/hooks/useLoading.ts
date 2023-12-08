import { ref } from 'vue'
import { Toast } from '@/utils/toast'
import { useLoadingBar } from 'naive-ui'

export const useLoading = () => {
  const loadingbar = useLoadingBar()
  const loading = ref(false)
  let tempLoading: any = null

  const openLoading = (msg?: string) => {
    if (msg) {
      tempLoading = Toast.loading(msg)
    } else {
      loadingbar.start()
    }
    loading.value = true
  }

  const closeLoading = () => {
    if (tempLoading) {
      tempLoading.destroy()
    }
    loadingbar.finish()
    loading.value = false
  }

  return {
    loading,
    openLoading,
    closeLoading,
    Toast
  }
}
