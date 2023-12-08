<template>
  <NSpace>
    <NCard
      v-for="(item, index) in [1, 2, 3]"
      :key="index"
      hoverable
      @click="$router.push('/main/order/detail')"
    >
      <NSpace align="center">
        <span>520白沙湖婚纱摄影</span>
        <span>hp001020001</span>
        <NTag type="warning">待传片</NTag>
      </NSpace>
      <NSpace>
        <span>李先生</span>
        <span>130****7888</span>
        <span>￥ 899</span>
      </NSpace>
      <NSpace>
        <span>苏州市吴中区白沙湖街道白沙湖景区</span>
      </NSpace>
      <NSpace align="center" justify="space-between">
        <span>2022-12-12 12:30</span>
        <NButton>点击查看</NButton>
      </NSpace>
    </NCard>
  </NSpace>
</template>
<script setup lang="ts">
import { NCard, NSpace, NButton, NTag } from 'naive-ui'
</script>
