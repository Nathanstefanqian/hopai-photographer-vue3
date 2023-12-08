<template>
  <NLayoutHeader bordered>
    <NButton @click="$router.go(-1)">
      <template #icon>
        <n-icon>
          <back-icon></back-icon>
        </n-icon>
      </template>
    </NButton>
    <NBreadcrumb style="margin-left: 20px">
      <NBreadcrumbItem v-for="(item, index) in list" :key="index" :href="item.path"
        >{{ item.name }}
      </NBreadcrumbItem>
    </NBreadcrumb>
  </NLayoutHeader>
</template>
<script setup lang="ts">
import { ArrowBack as BackIcon } from '@vicons/ionicons5'
import { NLayoutHeader, NButton, NIcon, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const list = computed(() => {
  let list: any[] = []
  route.matched.forEach((item) => {
    if (item.name) list.push({ name: item.name, path: item.path })
  })
  return list
})
</script>

<style scoped>
.n-layout-header {
  display: flex;
  align-items: center;
  padding: 5px;
}
</style>
