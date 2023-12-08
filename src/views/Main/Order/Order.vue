<template>
  <NLayout>
    <NLayout class="layout-self">
      <NTabs type="segment" animated>
        <NTabPane name="unfinished" tab="未完成">
          <Item></Item>
        </NTabPane>
        <NTabPane name="finished" tab="已完成">
          <Item></Item>
        </NTabPane>
      </NTabs>
    </NLayout>
    <NPagination v-model:page="page" :page-count="2" />
  </NLayout>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NLayout, NPagination } from 'naive-ui'
import { ref } from 'vue'
import Item from './Item.vue'
const page = ref(2)
</script>

<style scoped lang="scss">
.n-card {
  max-width: 500px;
}

.layout-self {
  height: calc(100vh - 180px) !important;
}

.n-pagination {
  display: flex;
  justify-content: center;
}
</style>
