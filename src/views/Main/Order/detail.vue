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
            <span :class="{ active: active && data.orderStatus >= 5, disabled: data.orderStatus < 4 }" style="margin-left: 20px" @click="data.orderStatus >= 5 ? getData(1) : null">精修图</span>
          </div>
          <div class="right">
            <span style="margin-right: 10px">
              {{ uploadStatusText }}
              <span style="color: red">{{ uploadTipText }}</span>
            </span>
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
              multiple
            />
            <n-button style="margin-right: 20px" @click="triggerFileInput" v-if="showUploadButton">
              {{ active ? '上传精修图' : '上传原图' }}
            </n-button>
            <n-popconfirm @positive-click="handleReverse">
              <template #trigger>
                <template v-if="data.orderStatus === 6 && active ">
                  <n-button style="margin-right: 20px">
                    重新提交精修图
                  </n-button>
                </template>
                <template v-else>
                  <span></span>
                </template>
              </template>
              确认重新提交精修图吗？
            </n-popconfirm>
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
              <ImageDisplay
                v-for="(item, index) in picData"
                :key="index"
                :pic-data="item"
                :index="index"
                :pic-list="picData"
                :show-delete="data.orderStatus === 3 && !active"
                @delete="handleDeletePhoto"
              />
            </div>
            <div class="image-group image-group-touch" v-else>
              <div class="image-group-touch-header">
                <div class="header-item">顾客选择的底图</div>
                <div class="header-item header-item-padding">上传的精修图</div>
              </div>
              <div class="image-group-touch-content">
                <n-layout-content class="image-group-touch-content-wrap" :native-scrollbar="false">
                  <div class="image-group-touch-content-1">
                    <ImageDisplay
                      v-for="(item, index) in picData"
                      :key="index"
                      :pic-data="item"
                      :index="index"
                      :pic-list="picData"
                    />
                  </div>
                </n-layout-content>
                <n-layout-content class="image-group-touch-content-wrap" :native-scrollbar="false"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleTouchDrop"
                  :class="{'dragging': isDragging}">
                  <div class="image-group-touch-content-2" v-if="touchData.length">
                    <ImageDisplay
                      v-for="(item, index) in touchData"
                      :key="index"
                      :pic-data="item"
                      :index="index"
                      :show-delete="data.orderStatus === 5 && active"
                      :is-touch="true"
                      @delete="handleDeletePhoto"
                      :pic-list="touchData"
                    />
                  </div>
                  <div class="image-empty-touch" v-else>
                    <n-image src="/image/empty.svg" preview-disabled />
                    <span class="image-empty-title">拖拽文件或点击上传精修图来提交您的作品</span>
                  </div>
                </n-layout-content>
              </div>
            </div>
        </div>
        <div
          class="image-empty"
          v-else
        >
          <n-image src="/image/empty.svg" preview-disabled />
          <span class="image-empty-title">拖拽文件或点击上传原图来提交您的作品</span>
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
          v-if="!active && picDataTotal"
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
import { CopyOutline } from '@vicons/ionicons5'
import ImageDisplay from '@/components/core/ImageDisplay.vue'
import * as orderApi from '@/api/order'
import * as uploadApi from '@/api/upload'
import { formatOnlyDate } from '@/utils/time'
import { makeUUID, copyOrderId } from '@/utils/tools'
import type { orderVO, picVO } from '@/types/order'
import { useMessage } from 'naive-ui'
import { useUpload } from '@/hooks/useUpload'
const message = useMessage()

interface LocalPicVO extends Omit<picVO, 'picUrl'> {
  localUrl: string,
  picUrlMini?: string,
  picUrl?: string
}
const route = useRoute()
const active = ref(0) // 激活标签
const id = route.params.id ?? '' // 订单id
const loading = ref(false)
const { getStsToken, put, signatrueUrl } = useUpload(id as string) // oss 钩子
const data = ref<orderVO>({} as orderVO) // 订单信息
const uploadModal = ref(false)
const uploadNumberTotal = ref<number>(0)
const uploadNumberSuccess = ref<number>(0)
const uploadAbort = ref(false)

const fileInput = ref<HTMLInputElement | null>(null) // 原图上传ref
const touchfileInput = ref<HTMLInputElement | null>(null) // 精修图上传ref

const picData = ref<any>([]) // 用来维护一个底图原图的数组
const picDataTotal = ref<number>() // 总数

