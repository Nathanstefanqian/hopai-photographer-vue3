export interface orderVO {
  appointmentStartTime: string
  id: string
  user: UserVO
  location: string
  remark?: string
  orderStatus: number
  orderAmt: string
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
  picName: string
  picUrl: string
  bigPicUrl: string
  description: string
  status: string
  id: string
}