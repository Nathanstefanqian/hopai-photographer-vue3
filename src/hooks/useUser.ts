import { ref } from 'vue'
import type { VerCodeType } from '@/types/user'
import { sleep } from '@/utils/tools'

export const usePhoneVerifyCode = () => {
  const isGetingVerCode = ref(false)
  const getCodeLoadingSecond = ref(60)

  const onGetPhoneVerifyCode = async (type: VerCodeType, email: string) => {
    // getVerCode(type, email)
    isGetingVerCode.value = true
    for (let index = 0; index < 60; index++) {
      await sleep(1000)
      getCodeLoadingSecond.value = 60 - index
    }
    getCodeLoadingSecond.value = 60
    isGetingVerCode.value = false
  }

  return {
    isGetingVerCode,
    getCodeLoadingSecond,
    onGetPhoneVerifyCode
  }
}