<template>
  <NButton v-if="isDev" strong secondary size="small" @click="showModal = true">
    NColors Menu
  </NButton>
  <NModal v-model:show="showModal" preset="card" title="NColors 预设" :style="{ width: '50%' }">
    <NGrid :cols="5" x-gap="1" y-gap="1">
      <NGridItem
        v-for="i in colors"
        :key="i.label"
        :style="{
          backgroundColor: i.value,
          fontSize: '12px',
          padding: '8px 5px',
          cursor: 'pointer'
        }"
        @click="onCopy(i.label)"
        >{{ i.label }} <br />
        {{ i.value }}</NGridItem
      >
    </NGrid>
  </NModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NModal, useThemeVars, NGrid, NGridItem } from 'naive-ui'
import { copyText } from '@/utils/tools'
import { Toast } from '@/utils/toast'
import { isDev } from '@/config'
const showModal = ref(false)
const vars = useThemeVars()
const colors = Object.keys(vars.value)
  .filter((i: string) => i.includes('olor'))
  // @ts-ignore
  .map((i: string) => ({ value: vars.value[i], label: i }))

const onCopy = async (text: string) => {
  await copyText(text)
  Toast.success('Color copied')
}
</script>
