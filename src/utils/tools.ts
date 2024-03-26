import dayjs from 'dayjs'

// 精确校验数据格式方法
export const toType = (obj: any): string => {
  return (
    {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)?.[1]
      .toLowerCase() || ''
  )
}
// 对象滤空方法
const arrFilterNull = (arr: any[]) => arr.filter((i) => i != null)
export const filterNull = (o: any) => {
  // console.log(o, toType(o))
  if (!['object', 'array'].includes(toType(o))) {
    return o
  }
  for (const key in o) {
    // if (o[key] == null) delete o[key]
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
      // if (o[key] === '') delete o[key]
    }
    if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
      if (JSON.stringify(o[key]) === '{}') delete o[key]
    }
    if (toType(o[key]) === 'array') {
      o[key] = arrFilterNull(filterNull(o[key]))
      if (!o[key].length) delete o[key]
    }
  }
  if (toType(o) === 'array') o = arrFilterNull(o)
  return o
}

// 获取时间戳（秒）
export const getUnixTime = () => {
  return ~~(+new Date() / 1000)
}

// 获取时间戳（秒）字符串格式
export const getUnixTimeStr = () => {
  return getUnixTime().toString()
}

// 返回手机号加密字符串
export const enMobileNum = (mobile: string): string => {
  mobile = mobile || ''
  return `${mobile.substring(0, 3)}****${mobile.substring(7)}`
}

// 返回邮箱加密字符串
export const enMailAccount = (mail: string): string => {
  mail = mail || '***@***.com'
  try {
    const [username, suffix] = mail.split('@')
    const [, domain] = suffix.split('.')
    return `${username.substring(0, 3)}***@***.${domain}`
  } catch (e) {
    return ''
  }
}

// 一维数组转换为二维数组
export const arrTrans = (arr: any[], num: number): any[] => {
  const iconsArr: any[] = [] // 声明数组
  arr.forEach((item, index) => {
    const page = Math.floor(index / num) // 计算该元素为第几个素组内
    if (!iconsArr[page]) {
      // 判断是否存在
      iconsArr[page] = []
    }
    iconsArr[page].push(item)
  })
  return iconsArr
}

// 判断字符串是否为外链地址
export const isExternal = (path: string): boolean => /^(https?:|mailto:|tel:)/.test(path)

// 将字符串复制到剪切板函数
export const copyText = (text: string) => {
  // 调用 Clipboard API 的 writeText 方法
  return navigator.clipboard.writeText(text)
}

// 睡眠函数
export const sleep = async (time: number): Promise<any> => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// 判断是否移动端
export const isMobile = () => {
  return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
}

// 生成随机UUID
export const makeUUID = () => {
  // 获取当前时间戳
  const timestamp = Date.now();

  // 生成一个随机数作为后缀，这里使用了 Math.random() 方法
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  // 结合时间戳和随机数生成唯一的文件名
  const fileName = `${timestamp}_${randomSuffix}`;

  return fileName;
}

export const formatListTime = (list: any[], format = 'YYYY-MM-DD') => {
  return list.map((i) => {
    if (i.time) {
      i.time = dayjs(i.time).format(format)
    }
    return i
  })
}

export const isPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone)
}

export const copyOrderId = (id: any) => {
  const textarea = document.createElement('textarea')
  textarea.value = id
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  window.$message.info('订单号已复制到粘贴板  ')
}

export default {
  isPhone,
  toType,
  filterNull,
  getUnixTime,
  getUnixTimeStr,
  enMobileNum,
  enMailAccount,
  arrTrans,
  isExternal,
  copyText,
  sleep,
  isMobile,
  makeUUID
}
