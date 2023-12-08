<template>
  <n-data-table :columns="columns" :data="data" />
  <n-modal v-model:show="showModal">
    <NImage width="500" src="/image/hopai.jpg"> </NImage>
  </n-modal>
</template>

<script setup lang="ts">
import { NDataTable, NProgress, NButton, NSpace, NModal, NImage } from 'naive-ui'
import { h, ref } from 'vue'

const showModal = ref(false)
const columns = ref([
  {
    title: '序号',
    key: 'id'
  },
  {
    title: '图片名称',
    key: 'name'
  },
  {
    title: '下载进度',
    key: 'progress',
    width: '50%',
    render(row: any) {
      return h(NProgress, {
        percentage: row.progress
      })
    }
  },
  {
    title: '操作',
    key: 'operation',
    render() {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { onClick: () => (showModal.value = true) }, { default: () => '查看' }),
          h(NButton, { type: 'info' }, { default: () => '继续' }),
          h(NButton, { type: 'error' }, { default: () => '删除' })
        ]
      })
    }
  }
])

const data = ref([
  { id: '1', name: 'Task 1', progress: 30 },
  { id: '2', name: 'Task 2', progress: 50 },
  { id: '3', name: 'Task 3', progress: 70 }
])
</script>
