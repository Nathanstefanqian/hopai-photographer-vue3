<template>
  <NLayoutSider
    bordered
    collapse-mode="width"
    :collapsed="barCollapsed"
    :collapsed-width="60"
    :width="220"
    show-trigger="arrow-circle"
    @collapse="toggleBarCollapsed"
    @expand="toggleBarCollapsed"
    :native-scrollbar="false"
  >
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
import type { RouteLocationRaw } from 'vue-router'

import { ChatboxEllipsesOutline, LogoInstagram } from '@vicons/ionicons5'

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
    label: renderLabel('/main/order', '订单选择'),
    key: 'order',
    icon: renderIcon(ChatboxEllipsesOutline)
  },
  {
    label: renderLabel('/main/upload', '上传列表'),
    key: 'upload',
    icon: renderIcon(LogoInstagram)
  }
]
// const collapsed = ref(false)
</script>
