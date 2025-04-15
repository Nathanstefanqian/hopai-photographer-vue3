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

      <n-layout class="upload" style="display: relative" :native-scrollbar="false">
        <n-layout-header class="upload-header">
          <div class="left">
            <span :class="{ active: !active }" @click="getData(0)">底图</span>
            <span :class="{ active: active }" style="margin-left: 20px" @click="getData(1)">精修图</span>
          </div>
          <div class="right">
            <span style="margin-right: 10px">
              {{ uploadStatusText }}
              <span style="color: red">{{ uploadTipText }}</span>
            </span>

            <n-button style="margin-right: 20px" @click="triggerFileInput" v-if="showUploadButton"
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

            <n-popconfirm @positive-click="handleSubmit">
              <template #trigger>
                <n-button type="primary" :disabled="!canSubmit">{{ submitButtonText }}</n-button>
              </template>
              {{ submitConfirmText }}
            </n-popconfirm>
          </div>
        </n-layout-header>
        <n-layout-content class="upload-content" 
          :native-scrollbar="false" 
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="{'dragging': isDragging}">
          <div class="image-content" v-if="picData.length">
            <!-- 底图 -->
            <div class="image-group" v-if="active == 0">
              <div class="image" v-for="(item, index) in localPictures" v-bind:key="index">
                <n-image
                  lazy
                  class="image-block" 
                  width="120"
                  height="160"
                  object-fit="cover"
                  :src="item.localUrl"
                  :preview-src="item.localUrl"
                  fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
                <span class="pic-name">{{ item.picName }}</span>
                <n-popconfirm
                  @positive-click="handleDeletePhoto(index)" 
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
            </div>
            <!-- <n-spin v-if="isLoading && hasMore" class="loading-more">
              <template #icon>
                <n-icon class="loading-icon"><IconLoadingFilled /></n-icon>
              </template>
              <span>加载更多...</span>
            </n-spin> -->
            <div class="image-group image-group-touch" v-else>
              <n-layout-content class="image-group-touch-1" :native-scrollbar="false">
                <div>用户选择的底图</div>

              </n-layout-content>
              <n-layout-content class="image-group-touch-2" :native-scrollbar="false">
                <div>上传的精修图</div>
              </n-layout-content>
              <!-- <div class="image" v-for="(item, index) in touchData" v-bind:key="index">
                <n-image
                  class="image-block"
                  width="120"
                  height="160"
                  object-fit="cover"
                  :src="item.bigPicUrlMini ? item.bigPicUrlMini : item.picUrlMini"
                  :preview-src="item.bigPicUrl ? item.bigPicUrl : item.picUrl"
                  fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
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
              </div> -->
            </div>
        </div>
        <div
          class="image-empty"
          v-else
        >
          <n-image src="/image/empty.svg" preview-disabled />
          <span class="image-empty-title">暂无图片</span>
        </div>
      </n-layout-content>

      <div
        class="upload-pagnination"
      >
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
import { ref, onMounted, reactive, computed } from 'vue'
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

interface LocalPicVO extends Omit<picVO, 'picUrl'> {
  file: File
  localUrl: string
}
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
// 滚动加载相关
const isLoading = ref(false)
const hasMore = ref(true)
const isDragging = ref(false)



// 本地存储图片数组
const localPictures = ref<LocalPicVO[]>([])
const localTouchPictures = ref<LocalPicVO[]>([])

// 请求参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  orderId: id,
  statusList: ['0', '1'],
  picType: 0
})

// 删除事件
const handleDeletePhoto = (index: number) => {
  localPictures.value.splice(index, 1)
  message.success('删除成功')
}

// const handleDeleteTouchPhoto = async (id: any) => {
//   const res = await uploadApi.updatePhotographerPic({ id, bigPicUrl: '' })
//   if (res) {
//     message.success('删除成功')
//     await getData(active.value)
//   }
// }