const touchData = ref<any>([]) // 用来维护精修图的数组
const touchDataTotal = ref<number>() // 总数
const touchDataFinishedTotal = ref<number>(0) // 已精修的个数
// 滚动加载相关
const isDragging = ref(false)

// 本地存储图片数组
const localPictures = ref<LocalPicVO[]>([])
const localTouchPictures = ref<LocalPicVO[]>([])

// 请求参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 50,
  orderId: id,
  statusList: ['0', '1'],
  picType: 0
})

// 删除事件
const handleDeletePhoto = async (index: number, isTouch: boolean) => {
  if (isTouch) {
    localTouchPictures.value.splice(index, 1)
    await getTouchData()
  } else {
    localPictures.value.splice(index, 1)
    await getData(active.value)
  }
  message.success('删除成功')
}

const handleSubmitTouch = async () => {
  try {
    if (localTouchPictures.value.length < (picDataTotal.value || 0)) {
      message.error(`精修图数量不足，需要上传至少${picDataTotal.value}张精修图`)
      return
    }
    uploadModal.value = true
    uploadNumberSuccess.value = 0
    const uploadParams: any = []
    uploadNumberTotal.value = localTouchPictures.value.length

    for (const item of localTouchPictures.value) {
      if (uploadAbort.value) {
        uploadAbort.value = false
        uploadModal.value = false
        return
      }
      uploadParams.push({
        orderId: item.orderId,
        picName: item.picName,
        picType: item.picType,
        status: item.status,
        bigPicUrl: item.localUrl
      })
      uploadNumberSuccess.value += 1
    }

    if (uploadParams.length > 0) {
      const res = await uploadApi.postPhotographerPic(uploadParams)
      if (!res) {
        return message.error('提交失败')
      } else {
        await uploadApi.postSubmitTouchOrder(id)
        message.success('提交成功')
        localTouchPictures.value = []
      }
    }
    uploadModal.value = false
    await getData(active.value)
  } catch (error) {
    message.error('提交失败，请重试')
    uploadModal.value = false
  }
}

const uploadStatusText = computed(() => {
  if (active.value) {
    if (data.value.orderStatus === 5) {
      return `顾客已选择 ${picDataTotal.value} 张 / 已上传精修图 ${localTouchPictures.value.length} 张`
    }
    return `顾客已选择 ${picDataTotal.value} 张 / 已精修 ${touchDataTotal.value} 张`
  }
  return `已上传 ${picDataTotal.value} 张`
})

const showUploadButton = computed(() => {
  if (!active.value) return data.value.orderStatus === 3
  return data.value.orderStatus === 5
})

const uploadTipText = computed(() => (active.value ? '(点击图片上传按钮上传精修图)' : ''))

const triggerFileInput = () => {
    if (active.value) {
      touchfileInput.value?.click()
    } else {
      fileInput.value?.click()
    }
}

const handleReverse = async () => {
  const res = await uploadApi.postReverseTouchOrder(id)
  if (!res) {
    message.error('重置失败')
  } else {
    message.success('重置成功')
    await getData(active.value)
  }
}

