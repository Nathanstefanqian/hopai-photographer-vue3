<template>
  <NLayout class="layout-wrap" embedded>
    <Header />
    <NLayout has-sider class="layout-main" embedded>
      <Menu></Menu>
      <NLayout class="layout-content">
        <BreadHeader></BreadHeader>
        <NLayoutContent :native-scrollbar="false" :content-style="{ padding: '20px' }" embedded>
          <RouterView v-slot="{ Component }">
            <transition name="slide" mode="out-in">
              <component :is="Component" :key="$route.path"></component>
            </transition>
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NLayout, NLayoutContent } from 'naive-ui'

import Header from './Header.vue'
import Menu from './Menu.vue'
import BreadHeader from './BreadHeader.vue'
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
