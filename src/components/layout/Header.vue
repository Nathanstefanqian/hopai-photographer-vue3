<template>
  <NLayoutHeader bordered>
    <NSpace class="layout-header" justify="space-between" align="center">
      <NSpace align="center">
        <h1 class="layout-header-logo" @click="router.push('/main')">
          <NImage round src="/image/hopai.jpg" preview-disabled />
          {{ SystemName }}
        </h1>
      </NSpace>
      <NSpace align="center">
        <NSwitch :default-value="!!isDark" @click="toggleTheme">
          <template #checked-icon>
            <MyIcon name="Moon" />
          </template>
          <template #unchecked-icon>
            <MyIcon name="Sunny" />
          </template>
        </NSwitch>
        <NColors />
        <NAvatar size="small" @click="$router.push('/login')" bordered round src="/image/boy.jpg" />
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { NLayoutHeader, NSpace, NImage, NSwitch, NAvatar } from 'naive-ui'

import NColors from '@@/core/NColors.vue'
import MyIcon from '@@/core/MyIcon'

import { SystemName } from '@/config'

import { useTheme } from '@/hooks/useTheme'

import { router } from '@/router'

const { toggleTheme, isDark } = useTheme()
</script>
