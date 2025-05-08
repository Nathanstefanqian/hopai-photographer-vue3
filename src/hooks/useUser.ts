import { ref } from 'vue'
import { sleep } from '@/utils/tools'
import * as LoginApi from '@/api/login'

export const usePhoneVerifyCode = () => {
  const isGetingVerCode = ref(false)
  const getCodeLoadingSecond = ref(60)

  const onGetPhoneVerifyCode = async (mobile: string) => {
    // getVerCode(type, email)
    const data = {
      mobile,
      scene: 1,
      userType: 3
    }
    await LoginApi.sendSmsCode(data)
    isGetingVerCode.value = true
    window.$message.success('验证码已发送')
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