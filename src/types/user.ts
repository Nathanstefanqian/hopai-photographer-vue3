export interface LoginProps {
  phoneNumber: string
  pwd: string
  code: string
}

export interface UserBaseType {
  phoneNumber: string
  name: string
  totalBalance: number
  availableBalance: number
  createTime: string
  loginTime: string
  token: string
}

export type VerCodeType = 'Login' | 'Forgot' | 'Register'