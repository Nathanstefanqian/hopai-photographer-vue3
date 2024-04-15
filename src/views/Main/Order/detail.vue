<template>
  <div>
    <n-spin :show="loading">
      <n-layout class="card">
        <n-layout-header class="card-header">
          <span style="margin-right: 50px">{{ formatOnlyDate(data.appointmentStartTime) }}</span>
          <span style="margin-right: 20px">订单号：{{ data.id }}</span>
          <n-icon class="icon" @click="copyOrderId(data.id)">
            <CopyOutline />
          </n-icon>
        </n-layout-header>
        <div class="card-content">
          <div class="left">
            <div class="tag">{{ data.spuDescribe }}</div>
            <div class="detail">
              <div>
                <span style="margin-right: 20px">客户:</span>
                <span>{{ data.memberName }} {{ data.memberPhone }}</span>
              </div>
              <div>
                <span style="margin-right: 20px">地点:</span>
                <span>{{ data.location }}</span>
              </div>
              <div>
                <span style="margin-right: 20px">备注:</span>
                <span>{{ data.remark || '无' }}</span>
              </div>
            </div>
            <div class="price">￥ {{ data.orderAmt / 100 }} 元</div>
          </div>
          <div class="right">
            <span>{{ getStatus(data.orderStatus) }}</span>
          </div>
        </div>
      </n-layout>

      <n-layout class="upload" style="display: relative">
        <n-layout-header class="upload-header">
          <div class="left">
            <span :class="!active ? 'active' : ''" @click="() => getData(0)">底图</span>
            <span :class="!active ? '' : 'active'" style="margin-left: 20px" @click="getData(1)"
              >精修图</span
            >
          </div>
          <div class="right">
            <span style="margin-right: 10px">
              {{
                active
                  ? '顾客已选择 ' + touchDataTotal + ' 张/ 已精修 ' + touchDataFinishedTotal
                  : '已上传 ' + picDataTotal
              }}
              张
              <span style="color: red">{{ active ? '(点击图片上传按钮上传精修图)' : '' }}</span>
            </span>

            <n-button
              style="margin-right: 20px"
              @click="triggerFileInput"
              v-if="data.orderStatus == 3 && !active"
              >上传原图</n-button
            >

            <input
              type="file"
              ref="fileInput"
              style="display: none"
              @change="handleFileChange"
              multiple
            />
            <input
              type="file"
              ref="touchfileInput"
              style="display: none"
              @change="handleTouchFileChange"
            />

            <n-popconfirm @positive-click="handleSubmitOriginal" v-if="!active">
              <template #trigger>
                <n-button type="primary" :disabled="data.orderStatus !== 3">提交原图</n-button>
              </template>
              确认提交原图嘛
            </n-popconfirm>
            <n-popconfirm @positive-click="handleSubmitTouch" v-else>
              <template #trigger>
                <n-button type="primary" :disabled="data.orderStatus !== 5">提交精修图</n-button>
              </template>
              确认提交精修图嘛
            </n-popconfirm>
          </div>
        </n-layout-header>

        <n-layout class="upload-content-layout" position="absolute" :native-scrollbar="false">
          <div class="upload-content-layout-wrap">
            <!-- 空状态 -->
            <div class="upload-empty-layout" v-if="active ? !touchData.length : !picData.length">
              <div class="empty">
                <n-image src="/image/empty.svg" preview-disabled />
                <span style="margin-top: 20px" @click="triggerFileInput">{{
                  active ? '等待客人选图' : '请上传原图'
                }}</span>
              </div>
            </div>
            <!-- 精修图 -->
            <n-image-group v-if="active">
              <n-space :size="15">
                <div class="image" v-for="(item, index) in touchData" v-bind:key="index">
                  <n-image
                    class="image-block"
                    width="100"
                    height="100"
                    object-fit="cover"
                    :src="item.bigPicUrlMini ? item.bigPicUrlMini : item.picUrlMini"
                    :preview-src="item.bigPicUrl ? item.bigPicUrl : item.picUrl"
                    :show-toolbar="false"
                  />
                  <span class="pic-name">{{ item.picName }}</span>
                  <div class="image-block-left cancel">
                    <n-icon-wrapper :size="20" :border-radius="10">
                      <n-icon v-if="item.bigPicUrl" :size="15" :component="Checkmark16Filled" />
                      <n-icon
                        v-else
                        :size="15"
                        :component="ArrowUpload24Filled"
                        @click="handleUpload(item.id)"
                      />
                    </n-icon-wrapper>
                  </div>
                  <n-popconfirm
                    @positive-click="handleDeleteTouchPhoto(item.id)"
                    v-if="item.bigPicUrl && data.orderStatus == 5"
                  >
                    <template #trigger>
                      <div class="image-block-right">
                        <n-icon><Trash /></n-icon>
                      </div>
                    </template>
                    确认删除该精修照片嘛
                  </n-popconfirm>
                </div>
              </n-space>
            </n-image-group>

            <!-- 原图 -->
            <n-image-group v-else>
              <n-space :size="15">
                <div class="image" v-for="(item, index) in picData" v-bind:key="index">
                  <n-image
                    class="image-block"
                    width="100"
                    height="100"
                    object-fit="cover"
                    :src="item.picUrlMini"
                    :preview-src="item.picUrl"
                  />
                  <span class="pic-name">{{ item.picName }}</span>
                  <n-popconfirm
                    @positive-click="handleDeletePhoto(item.id)"
                    v-if="!active && data.orderStatus == 3"
                  >
                    <template #trigger>
                      <div class="image-block-right">
                        <n-icon><Trash /></n-icon>
                      </div>
                    </template>
                    确认删除该照片嘛
                  </n-popconfirm>
                </div>
              </n-space>
            </n-image-group>
          </div>
        </n-layout>
        <div class="upload-content-layout-pagnination-wrap">
          <n-pagination
            v-model:page="queryParams.pageNo"
            v-model:page-size="queryParams.pageSize"
            :item-count="active ? touchDataTotal : picDataTotal"
            @click="getData(active)"
          />
        </div>
      </n-layout>
      <n-modal v-model:show="uploadModal" :mask-closable="false">
        <n-card
          style="width: 600px"
          title="正在上传中请勿关闭此窗口"
          :bordered="false"
          size="small"
          role="dialog"
          aria-modal="true"
        >
          <template #header-extra>
            <n-button @click="handleUploadAbort" :bordered="false">停止</n-button>
          </template>
          <div class="uploadModal-layout">
            上传进度 {{ uploadNumberSuccess + '/' + uploadNumberTotal }}
          </div>
        </n-card>
      </n-modal>
    </n-spin>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { CopyOutline, Trash } from '@vicons/ionicons5'