const handleFileChange = async (event: Event) => {
  try {
    uploadModal.value = true
    uploadNumberSuccess.value = 0
    const selectedFiles = (event.target as HTMLInputElement).files
    if (!selectedFiles) return
    uploadNumberTotal.value = selectedFiles.length

    const validFiles = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'))
    if (validFiles.length === 0) {
      message.error('只能上传图片文件')
      return
    }

    for (const file of validFiles) {
      if (uploadAbort.value) {
        uploadAbort.value = false
        uploadModal.value = false
        return
      }
      const uuid = makeUUID()
      let name = `${data.value.memberId}/${id}/${uuid}`
      await put(name, file)
      let url = await signatrueUrl(name)
      let index = url.indexOf('?')
      url = url.substring(0, index)
      localPictures.value.push({
        orderId: id as string,
        picName: file.name,
        localUrl: url,
        picUrlMini: `${url}/minipreview`,
        picUrl: url,
        picType: 0,
        status: 0
      })
      uploadNumberSuccess.value += 1
    }

    if(uploadNumberSuccess.value === uploadNumberTotal.value) {
      await getData(active.value)
      message.success('添加原图成功')
    }
  } catch (error) {
    message.error('上传失败，请重试')
  } finally {
    console.log(localPictures.value,'123')
    uploadModal.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const submitButtonText = computed(() => {
  if (!active.value) {
    return '提交原图'
  }
  return '提交精修图'
})

const submitConfirmText = computed(() => {
  if (!active.value) {
    return '确认提交原图吗？'
  }
  return '确认提交精修图吗？'
})

const canSubmit = computed(() => {
  if (!active.value) {
    return data.value.orderStatus === 3 && localPictures.value.length > 0
  }
  return data.value.orderStatus === 5 && localTouchPictures.value.length > 0
})

const handleSubmit = () => {
  if (!active.value) {
    handleSubmitOriginal()
  } else {
    handleSubmitTouch()
  }
}

const handleSubmitOriginal = async () => {
  try {
    uploadModal.value = true
    uploadNumberSuccess.value = 0
    const uploadParams: any = []
    uploadNumberTotal.value = localPictures.value.length
    for (const item of localPictures.value) {
      if (uploadAbort.value) {
        uploadAbort.value = false
        uploadModal.value = false
        return
      }
      uploadParams.push({
        orderId: item.orderId,
        picName: item.picName,
        picType: item.picType,
        status: item.status,
        picUrl: item.localUrl
      })
      uploadNumberSuccess.value += 1
    }
  
    if (uploadParams.length > 0) {
      const res = await uploadApi.postPhotographerPic(uploadParams)
      if (!res) {
        return message.error('提交失败')
      } else {
        await uploadApi.postSubmitOrder(id)
        message.success('提交成功')

      }
    }
  } finally {
    uploadModal.value = false
    await getData(active.value)
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}


const handleUploadAbort = async () => {
  uploadAbort.value = true
  uploadModal.value = false
}

// 获取数据
const getTouchData = async () => {
  touchData.value = localTouchPictures.value
  touchDataTotal.value = localTouchPictures.value.length
  queryParams.statusList = ['1']
  queryParams.orderId = id
  const originalParams = { ...queryParams, picType: 0 }
  let originalPic = await uploadApi.getPhotographerPic(originalParams)
  picData.value = originalPic.list.map((item: any) => {
    item.picUrlMini = `${item.picUrl}/minipreview`
    return item
  })
  picDataTotal.value = originalPic.total
  loading.value = false
}

const getData = async (activeId: number) => {
  try {
    loading.value = true
    touchDataFinishedTotal.value = 0
    data.value = await orderApi.getOrderDetail(id)
    if (active.value !== activeId) {
      active.value = activeId
      queryParams.pageNo = 1
      queryParams.pageSize = 50
    }
  
    // 订单状态为3(待传图)且在底图tab时使用本地图片
    if (data.value.orderStatus === 3 && !active.value) {
      const startIndex = (queryParams.pageNo - 1) * queryParams.pageSize
      const endIndex = startIndex + queryParams.pageSize
      const paginatedPictures = localPictures.value.slice(startIndex, endIndex)

      picData.value = paginatedPictures
      picDataTotal.value = localPictures.value.length
      loading.value = false
      return
    }

    // 订单状态为5(待修图)且在精修图tab时使用本地图片
    if (data.value.orderStatus === 5 && active.value) {
      await getTouchData()
      return
    }

    // 其他状态调用接口
    queryParams.orderId = id
    queryParams.picType = active.value
    queryParams.statusList = ['0', '1', '2']
    let pic = await uploadApi.getPhotographerPic(queryParams)
    if (active.value) {
      touchData.value = pic.list.map((item: any) => {
        item.bigPicUrlMini = `${item.bigPicUrl}/minipreview`
        return item
      })
      touchDataTotal.value = pic.total

      // 在精修图tab时也获取底图数据
      queryParams.statusList = ['1']
      const originalParams = { ...queryParams, picType: 0 }
      let originalPic = await uploadApi.getPhotographerPic(originalParams)
      picData.value = originalPic.list
      picDataTotal.value = originalPic.total
    } else {
      picData.value = pic.list
      picDataTotal.value = pic.total
      // 在底图tab时清空精修图数据
      touchData.value = []
      touchDataTotal.value = 0
    }
    picData.value = picData.value.map((item: any) => {
      item.picUrlMini = `${item.picUrl}/minipreview`
      return item
    })
    console.log(touchData.value,'123')
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
  try {
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
      if (uploadAbort.value) {
        uploadAbort.value = false
        uploadModal.value = false
        return
      }
      const uuid = makeUUID()
      let name = `${data.value.memberId}/${id}/${uuid}`
      await put(name, file)
      let url = await signatrueUrl(name)
      let index = url.indexOf('?')
      url = url.substring(0, index)
      localPictures.value.push({
        orderId: id as string,        picUrlMini: `${url}/minipreview`,
        picUrl: url,
        picName: file.name,
        localUrl: url,
        picType: 0,
        status: 0
      })
      uploadNumberSuccess.value += 1
    }

    if(uploadNumberSuccess.value === uploadNumberTotal.value) {
      await getData(active.value)
      message.success('添加原图成功')
    }
  } catch (error) {
    message.error('拖拽上传失败，请重试')
  } finally {
    uploadModal.value = false
    isDragging.value = false
  }
}

const handleTouchDrop = async (event: DragEvent) => {
  try {
    if (data.value.orderStatus !== 5 || !active.value) return
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
      if (uploadAbort.value) {
        uploadAbort.value = false
        uploadModal.value = false
        return
      }
      const uuid = makeUUID()
      let name = `${data.value.memberId}/${id}/${uuid}`
      await put(name, file)
      let url = await signatrueUrl(name)
      let index = url.indexOf('?')
      url = url.substring(0, index)
      localTouchPictures.value.push({
        orderId: id as string,
        picName: file.name,        
        bigPicUrl: url,
        bigPicUrlMini: `${url}/minipreview`,
        localUrl: url,
        picType: 1,
        status: 0
      })
      uploadNumberSuccess.value += 1
    }
    console.log(localTouchPictures.value, 'localTouchPictures.value')
    if(uploadNumberSuccess.value === uploadNumberTotal.value) {
      message.success('添加精修图成功')
      await getData(active.value)
    }
  } catch (error) {
    message.error('拖拽上传失败，请重试')
  } finally {
    uploadModal.value = false
    isDragging.value = false
  }
}

const handleTouchFileChange = async (event: Event) => {
  try {
    uploadModal.value = true
    uploadNumberSuccess.value = 0
    const selectedFiles = (event.target as HTMLInputElement).files
    if (!selectedFiles) return
    uploadNumberTotal.value = selectedFiles.length
    const validFiles = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'))
    if (validFiles.length === 0) {
      message.error('只能上传图片文件')
      return            
    }
    for (const file of validFiles) {
      if (uploadAbort.value) {
        uploadAbort.value = false
        uploadModal.value = false
        return
      }
      const uuid = makeUUID()
      let name = `${data.value.memberId}/${id}/${uuid}`
      await put(name, file)
      let url = await signatrueUrl(name)
      let index = url.indexOf('?')
      url = url.substring(0, index)
      localTouchPictures.value.push({
        orderId: id as string,
        picName: file.name,       
        bigPicUrl: url,
        bigPicUrlMini: `${url}/minipreview`,
        localUrl: url,
        picType: 1,
        status: 1           
      })
      uploadNumberSuccess.value += 1  
    }
    if(uploadNumberSuccess.value === uploadNumberTotal.value) {
      await getData(active.value)
      message.success('添加精修图成功')
    }
  } catch (error) {
    console.log(error)
  } finally {
    uploadModal.value = false
    isDragging.value = false
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
        &.active {
          color: #142af3;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
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
    height: calc(100vh - 450px);
    // 这一行高度很重要 
    margin-top: 20px;
    box-sizing: border-box;
    padding: 16px;
    padding-top: 0;
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

    .image-group {
      display: flex;
      flex-wrap: wrap;

      &-touch {
        display: flex;
        width: 100%;
        flex-direction: column;

        &-header {
          display: flex;
          width: 100%;
          .header-item {
            width: 50%;
            box-sizing: border-box;
            padding: 8px;
          }
        }

        &-content {
          display: flex;
          width: 100%;
          flex-direction: row;
          height: calc(100vh - 520px);
          &-wrap {
            display: flex;
            width: 50%;
          }
          &-1 {
              display: flex;
              flex-wrap: wrap;
              box-sizing: border-box;
              padding: 0 8px;
              border-right: 2px dashed #ccc;
              min-height: calc(100vh - 520px);
              .image {
                width: 120px;
              }
          }
          &-2 {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            padding: 0 8px;
            min-height: calc(100vh - 520px);
            .image {
                width: 120px;
              }
          }
        }
      }
    }

    .image-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: calc(100vh - 515px);
      &-title {
        margin-top: 40px;
        color: rgba(0, 0, 0, 0.3);
      }
    }
    .image-empty-touch {
      display: flex;
      min-height: calc(100vh - 520px);
      width: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }

  &-pagnination {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
</style>