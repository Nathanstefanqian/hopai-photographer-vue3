<template>
  <n-spin :show="loading">
    <div class="table-wrap">
      <div class="table-layout" style="position: relative">
        <n-layout class="data-table" position="absolute">
          <header>
            <div style="width: 50%; justify-content: left">订单信息</div>
            <div style="width: 20%">拍摄时间</div>
            <div style="width: 15%">状态</div>
            <div style="width: 15%; margin-right: 0">操作</div>
          </header>
          <n-layout position="absolute" style="top: 35px" :native-scrollbar="false" class="data-table-body" v-if="data.length > 0">
            <div class="item" v-for="(item, index) in data" v-bind:key="index">
              <div class="top">
                <span style="margin-right: 32px">{{ item.createTime ? formatDate(item.createTime) : '暂无时间' }}</span>
                <span style="margin-right: 20px">订单号: {{ item.id }}</span>
                <n-icon class="icon" @click="copyOrderId(item.id)">
                  <CopyOutline />
                </n-icon>
              </div>
              <div class="bottom">
                <div class="info" style="width: 50%">
                  <div class="tag">{{ item.spuDescribe }}</div>
                  <div class="info-detail">
                    <div class="info-detail-row">
                      <span class="info-detail-title">客户：</span>
                      <span class="info-detail-content">{{ item.memberName || null }} {{ item.memberPhone || null }}</span>
                    </div>
                    <div class="info-detail-row">
                      <span class="info-detail-title">地点：</span>
                      <span class="info-detail-content">{{ item.location }}</span>
                    </div>
                    <div class="info-detail-row">
                      <span class="info-detail-title">备注：</span>
                      <span class="info-detail-content">{{ item.remark || '无' }}</span>
                    </div>
                  </div>
                  <div class="price">￥ {{ item.orderAmt / 100 }}</div>
                </div>
                <div style="width: 20%">
                  <span>{{ formatDate(item.appointmentStartTime) }}</span>
                </div>
                <div style="width: 15%">
                  <span>{{ getStatusText(item.orderStatus) }}</span>
                </div>
                <div style="width: 15%; margin-right: 0">
                  <n-button @click="$router.push(`/order/detail/${item.id}`)" :disabled="item.orderStatus < 3">查看详情</n-button>
                </div>
              </div>
            </div>
          </n-layout>
          <div class="empty-body" v-if="data.length == 0">
            <div class="content">
              <NImage src="/image/empty.svg" preview-disabled />
              <span style="margin-top: 40px">暂无订单</span>
            </div>
          </div>
        </n-layout>
        <n-pagination class="pagination" v-model:page="queryParams.pageNo" v-model:page-size="queryParams.pageSize" :item-count="total" @click="handleClick" />
      </div>
    </div>
  </n-spin>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, defineProps, watch } from 'vue';
  import { CopyOutline } from '@vicons/ionicons5';
  import * as orderApi from '@/api/order';
  import { formatDate } from '@/utils/time';
  import { copyOrderId } from '@/utils/tools';
  import type { orderVO } from '@/types/order';

  const props = defineProps({
    status: String,
  });
  watch(
    () => props.status,
    newValue => {
      queryParams.status = newValue;
      getData();
    }
  );
  const data = ref<orderVO[]>([]);

  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    status: props.status,
  });
  const loading = ref(false);
  const total = ref(0); // 列表的总数

  const handleClick = async () => {
    await getData();
  };

  const getStatusText = (status: any) => {
    switch (status) {
      case 0:
        return '待支付';
      case 1:
        return '待确认';
      case 2:
        return '待拍摄';
      case 3:
        return '已拍摄';
      case 4:
        return '待选图';
      case 5:
        return '修图中';
      case 6:
        return '待交付';
      case 7:
        return '待评价';
      case 100:
        return '已完成';
      case 10:
        return '订单已取消';
      case 20:
        return '退款中';
      case 30:
        return '退款成功';
      case 11:
        return '订单超时';
      default:
        return '未知状态';
    }
  };

  // 获取数据
  const getData = async () => {
    loading.value = true;
    try {
      let res = await orderApi.getUserOrders(queryParams);
      data.value = res.list;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await getData();
  });
</script>

/**备注：这边的表体每个单元的下部的高度是写死的170px */
<style scoped lang="scss">
  .table-wrap {
    background-color: #fff;
    padding: 20px 40px;
    .table-layout {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: calc(100vh - 190px);
      .data-table {
        width: 100%;
        header {
          display: flex;
          div {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            padding: 15px 10px;
            background-color: #fbf8ee;
            margin-right: 5px;
            border-radius: 3px 3px 0px 0px;
          }
        }

        &-body {
          overflow-y: auto; /* 初始状态下隐藏滚动条 */
          max-height: calc(100vh - 280px);
          .item {
            &:hover {
              background-color: #f5f7fa !important;
              transition: all 0.4s ease;
            }
            transition: all 0.4s ease;
            width: 100%;
            margin-top: 20px;
            .top {
              padding: 12px 20px;
              padding-right: 0;
              display: flex;
              align-items: center;
              height: 20px;
              width: calc(100% - 20px);
              background-color: #fafafc;
              color: #1f222580;
              .icon {
                &:hover {
                  cursor: pointer;
                  color: #142af3;
                  transition: all 0.5s ease;
                }
                transition: all 0.4s ease;
              }
            }
            .bottom {
              display: flex;
              width: 100%;
              > div {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 170px;
                margin-right: 5px;
                padding: 14px 0;
              }
              .info {
                box-sizing: border-box;
                padding: 14px 20px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                &-detail {
                  margin-top: 10px;
                  color: rgba(40, 40, 40, 0.5);
                  width: 100%;

                  &-row {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 4px;
                  }

                  &-title {
                    width: 100px;
                    flex-shrink: 0;
                  }

                  &-content {
                    flex: 1;
                    text-align: left;
                  }
                }
                .tag {
                  border-radius: 4px;
                  max-width: 60px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 2px 4px;
                  background-color: #f7eb9c;
                }
                .price {
                  margin-top: 10px;
                  font-size: 18px;
                }
              }
            }
          }
        }
      }
    }
  }

  .empty-body {
    display: flex;
    width: 100%;
    height: 80%;
    background-color: #fff;
    align-items: center;
    justify-content: center;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
</style>
