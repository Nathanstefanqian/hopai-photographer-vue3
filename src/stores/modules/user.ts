import { store } from '../index'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache } from '@/hooks/useCache'

const { wsCache } = useCache()

interface UserVO {
  id: number
  avatar: string
  nickname: string
}

interface UserInfoVO {
  user: UserVO
}

export const useUserStore = defineStore('user', {
  state: (): UserInfoVO => ({
    user: {
      id: 0,
      avatar: '',
      nickname: ''
    }
  }),
  getters: {
    getUser(): UserVO {
      return this.user
    }
  },
  actions: {
    async setUserInfoAction() {
      if(!getAccessToken()) {
        this.resetState()
        return null
      }
      // 调用这个方法前先
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // if(!userInfo) {
      //   // userInfo = await getInfo()
      // }
      this.user = userInfo.user
      wsCache.set(CACHE_KEY.USER, userInfo)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS,userInfo.menus)
    },
    async loginOut() {
      wsCache.clear()
    },
    resetState() {
      this.user = {
        id: 0,
        avatar: '',
        nickname: ''
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}