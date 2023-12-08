<template>
  <NLayout>
    <NSpace vertical :size="50">
      <NCard title="精选图">
        <template #header-extra>
          <NButton>下载</NButton>
        </template>
        <NSpace :size="10">
          <NImage src="/image/hopai.jpg" width="100" />
          <NImage src="/image/hopai.jpg" width="100" />
          <NImage src="/image/hopai.jpg" width="100" />
        </NSpace>
      </NCard>
      <NCard title="原文件">
        <template #header-extra>
          <NButton>选择图片</NButton>
        </template>
        <NImage src="/image/hopai.jpg" width="100" />
      </NCard>
    </NSpace>
  </NLayout>
</template>
<script setup lang="ts"></script>