import Checkmark16Filled from '@vicons/fluent/Checkmark16Filled'
import ArrowUpload24Filled from '@vicons/fluent/ArrowUpload24Filled'
import * as orderApi from '@/api/order'
import * as uploadApi from '@/api/upload'
import { formatOnlyDate } from '@/utils/time'
import { makeUUID, copyOrderId } from '@/utils/tools'
import type { orderVO, picVO } from '@/types/order'
import { useMessage } from 'naive-ui'
import { useUpload } from '@/hooks/useUpload'
const message = useMessage()
const route = useRoute()
const active = ref(0) // 激活标签
const id = route.params.id ?? '' // 订单id
const photoId = ref<string>() // 当前选中要去精修的图片
const loading = ref(false)
const { getStsToken, put, signatrueUrl } = useUpload(id as string) // oss 钩子
const data = ref<orderVO>({} as orderVO) // 订单信息
const uploadModal = ref(false)
const uploadNumberTotal = ref<number>(0)
const uploadNumberSuccess = ref<number>(0)
const uploadAbort = ref(false)

const fileInput = ref<HTMLInputElement | null>(null) // 原图上传ref
const touchfileInput = ref<HTMLInputElement | null>(null) // 精修图上传ref

const picData = ref<picVO[]>([]) // 用来维护一个底图原图的数组
const picDataTotal = ref<number>() // 总数

const touchData = ref<picVO[]>([]) // 用来维护精修图的数组
const touchDataTotal = ref<number>() // 总数
const touchDataFinishedTotal = ref<number>(0) // 已精修的个数

// 测试用图片数组
const testData = ref<picVO[]>(
  Array.from({ length: 35 }, (_, index) => ({
    orderId: '1776907519184646145',
    picName: 'test',
    picUrl: ''
  }))
)

