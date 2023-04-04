<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  url: string;
}>();
const { copy, copied, isSupported } = useClipboard();
</script>

<template>
  <div flex items-center justify-center h-24>
    <n-space v-if="url" vertical justify="center" whitespace="nowrap">
      <a :href="url" target="_blank">
        {{ url }}
      </a>
      <div v-if="isSupported" ml-2 flex items-center justify-center>
        <n-button size="tiny" disabled v-if="copied"> 复制成功 </n-button>
        <n-button size="tiny" v-else @click="copy"> 点击复制 </n-button>
      </div>
    </n-space>
    <n-spin v-else />
  </div>
</template>
