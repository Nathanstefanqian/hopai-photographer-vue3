export interface orderVO {
  appointmentStartTime: string
  createTime: string
  id: string
  user: UserVO
  location: string
  remark?: string
  orderStatus: number
  orderAmt: number
  memberName: string
  memberPhone: string
  memberId: string
  spuDescribe: string
}

export interface UserVO {
  nickname: string
  mobile: string
}

export interface picVO {
  orderId: string
  picName?: string
  picUrl: string
  bigPicUrl?: string
  description?: string
  status?: string
  id?: string
  picUrlMini?: string
  bigPicUrlMini?: string
}