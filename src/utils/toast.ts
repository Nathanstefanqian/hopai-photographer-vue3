import type { MessageReactive } from 'naive-ui'
// import { showSuccessToast, showFailToast, showLoadingToast, closeToast } from 'vant'
// import { isMobile } from '@/utils/tools'

// const mobile = isMobile()
const WebToast = {
  success: (message: string, duration = 2000): MessageReactive => {
    return window.$message.success(message, { duration })
  },
  error: (message: string, duration = 2000): MessageReactive => {
    return window.$message.error(message, { duration })
  },
  warning: (message: string, duration = 2000): MessageReactive => {
    return window.$message.warning(message, { duration })
  },
  loading: (message?: string): MessageReactive => {
    return window.$message.loading(message ?? '', { duration: 1000 })
  },
  close() {
    window.$message.destroyAll()
  }
}

// const MobileToast = {
//   success: (message: string, duration = 2000) => {
//     return showSuccessToast({ message, duration })
//   },
//   error: (message: string, duration = 2000) => {
//     return showFailToast({ message, duration })
//   },
//   warning: (message: string, duration = 2000) => {
//     return showFailToast({ message, duration })
//   },
//   loading: (message?: string) => {
//     return showLoadingToast({ message: message ?? '', duration: 0 })
//   },
//   close() {
//     closeToast(true)
//   }
// }

export const Toast = WebToast
// mobile ? MobileToast : WebToast

// export const Dialog = {
//   success () {}
// }
