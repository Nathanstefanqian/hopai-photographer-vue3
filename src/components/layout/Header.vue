<template>
  <NLayoutHeader bordered style="display: flex">
    <NBreadcrumb style="margin-left: 20px">
      <NBreadcrumbItem v-for="(item, index) in list" :key="index" :href="item.path">
        {{ item.name }}
      </NBreadcrumbItem>
    </NBreadcrumb>
    <span style="margin-left: auto">哈喽， {{ nickname }}</span>
    <n-popconfirm @positive-click="unLogin">
      <template #trigger>
        <NAvatar
          size="medium"
          bordered
          round
          :src="avatar"
          object-fit="cover"
          style="margin-left: 20px; margin-right: 20px"
        />
      </template>
      退出登录？
    </n-popconfirm>
  </NLayoutHeader>
</template>
<script setup lang="ts">
import { NLayoutHeader, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCache, CACHE_KEY } from '@/hooks/useCache'
const route = useRoute()
const list = computed(() => {
  let list: any[] = []
  route.matched.forEach((item) => {
    if (item.name) list.push({ name: item.name, path: item.path })
  })
  return list
})
const router = useRouter()

const { wsCache } = useCache()
const user = wsCache.get(CACHE_KEY.USER)
const avatar = user.avatar
const nickname = user.nickname

const unLogin = () => {
  router.push('/login')
  wsCache.clear()
  window.$message.success('退出成功')
}
</script>

<style scoped>
.n-layout-header {
  display: flex;
  align-items: center;
  padding: 5px;
  height: 50px;
}
</style>
