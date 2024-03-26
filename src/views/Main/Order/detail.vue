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
            <div class="price">￥ {{ data.orderAmt }}</div>
          </div>
          <div class="right">
            <span>{{ getStatus(data.orderStatus) }}</span>
          </div>
        </div>
      </n-layout>

      <n-layout class="upload" style="display: relative">
        <n-layout-header class="upload-header">
          <div class="left">
            <span :class="!active ? 'active' : ''" @click="() => getTouchData(0)">底图</span>
            <span
              :class="!active ? '' : 'active'"
              style="margin-left: 20px"
              @click="getTouchData(1)"
              >精修图</span
            >
          </div>
          <div class="right">
            <span style="margin-right: 10px">已上传 {{ picData.length }} 张</span>
            <n-button style="margin-right: 20px" @click="triggerFileInput">增加照片</n-button>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              @change="handleFileChange"
              multiple
            />
            <n-button type="primary" @click="handleSubmitOriginal" v-if="!active"
              >提交原图</n-button
            >
            <n-button type="primary" @click="handleSubmitOriginal" v-else>提交精修图</n-button>
          </div>
        </n-layout-header>
        <div class="upload-empty-layout" v-if="!picData">
          <div class="empty">
            <n-image src="/image/add.svg" preview-disabled />
            <span style="margin-top: 20px">将图片拖进此处</span>
          </div>
        </div>
        <n-layout class="upload-content-layout" position="absolute" :native-scrollbar="false">
          <div class="upload-content-layout-wrap">
            <n-space :size="15">
              <div class="image" v-for="(item, index) in picData" v-bind:key="index">
                <n-image
                  class="image-block"
                  width="100"
                  height="100"
                  object-fit="cover"
                  :src="active ? item.picUrl : item.bigPicUrl"
                  :show-toolbar="false"
                />
                <span class="pic-name">{{ item.picName }}</span>
                <div class="image-block-left"></div>
                <n-popconfirm @positive-click="handleDeletePhoto(item.id, item.bigPicUrl)">
                  <template #trigger>
                    <div class="image-block-right">
                      <n-icon><Trash /></n-icon>
                    </div>
                  </template>
                  确认删除该照片嘛
                </n-popconfirm>
              </div>
            </n-space>
          </div>
        </n-layout>
      </n-layout>
    </n-spin>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { CopyOutline, Trash } from '@vicons/ionicons5'
import * as orderApi from '@/api/order'
import * as uploadApi from '@/api/upload'
import { formatOnlyDate } from '@/utils/time'
import { makeUUID, copyOrderId } from '@/utils/tools'
import type { orderVO, picVO } from '@/types/order'
import { useMessage } from 'naive-ui'
import OSS from 'ali-oss'

const message = useMessage()
const route = useRoute()
const active = ref(0)
const id = route.params.id
// 获取sts之后启动client
// sts获取以及oss上传相关

let client: any

// 获取sts并启动client
const getStsToken = async () => {
  let res = await uploadApi.getStsUpload(id)
  client = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: res.credentials.accessKeyId,
    accessKeySecret: res.credentials.accessKeySecret,
    stsToken: res.credentials.securityToken,
    bucket: 'hopai-workspace',
    refreshSTSToken: async () => {
      res = await uploadApi.getStsUpload(id)
      return {
        accessKeyId: res.credentials.accessKeyId,
        accessKeySecret: res.credentials.accessKeySecret,
        stsToken: res.credentials.securityToken
      }
    }
  })
}

// 上传方法
const put = async (ObjName: any, fileUrl: any) => {
  try {
    let res = await client.put(ObjName, fileUrl)
    return res
  } catch (e) {
    console.log(e)
  }
}

// 获取上传后的真实地址（用来返回给数据库）
const signatrueUrl = async (ObjName: any) => {
  try {
    let res = await client.signatureUrl(`${ObjName}`)
    return res
  } catch (e) {
    console.log(e)
  }
}

const handleDeletePhoto = async (id: any, name: any) => {
  const res = await uploadApi.deletePhotographerPic(id)
  if (res) {
    message.success('删除成功')
    await getData()
  }
}

const handleSubmitOriginal = async () => {
  await uploadApi.postSubmitOrder(id)
  message.success('原图提交成功')
}

const data = ref<orderVO>({} as orderVO)

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  // 模拟点击文件输入框
  fileInput.value?.click()
}

// 用来维护一个底图的数组
const picData = ref<picVO[]>([])

const handleFileChange = async (event: Event) => {
  // 处理文件变更
  const selectedFile = (event.target as HTMLInputElement).files
  if (!selectedFile) return
  for (const file of selectedFile) {
    const uuid = makeUUID()
    console.log(uuid)
    // 先上传到oss
    let name = `${data.value.memberId}/${id}/${uuid}`
    await put(name, file)
    // 这里获取到上传后的url
    let url = await signatrueUrl(name)
    // 对url进行处理
    let index = url.indexOf('?')
    url = url.substring(0, index)
    // 上传到订单平台
    const params = {
      orderId: id,
      picName: file.name,
      bigPicUrl: url,
      picUrl: '',
      description: '',
      status: 0
    }
    const res = await uploadApi.postPhotographerPic(params)
    // 上传成功
    if (res) {
      message.success('上传成功')
    }
    console.log('上传成功', res)
    await getData()
  }
  console.log('Selected File:', selectedFile)
}

const loading = ref(false)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 50
})

const getData = async () => {
  loading.value = true
  try {
    let res = await orderApi.getOrderDetail(id)
    let pic = await uploadApi.getPhotographerPic(queryParams)
    await getStsToken()
    picData.value = pic.list
    // 对picData的内容进行处理
    await Promise.all(
      picData.value.map(async (item) => {
        let index = item.bigPicUrl.indexOf('.com') + 4
        item.bigPicUrl = await signatrueUrl(item.bigPicUrl.substring(index))
        return item
      })
    )
    data.value = res
  } finally {
    loading.value = false
  }
}

const getTouchData = async (id: any) => {
  loading.value = true
  active.value = id
  if (!id) {
    await getData()
    return
  }
  try {
    let pic = await uploadApi.getPhotographerPic(queryParams)
    picData.value = pic.list.filter((item: any) => item.picUrl !== '')
    // 对picData的内容进行处理
    await Promise.all(
      picData.value.map(async (item) => {
        let index = item.picUrl.indexOf('.com') + 4
        item.picUrl = await signatrueUrl(item.picUrl.substring(index))
        return item
      })
    )
  } finally {
    loading.value = false
  }
}

const getStatus = (id: any) => {
  switch (id) {
    case 3:
      return '待传图'
    case 4:
      return '待用户选图'
    case 5:
      return '待修图'
  }
}
onMounted(async () => {
  await getData()
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
  &-empty-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
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
  &-content-layout {
    margin-top: 20px;
    padding: 0 10px;
    top: 40px;
    left: 30px;
    &-wrap {
      padding: 15px 10px;
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
      }
      &-block {
        border-radius: 4px;
        &-left {
          transition: all 0.5s ease;
          cursor: pointer;
          position: absolute;
          opacity: 0;
          left: 4px;
          top: 4px;
          width: 20px;
          height: 20px;
          background-color: #fff;
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
