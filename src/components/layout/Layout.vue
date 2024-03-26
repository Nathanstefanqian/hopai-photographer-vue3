<template>
  <NLayout class="layout-wrap" embedded>
    <NLayout has-sider class="layout-main" embedded>
      <Sider />
      <NLayout class="layout-content">
        <Header />
        <NLayoutContent
          :native-scrollbar="false"
          :content-style="{ padding: '20px 35px' }"
          embedded
        >
          <RouterView />
          <!-- <transition name="slide" mode="out-in">
              <component :is="Component" :key="$route.path"></component>
            </transition> -->
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NLayout, NLayoutContent, useMessage } from 'naive-ui'

import Sider from './Sider.vue'
import Header from './Header.vue'

window.$message = useMessage()
</script>

<style lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
