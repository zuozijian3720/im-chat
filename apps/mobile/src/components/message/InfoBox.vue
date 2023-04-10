<script lang="ts" setup>
import { MessageNode } from "chat-logic";
import { computed, toRaw } from "vue";
import { modelsColor, temperatureColors } from "chat-logic";

const props = defineProps<{
  message: MessageNode;
  hideForkCount?: boolean;
  colorful?: boolean;
}>();
const gptInfo = computed(() => props.message.gptInfo);
const showInfo = () => {
  console.log(toRaw(props.message.gptInfo));
};
</script>
<template>
  <div
    v-if="message.gptInfo"
    select-none
    relative
    style="top: -7px"
    text-2.5
    bg-white
    w-max
    @click="showInfo"
    h-1
    px="4px"
  >
    <span class="box" h-1 w-max flex items-center style="opacity: 0.3">
      <span
        v-if="gptInfo?.model"
        :style="colorful ? `color:${modelsColor[gptInfo.model]}` : undefined"
        >{{ gptInfo?.model.toUpperCase() }}</span
      >
      <span
        v-if="gptInfo?.temperature != null"
        :style="
          colorful
            ? `color:${temperatureColors[gptInfo.temperature]}`
            : undefined
        "
        >{{ gptInfo?.temperature.toString() }}℃</span
      >
      <span v-if="gptInfo?.totalTime"
        >{{ (gptInfo?.totalTime / 1000).toFixed(2) }}s</span
      >
      <span v-if="!hideForkCount && message.children.length > 1"
        ><span text-12px>⑁</span>{{ message.children.length }}</span
      >
    </span>
  </div>
</template>
<style lang="scss" scoped>
.box {
  span:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
