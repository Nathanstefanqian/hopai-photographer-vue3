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
    data.status = [0,1,2,3,4,5,6,7]
  }
  else if(data.status == 1) {
    data.status = [100]
  }
  else if(data.status == 2) {
    data.status = null
  }
  return request.post({ url: '/app-api/member/p/order/getUserOrders', data })
}

// 获取该订单的详情信息
export const getOrderDetail = (id: any) => {
  return request.get({ url: `/app-api/member/p/order/get?id=` + id })
}