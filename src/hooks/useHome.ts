import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { getProfile, getProfileWidthToken } from '@/api/user'
// import { getToken, setToken } from '@/utils/auth'
import { Toast } from '@/utils/toast'

export const useHome = () => {
  const router = useRouter()
  Toast.loading('Ai Chat initializing')
  
  router.push('/login')
}