// 请求参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 30,
  orderId: id,
  statusList: ['0', '1']
})

// 删除事件
const handleDeletePhoto = async (id: any) => {
  const res = await uploadApi.deletePhotographerPic(id)
  if (res) {
    message.success('删除成功')
    await getData(active.value)
  }
}

const handleDeleteTouchPhoto = async (id: any) => {
  const res = await uploadApi.updatePhotographerPic({ id, bigPicUrl: '' })
  if (res) {
    message.success('删除成功')
    await getData(active.value)
  }
}

// 提交事件
const handleSubmitOriginal = async () => {
  await uploadApi.postSubmitOrder(id)
  message.success('原图提交成功')
  await getData(active.value)
}

const handleSubmitTouch = async () => {
  const error = ref(true)
  if (touchDataTotal.value != touchDataFinishedTotal.value) {
    message.error('还有照片没有精修')
    error.value = false
  }
  if (error.value) {
    const res = await uploadApi.postSubmitTouchOrder(id)

    if (res) {
      message.success('精修图提交成功')
      await getData(active.value)
    }
  }
}

// 上传精修图
const handleUpload = async (id: any) => {
  photoId.value = id
  touchfileInput.value?.click()
}

// 上传原图
const triggerFileInput = () => {
  // 模拟点击文件输入框
  fileInput.value?.click()
}

// 上传事件
const handleFileChange = async (event: Event) => {
  // 处理文件变更
  uploadModal.value = true
  uploadNumberSuccess.value = 0
  const selectedFile = (event.target as HTMLInputElement).files
  if (!selectedFile) return
  console.log(selectedFile.length)
  uploadNumberTotal.value = selectedFile.length
  for (const file of selectedFile) {
    if (uploadAbort.value) break
    const uuid = makeUUID()
    // 先上传到oss
    let name = `${data.value.memberId}/${id}/${uuid}`
    await put(name, file)
    // 这里获取到上传后的url
    let url = await signatrueUrl(name)
    // 对url进行处理
    let index = url.indexOf('?')
    url = url.substring(0, index)
    const params = reactive({
      orderId: id,
      picName: file.name,
      bigPicUrl: '',
      picUrl: url,
      description: '',
      status: 0
    })
    const res = await uploadApi.postPhotographerPic(params)
    if (res) {
      uploadNumberSuccess.value += 1
    }
    await getData(active.value)
  }
  if (uploadAbort.value) {
    message.error('上传中断')
    uploadAbort.value = false
  } else {
    message.success('上传成功')
  }
  uploadModal.value = false
}

const handleTouchFileChange = async (event: Event) => {
  const selectedFile = (event.target as HTMLInputElement).files
  if (!selectedFile) return
  const file = selectedFile[0]
  console.log(file)
  const uuid = makeUUID()
  // 先上传到oss
  let name = `${data.value.memberId}/${id}/${uuid}`
  await put(name, file)
  // 这里获取到上传后的url
  let url = await signatrueUrl(name)
  // 对url进行处理
  let index = url.indexOf('?')
  url = url.substring(0, index)
  const params = {
    id: photoId.value,
    bigPicUrl: url
  }
  const res = await uploadApi.updatePhotographerPic(params)
  if (res) {
    message.success('上传精修图成功')
    await getData(active.value)
  }
}

const handleUploadAbort = async () => {
  uploadAbort.value = true
}

// 获取数据
const getData = async (activeId: any) => {
  loading.value = true
  touchDataFinishedTotal.value = 0
  if (active.value != activeId) {
    active.value = activeId
    queryParams.pageNo = 1
  }

  queryParams.statusList = active.value ? ['1'] : ['0', '1']

  try {
    let pic = await uploadApi.getPhotographerPic(queryParams)
    await getStsToken()
    if (active.value) {
      touchData.value = pic.list
      touchDataTotal.value = pic.total
    } else {
      picData.value = pic.list
      picDataTotal.value = pic.total
    }

    // 处理图片URL
    await Promise.all(
      (active.value ? touchData.value : picData.value).map(async (item) => {
        let index = item.picUrl.indexOf('.com') + 4
        item.picUrlMini = await signatrueUrl(`${item.picUrl.substring(index)}/minipreview`)
        item.picUrl = await signatrueUrl(item.picUrl.substring(index))

        if (item.bigPicUrl) {
          index = item.bigPicUrl.indexOf('.com') + 4
          item.bigPicUrlMini = await signatrueUrl(`${item.bigPicUrl.substring(index)}/minipreview`)
          item.bigPicUrl = await signatrueUrl(item.bigPicUrl.substring(index))
          touchDataFinishedTotal.value += 1
        }
        return item
      })
    )

    data.value = await orderApi.getOrderDetail(id)
  } finally {
    loading.value = false
  }
}