const handleSubmitTouch = async () => {
  const error = ref(true)
  if (touchDataTotal.value != touchDataFinishedTotal.value) {
    message.error('还有照片没有精修')
    error.value = false
  }
  if (error.value) {
    await Promise.all(
      touchData.value.map(async (item) => {
        const params = {
          id: item.id,
          status: 2
        }
        // await uploadApi.updatePhotographerPic(params)
      })
    )
    // await uploadApi.updatePhotographerPicStatus(id)
    const res = await uploadApi.postSubmitTouchOrder(id)

    if (res) {
      message.success('精修图提交成功')
      await getData(active.value)
    }
  }
}

const uploadStatusText = computed(() =>
  active.value
    ? `顾客已选择 ${touchDataTotal.value} 张/ 已精修 ${touchDataFinishedTotal.value} 张`
    : `已上传 ${picDataTotal.value} 张`
)

const uploadTipText = computed(() => (active.value ? '(点击图片上传按钮上传精修图)' : ''))

const showUploadButton = computed(() => data.value.orderStatus === 3 && !active.value)

const canSubmit = computed(() =>
  active.value ? data.value.orderStatus === 5 : data.value.orderStatus === 3
)

const submitButtonText = computed(() => (active.value ? '提交精修图' : '提交原图'))

const submitConfirmText = computed(() => (active.value ? '确认提交精修图嘛' : '确认提交原图嘛'))

const handleSubmit = () => {
  if (active.value) {
    handleSubmitTouch()
  } else {
    handleSubmitOriginal()
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
const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const width = img.width * 0.4
        const height = img.height * 0.4
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.1))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

const handleFileChange = async (event: Event) => {
  uploadModal.value = true
  uploadNumberSuccess.value = 0
  const selectedFiles = (event.target as HTMLInputElement).files
  if (!selectedFiles) return
  uploadNumberTotal.value = selectedFiles.length

  for (const file of selectedFiles) {
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件')
      continue
    }

    const compressedUrl = await compressImage(file)
    localPictures.value.push({
      orderId: id as string,
      picName: file.name,
      file,
      localUrl: compressedUrl,
      picType: 0,
      status: 0
    })
    uploadNumberSuccess.value += 1
  }

  if(uploadNumberSuccess.value == uploadNumberTotal.value){
    setTimeout(() => {
      uploadModal.value = false
      message.success('添加原图成功')
      getData(active.value)
    }, 1000)
  }
}

// 正式上传
const handleSubmitOriginal = async () => {
  const uploadParams: any = []
  for (const item of localPictures.value) {
    const uuid = makeUUID()
    let name = `${data.value.memberId}/${id}/${uuid}`
    await put(name, item.file)
    let url = await signatrueUrl(name)
    let index = url.indexOf('?')
    url = url.substring(0, index)
    uploadParams.push({
      orderId: item.orderId,
      picName: item.picName,
      picType: item.picType,
      status: item.status,
      picUrl: url
    })
  }
  
  if (uploadParams.length > 0) {
    const res = await uploadApi.postPhotographerPic(uploadParams)
    if (!res) {
      return message.error('提交失败')
    } else {
      message.success('提交成功')
      await getData(active.value)
    }
  }


  // await uploadApi.postSubmitOrder(id)
  // message.success('原图提交成功')
  await getData(active.value)
}

const handleTouchFileChange = async (event: Event) => {
  uploadModal.value = true
  uploadNumberSuccess.value = 0
  const selectedFiles = (event.target as HTMLInputElement).files
  if (!selectedFiles) return
  uploadNumberTotal.value = selectedFiles.length

  for (const file of selectedFiles) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件')
      continue
    }

    const localUrl = URL.createObjectURL(file)
    localTouchPictures.value.push({
      orderId: id as string,
      picName: file.name,
      file,
      localUrl,
      picType: 1,
      status: 0
    })
    uploadNumberSuccess.value += 1
}

if(uploadNumberSuccess.value == uploadNumberTotal.value){
  setTimeout(() => {
    uploadModal.value = false
    message.success('添加精修图成功')
  }, 1000)
}
}

