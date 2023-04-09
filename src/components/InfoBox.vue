<script lang="ts" setup>
import { MessageNode } from "../logic/TreeChat";
import { computed, toRaw } from "vue";
import { modelsColor, temperatureColors } from "../utils/chatApi";

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
    pl="2px"
  >
    <span h-1 w-max flex items-center style="opacity: 0.3">
      <span
        v-if="gptInfo?.model"
        :style="colorful && `color:${modelsColor[gptInfo.model]}`"
        mr-2
        >{{ gptInfo?.model.toUpperCase() }}</span
      >
      <span
        v-if="gptInfo?.temperature != null"
        :style="colorful && `color:${temperatureColors[gptInfo.temperature]}`"
        mr-2
        >{{ gptInfo?.temperature.toString() }}℃</span
      >
      <span v-if="gptInfo?.totalTime" mr-2
        >{{ (gptInfo?.totalTime / 1000).toFixed(2) }}s</span
      >
      <span v-if="!hideForkCount && message.children.length > 1" mr-2
        ><span text-12px>⑁</span>{{ message.children.length }}</span
      >
    </span>
  </div>
</template>
