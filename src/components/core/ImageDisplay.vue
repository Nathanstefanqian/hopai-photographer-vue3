<template>
  <div class="image" @mouseenter="isHovered = true" @mouseleave="isHovered = false && !showConfirm">
    <n-image
      class="image-block"
      width="120"
      height="160"
      object-fit="cover"
      :src="imageUrl"
      :preview-src="previewUrl"
      :lazy="lazy"
      :fallback-src="fallbackSrc"
      :preview-disabled="!previewSrcList.length"
      :preview-src-list="previewSrcList"
      :initial-index="index"
    >
      <template #placeholder>
        <div style="width: 120px; height: 160px; display: flex; align-items: center; justify-content: center; background-color: #0001"> Loading </div>
      </template>
    </n-image>
    <span class="pic-name">{{ picName }}</span>
    <n-popconfirm @positive-click="handleDelete" @update:show="show => (showConfirm = show)" v-if="showDelete && (isHovered || showConfirm)">
      <template #trigger>
        <div class="image-block-right">
          <n-icon><Trash /></n-icon>
        </div>
      </template>
      确认删除该照片嘛
    </n-popconfirm>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { Trash } from '@vicons/ionicons5';

  interface Props {
    picData: any;
    showDelete?: any;
    lazy?: boolean;
    index?: number;
    isTouch?: boolean;
    picList?: any;
  }

  const props = withDefaults(defineProps<Props>(), {
    showDelete: false,
    lazy: true,
    index: 0,
    isTouch: false,
    picList: [],
  });

  const previewSrcList = computed(() => {
    return props.picList?.length ? props.picList.map((item: any) => item.picUrl) : [];
  });

  const isHovered = ref(false);
  const showConfirm = ref(false);

  const emit = defineEmits(['delete']);

  const imageUrl = computed(() => {
    if (props.isTouch) {
      return props.picData.bigPicUrlMini;
    } else {
      return props.picData.picUrlMini;
    }
  });

  const previewUrl = computed(() => {
    return props.picData.picUrl || props.picData.bigPicUrl;
  });

  const picName = computed(() => props.picData.picName);

  const fallbackSrc = 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg';

  const handleDelete = () => {
    emit('delete', props.index, props.isTouch);
  };
</script>

<style scoped lang="scss">
  .image {
    position: relative;
    margin-bottom: 20px;
    margin-right: 20px;

    .image-block {
      border-radius: 4px;
    }

    .pic-name {
      display: block;
      margin-top: 8px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }

    .image-block-right {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      cursor: pointer;
      color: #fff;

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }
    }
  }
</style>
