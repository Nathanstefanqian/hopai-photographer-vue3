<template>
  <div class="tabs">
    <button class="tab" :class="{ 'tab-active': state == 3 }" @click="() => (state = 3)"> 上传底图 </button>
    <button class="tab" :class="{ 'tab-active': state == 4 }" @click="() => (state = 4)"> 精修选图 </button>
    <button class="tab" :class="{ 'tab-active': state == 5 }" @click="() => (state = 5)"> 上传精修图 </button>
    <button class="tab" :class="{ 'tab-active': state == 6 }" @click="() => (state = 6)"> 等待交付 </button>
    <button class="tab" :class="{ 'tab-active': state == 100 }" @click="() => (state = 100)"> 已完成 </button>
    <button class="tab" :class="{ 'tab-active': state == 1000 }" @click="() => (state = 1000)"> 全部订单 </button>
  </div>
  <DataTable :status="state" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  const state = ref(0);
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
