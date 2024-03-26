import request from '@/config/axios'


export interface SmsCodeVO {
  mobile: string
  scene: number
  userType: number
}

export interface LoginVO {
  mobile: string
  userType: number
  scene: number
  code: string
}
// 发送验证码
export const sendSmsCode = (data: SmsCodeVO) => {
  return request.post({ url: '/app-api/member/auth/send-sms-code', data })
}

// 验证码登录
export const smsLogin = (data: LoginVO) => {
  return request.post({ url: '/app-api/member/auth/sms-login', data })
}

export const getUserInfo = () => {
  return request.get({ url: '/app-api/member/user/get' })
}