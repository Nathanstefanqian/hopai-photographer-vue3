<template>
  <div class="tabs">
    <button class="tab" :class="{ 'tab-active': state == 0 }" @click="() => (state = 0)">
      进行中
    </button>
    <button class="tab" :class="{ 'tab-active': state == 1 }" @click="() => (state = 1)">
      已完成
    </button>
    <button class="tab" :class="{ 'tab-active': state == 2 }" @click="() => (state = 2)">
      全部订单
    </button>
  </div>
  <DataTable :status="state" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const state = ref(0)
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  margin-bottom: 20px;
}
.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 34px;
  background-color: #fafafc;
  border: 1px solid #e0e0e6;
  color: #000;
  transition: all 0.5s ease;
  &:hover {
    cursor: pointer;
    transition: all 0.5s ease;
    color: #142af3;
    border: 1px solid #142af3;
  }
}

.tab-active {
  color: #142af3;
  border: 1px solid #142af3;
}
</style>
