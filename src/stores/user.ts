import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserBaseType } from '@/types/user'

export const useUserBaseStore = defineStore(
  'StoreUserBase',
  () => {
    const defaultUserInfo = {
      phoneNumber: '',
      name: '',
      totalBalance: 0,
      availableBalance: 0,
      createTime: '',
      loginTime: '',
      token: ''
    }
    const userInfo = ref({ ...defaultUserInfo })

    const setUserInfo = (data: UserBaseType) => {
      userInfo.value = data
    }

    const rmUserInfo = () => {
      userInfo.value = { ...defaultUserInfo }
    }

    return {
      userInfo,
      setUserInfo,
      rmUserInfo
    }
  },
  {
    persist: true
  }
)
