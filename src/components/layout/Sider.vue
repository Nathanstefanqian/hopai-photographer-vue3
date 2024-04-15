<template>
  <NLayoutSider
    bordered
    collapse-mode="width"
    :collapsed="barCollapsed"
    :collapsed-width="60"
    :width="220"
    @collapse="toggleBarCollapsed"
    @expand="toggleBarCollapsed"
    :native-scrollbar="false"
  >
    <div class="logo">
      <NSpace align="center">
        <h1 class="layout-header-logo" @click="router.push('/order')" style="border-radius: 30px">
          <NImage src="/image/hopai.png" preview-disabled />
          {{ SystemName }}
        </h1>
      </NSpace>
    </div>
    <NMenu
      :collapsed="barCollapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </NLayoutSider>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { Component } from 'vue'
import { storeToRefs } from 'pinia'

import { NLayoutSider, NMenu, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { router } from '@/router'
import type { RouteLocationRaw } from 'vue-router'

import { ChatboxEllipsesOutline, LogoInstagram } from '@vicons/ionicons5'
import { SystemName } from '@/config'

import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()
const { barCollapsed } = storeToRefs(themeStore)
const { toggleBarCollapsed } = themeStore

const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const renderLabel = (to: RouteLocationRaw, label: string) => {
  return () => h(RouterLink, { to }, { default: () => label })
}
const menuOptions: MenuOption[] = [
  {
    label: renderLabel('/order', '订单中心'),
    key: 'order',
    icon: renderIcon(ChatboxEllipsesOutline)
  }
  //,
  // {
  //   label: renderLabel('/upload', '上传列表'),
  //   key: 'upload',
  //   icon: renderIcon(LogoInstagram)
  // }
]
// const collapsed = ref(false)
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}
</style>