const handleUploadAbort = async () => {
  uploadAbort.value = true
  uploadModal.value = false
}



// 获取数据
const getData = async (activeId: any, isLoadMore = false) => {
  loading.value = !isLoadMore
  touchDataFinishedTotal.value = 0
  data.value = await orderApi.getOrderDetail(id)
  if (active.value != activeId && !isLoadMore) {
    active.value = activeId
    queryParams.pageNo = 1
    queryParams.pageSize = 50
    hasMore.value = true
  }
  
  // 订单状态为3(待传图)且在底图tab时使用本地图片
  if (data.value.orderStatus === 3 && !active.value) {
    const startIndex = (queryParams.pageNo - 1) * queryParams.pageSize
    const endIndex = startIndex + queryParams.pageSize
    const paginatedPictures = localPictures.value.slice(startIndex, endIndex)
    
    picData.value = paginatedPictures.map(item => ({
      ...item,
      picUrl: item.localUrl,
      picUrlMini: item.localUrl
    }))
    picDataTotal.value = localPictures.value.length
    loading.value = false
    return
  }

  // 只在非待传图状态或精修图tab时调用接口
  queryParams.statusList = active.value ? ['1', '2'] : ['0', '1', '2']
  queryParams.orderId = id
  queryParams.picType = 0

  try {
    let pic = await uploadApi.getPhotographerPic(queryParams)
    if (active.value) {
      touchData.value = isLoadMore ? [...touchData.value, ...pic.list] : pic.list
      touchDataTotal.value = pic.total
    } else {
      picData.value = isLoadMore ? [...picData.value, ...pic.list] : pic.list
      picDataTotal.value = pic.total
    }
    
    // hasMore.value = (active.value ? touchData.value.length : picData.value.length) < (active.value ? touchDataTotal.value : picDataTotal.value)

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

const handleDrop = async (event: DragEvent) => {
  if (data.value.orderStatus !== 3 || active.value !== 0) return
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (!files) return

  const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
  
  if (validFiles.length === 0) {
    message.error('只能上传图片文件')
    return
  }

  uploadModal.value = true
  uploadNumberSuccess.value = 0
  uploadNumberTotal.value = validFiles.length

  for (const file of validFiles) {
    const localUrl = URL.createObjectURL(file)
    localPictures.value.push({
      orderId: id as string,
      picName: file.name,
      file,
      localUrl,
      picType: 0,
      status: 0
    })
    uploadNumberSuccess.value += 1
  }

  if(uploadNumberSuccess.value == uploadNumberTotal.value) {
    setTimeout(() => {
      uploadModal.value = false
      message.success('添加原图成功')
      getData(active.value)
    }, 1000)
  }
}

onMounted(async () => {
  await getStsToken()
  await getData(active.value)
})
</script>
<style scoped lang="scss">
/* 移除重复的style标签 */
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
  // height: calc(100vh - 330px);

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

  &-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 500px;
    // 这一行高度很重要 
    margin-top: 20px;
    box-sizing: border-box;
    padding: 16px;

    .image-group {
      display: flex;
      flex-wrap: wrap;
      .image {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
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
      &-touch {
        display: flex;
        height: 400px;
        &-1 {
          width: 50%;
          height: 400px;
          box-sizing: border-box;
          padding: 0 8px;
          border-right: 2px dashed #ccc;
          .test {
            width: 100px;
            height: 700px;
            background-color: blue;
          }
        }
        &-2 {
          width: 50%;
          height: 400px;
          box-sizing: border-box;
          padding: 0 8px;
        }
      }

    }

    .image-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 468px;
      &-title {
        margin-top: 40px;
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  &-pagnination {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .upload {
    &-content {
      .loading-more {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        .loading-icon {
          margin-right: 8px;
          animation: rotate 1s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      }
    }
  }
}

.upload-content {
  position: relative;
  &.dragging::after {
    content: '释放鼠标上传图片';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 1;
  }
}

</style>