// 获取状态标签
const getStatus = (id: any) => {
  switch (id) {
    case 3:
      return '待传图'
    case 4:
      return '待用户选图'
    case 5:
      return '待修图'
    case 6:
      return '待交付'
  }
}

onMounted(async () => {
  await getData(active.value)
})
</script>
<style scoped lang="scss">
.card {
  width: 100%;
  box-sizing: border-box;
  padding: 15px 10px;
  // filter: blur(1px);
  &-header {
    display: flex;
    align-items: center;
    color: rgba(31, 34, 37, 0.5);
    background-color: #fafafc;
    padding: 5px 8px;
    .icon {
      &:hover {
        cursor: pointer;
        color: #142af3;
        transition: all 0.5s ease;
      }
      transition: all 0.4s ease;
    }
  }
  &-content {
    display: flex;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 8px;
    width: 100%;
    .left {
      display: flex;
      flex-direction: column;
      .tag {
        text-align: center;
        border-radius: 4px;
        background-color: rgba(249, 233, 132, 0.9);
        max-width: 80px;
        padding: 4px 0;
      }
      .detail {
        display: flex;
        flex-direction: column;
        color: rgba(40, 40, 40, 0.5);
        margin-top: 10px;
      }
      .price {
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      height: 130px;
      justify-content: center;
      margin-right: 40px;
      color: #142af3;
    }
  }
}
.upload {
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  padding: 15px 30px;
  height: calc(100vh - 330px);
  &-header {
    display: flex;
    justify-content: space-between;
    .left {
      font-weight: 800;
      font-size: 18px;
      span {
        cursor: pointer;
      }
      .active {
        color: #142af3;
      }
    }
    .right {
      display: flex;
      align-items: center;
      span {
        color: #28282880;
        font-size: 12px;
      }
    }
  }
  &-content-layout {
    margin-top: 20px;
    padding: 0 10px;
    top: 40px;
    left: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 83%;
    &-wrap {
      padding: 15px 10px;
      .upload-empty-layout {
        width: 98%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
        border: 1px dashed rgba(0, 0, 0, 0.12);
        &:hover {
          background-color: #fafafc;
          transition: all 0.5s ease;
        }
        transition: all 0.5s ease;
        .empty {
          display: flex;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          color: rgba(31, 34, 37, 0.3);
        }
      }
    }
    &-pagnination-wrap {
      position: absolute;
      bottom: 0px;
      height: 50px;
      width: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .pic-name {
        text-overflow: ellipsis;
        /* 当文本溢出时隐藏溢出部分 */
        overflow: hidden;
        /* 强制文本在一行显示，不换行 */
        white-space: nowrap;
        /* 设置最大宽度为100px，可根据实际情况调整 */
        max-width: 100px;
      }
      &:hover {
        .image-block-left {
          opacity: 1;
          transition: all 0.2s ease;
        }
        .image-block-right {
          opacity: 1;
          transition: all 0.2s ease;
        }
        .image-block-center {
          opacity: 1;
          transition: all 0.2s ease;
        }
      }
      .cancel {
        opacity: 1;
      }
      &-block {
        border-radius: 4px;
        &-center {
          transition: all 0.5s ease;
          cursor: pointer;
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #fff;
          border-radius: 5px;
          filter: blur(5px);
        }
        &-left {
          transition: all 0.5s ease;
          cursor: pointer;
          position: absolute;
          opacity: 0;
          left: 4px;
          top: 4px;
          width: 20px;
          height: 20px;
          border-radius: 5px;
        }

        &-right {
          transition: all 0.5s ease;
          cursor: pointer;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          right: 4px;
          top: 4px;
          width: 20px;
          height: 20px;
          background-color: #fff;
          color: #ab353b;
          border-radius: 5px;
          background-image: '/image/bin.svg';
        }
      }
    }
  }
}
</style>
