<template>
  <NGlobalStyle />
</template>
<script setup lang="ts">
import { useMessage, useDialog, NGlobalStyle } from 'naive-ui'

window.$message = useMessage()
window.$dialog = useDialog()
</script>
