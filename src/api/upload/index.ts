import { sendSmsCode } from './../login/index';
import request from '@/config/axios'

interface BasePicVO {
  orderId: string | string[]
  picName: string
  picType: number
  description?: string
  status?: number
}

interface OriginalPicVO extends BasePicVO {
  picUrl: any
}

interface RetouchedPicVO extends BasePicVO {
  bigPicUrl: any
}

type PostPicVO = OriginalPicVO | RetouchedPicVO

interface getPicVO {
  pageNo: number
  pageSize: number
  orderId: string | string[]
  statusList?: string[]
  picType: number
}

// 为订单添加一张照片
export const postPhotographerPic = (data: PostPicVO[]) => { 
  return request.post({ url: '/platform-api/member/photographer/deliver-pic/create', data })
}

// 为订单更新一张照片
export const updatePhotographerPic = (data: PostPicVO[]) => {
  return request.put({ url: '/platform-api/member/photographer/deliver-pic/update', data })
}

// 为订单删除一张照片
export const deletePhotographerPic = (id: any) => {
  return request.delete({ url: `/platform-api/member/photographer/deliver-pic/delete/${id}` })
}

// 更新订单照片的状态
export const updatePhotographerPicStatus = (id: any) => {
  return request.get({ url:`/app-api/member/order/order/finish/${id}` })
}

// 获取该订单下所有照片的分页
export const getPhotographerPic = (data: getPicVO) => {
  return request.get({ url: `/platform-api/member/photographer/deliver-pic/page?pageSize=${data.pageSize}&pageNo=${data.pageNo}&orderId=${data.orderId}&statusList=${data.statusList}&picType=${data.picType}` })
}

// 获取摄影师上传作品的sts凭证
export const getStsUpload = (id:any) => {
  return request.get({ url: `/app-api/infra/file/getSts/workspacePhotographer?orderId=`+ id })
}

// 摄影师确认原图订单
export const postSubmitOrder = (id:any) => {
  const data = { status: 4, orderId: id }
  return request.post({ url: '/app-api/member/p/order/updateStatus', data })
}

export const postSubmitTouchOrder = (id:any) => {
  const data = { status: 6, orderId: id }
  return request.post({ url: '/app-api/member/p/order/updateStatus', data })
}

export const postReverseTouchOrder = (id:any) => {
  const data = { status: 5, orderId: id }
  return request.post({ url: '/app-api/member/p/order/updateStatus', data })
}