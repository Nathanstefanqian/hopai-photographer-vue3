import request from '@/config/axios'

interface postPicVO {
  orderId: string | string[]
  picName: string
  picUrl: string
  bigPicUrl: string
  description: string
  status: number
}

interface getPicVO {
  pageNo: number
  pageSize: number
}

// 为订单添加一张照片
export const postPhotographerPic = (data: postPicVO) => {
  return request.post({ url: '/platform-api/member/photographer/deliver-pic/create', data })
}

// 为订单更新一张照片
export const updatePhotographerPic = (data:postPicVO) => {
  return request.put({ url: '/platform-api/member/photographer/deliver-pic/update', data })
}

// 为订单删除一张照片
export const deletePhotographerPic = (id: any) => {
  return request.delete({ url: `/platform-api/member/photographer/deliver-pic/delete/${id}` })
}

// 获取该订单下所有照片的分页
export const getPhotographerPic = (data: getPicVO) => {
  return request.get({ url: `/platform-api/member/photographer/deliver-pic/page?pageSize=${data.pageSize}&pageNo=${data.pageNo}` })
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