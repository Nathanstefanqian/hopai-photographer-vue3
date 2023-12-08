<template>
  <div class="main-loading">
    <figure>
      <div class="dot white"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { useHome } from '@/hooks/useHome'
useHome()
</script>
