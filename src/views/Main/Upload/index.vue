<template>
  <n-spin :show="loading">
    <div class="upload-layout">
      <n-layout-header class="upload-layout-header">
        <div class="left">
          <span style="margin-right: 20px">选择订单</span>
          <n-select
            v-model:value="select"
            :options="options"
            style="width: 400px"
            @update:value="getDataDetail()"
          />
        </div>
        <div class="right">
          <span style="margin-right: 20px">正在上传</span>
          <span>1/128</span>
        </div>
      </n-layout-header>
      <div class="upload-layout-list" v-if="data.length">
        <n-layout-header>
          <n-layout class="card">
            <div class="card-content">
              <div class="left">
                <div class="tag">风格写真</div>
                <div class="detail">
                  <div>
                    <span style="margin-right: 20px">客户:</span>
                    <span>{{ detail.user.nickname }} {{ detail.user.mobile }}</span>
                  </div>
                  <div>
                    <span style="margin-right: 20px">地点:</span>
                    <span>{{ detail.location }}</span>
                  </div>
                  <div>
                    <span style="margin-right: 20px">备注:</span>
                    <span>{{ detail.remark }}</span>
                  </div>
                </div>
                <div class="price">￥ {{ detail.orderAmt }}</div>
              </div>
            </div>
          </n-layout>
        </n-layout-header>
        <div class="upload-layout-list-content">
          <n-layout position="absolute" :native-scrollbar="false">
            <div class="item" v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7]" v-bind:key="index">
              <div class="info" style="width: 30%">
                <n-image
                  src="/image/girl.svg"
                  :width="30"
                  style="margin-right: 20px; border-radius: 4px"
                />
                <span>123456.jpg</span>
              </div>
              <div class="size" style="width: 20%">12.47MB</div>
              <div class="progress" style="width: 40%">
                <n-progress type="line" :percentage="40" style="width: 300px"></n-progress>
              </div>
              <div class="operation">
                <n-button style="margin-right: 20px">开始</n-button>
                <n-button>取消</n-button>
              </div>
            </div>
          </n-layout>
        </div>
      </div>
      <div class="empty" v-else>
        <NImage src="/image/empty.svg" preview-disabled />
        <span style="margin-top: 40px">暂无订单</span>
      </div>
    </div>
  </n-spin>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import * as orderApi from '@/api/order'
import type { orderVO } from '@/types/order'

interface option {
  label: string
  value: string
}
const loading = ref(false)
const options = ref<option[]>([])
const select = ref()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  status: '0'
})
const data = ref<orderVO[]>([])
const detail = ref<orderVO>({
  user: {
    nickname: '',
    mobile: ''
  }
} as orderVO)
const getData = async () => {
  loading.value = true
  try {
    const res = await orderApi.getUserOrders(queryParams)
    data.value = res.list
    data.value.forEach((item) => {
      const option = {
        label: item.id,
        value: item.id
      }
      options.value.push(option)
    })
    if (data.value.length) select.value = options.value[0].label
  } finally {
    loading.value = false
  }
}
const getDataDetail = async () => {
  loading.value = true
  try {
    let res = await orderApi.getOrderDetail(select.value)
    detail.value = res
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getData()
  await getDataDetail()
})
</script>
<style scoped lang="scss">
.upload-layout {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 15px 20px;
  width: 100%;
  height: calc(100vh - 100px);
  background-color: #fff;
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
    }
    .right {
      display: flex;
      align-items: center;
      span:nth-child(2) {
        color: #142af3;
      }
    }
  }
  &-list {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-top: 20px;
    .card {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0.12);
      padding: 15px 10px;
      &-content {
        display: flex;
        box-sizing: border-box;
        flex-direction: row;
        justify-content: space-between;
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
    &-content {
      flex: 1;
      margin-top: 10px;
      position: relative;
      .item {
        padding: 20px 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        display: flex;
        > div {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .empty {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    flex: 1;
    width: 100%;
  }
}
</style>
