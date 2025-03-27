import request from '@/config/axios'

export interface orderVO {
  pageNo: number
  pageSize: number
  status: number | Array<number> | null | string | undefined
}
export interface memberVO {
  id: number
}

// 摄影师获取用户订单
export const getUserOrders = (data: orderVO) => {
  if(data.status == 0) {
    data.status = [0,1,2]
  }
  else if(data.status == 3) {
    data.status = [3]
  }
  else if(data.status == 4) {
    data.status = [4]
  }
  else if(data.status == 5) {
    data.status = [5]
  }
  else if(data.status == 6) {
    data.status = [6,7]
  }
  else if(data.status == 100) {
    data.status = [100, 10]
  }
  else if(data.status == 20) {
    data.status = [20, 30]
  }
  else if(data.status == 1000) {
    data.status = null
  }
  return request.post({ url: '/app-api/member/p/order/getUserOrders', data })
}

// 获取该订单的详情信息
export const getOrderDetail = (id: any) => {
  return request.get({ url: `/app-api/member/p/order/get?id=` + id })
}