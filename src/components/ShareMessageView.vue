<script setup lang="ts">
import { MessageNode } from "../logic/TreeChat";
import { computed } from "vue";

const props = defineProps<{
  message: MessageNode;
}>();
const title = computed(() => {
  const gptInfo = props.message.gptInfo;
  if (!gptInfo) {
    return;
  }
  const infoList: string[] = [];
  if (gptInfo.model != null) {
    infoList.push(gptInfo.model);
  }
  if (gptInfo.temperature != null) {
    infoList.push(`${gptInfo.temperature}℃`);
  }
  if (gptInfo.totalTime != null) {
    infoList.push(`${(gptInfo.totalTime / 1000).toFixed(2)}s`);
  }
  return infoList.join(" ");
});
</script>
<template>
  <div
    class="flex"
    w-full
    relative
    :class="[message.message.role === 'assistant' && 'pt-1']"
  >
    <div
      py-1
      px-2
      rd-1
      max-w-full
      h="max"
      relative
      :class="[
        message.message.role === 'user'
          ? 'bg-dark-50 color-light-50'
          : 'b-dashed b-1 b-gray-100',
      ]"
    >
      <span
        v-if="message.gptInfo"
        select-none
        relative
        h-1
        style="top: -7px"
        text-2.5
        text-gray-400
        flex
        items-center
        bg-white
        w-max
        >{{ title }}</span
      >
      <div text-12px>
        <span whitespace="pre-wrap"
          >{{ message.message.content }}<span inline-block h="1em"></span
        ></span>
      </div>
    </div>
  </div>
</template>
