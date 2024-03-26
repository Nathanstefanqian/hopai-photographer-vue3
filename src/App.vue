<template>
  <NConfigProvider
    abstract
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider>
      <NDialogProvider>
        <NLoadingBarProvider>
          <RouterView />
          <GlobalSetting />
        </NLoadingBarProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  NConfigProvider,
  zhCN,
  dateZhCN,
  NMessageProvider,
  NDialogProvider,
  NLoadingBarProvider
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import GlobalSetting from '@@/core/GlobalSetting.vue'

// 配置主题色  diff
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#142AF3',
    primaryColorHover: '#142AF3'
  },
  Button: {
    textColor: '#142AF3'
  }
}
</script>
