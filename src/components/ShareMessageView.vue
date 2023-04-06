<script setup lang="ts">
import { MessageNode } from "../logic/TreeChat";
import { computed } from "vue";

const props = defineProps<{
  message: MessageNode;
}>();
const messageBorderStyle = computed(() => {
  return props.message.message.role === "user"
    ? "backgroundColor:rgb(74, 74, 74);color:rgb(253, 253, 253);"
    : "border:1px dashed rgb(243, 244, 246);";
});
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
  if (props.message.children.length) {
    infoList.push(`⑁${props.message.children.length}`);
  }
  return infoList.join(" ");
});
</script>
<template>
  <div style="display: flex; width: 100%; position: relative">
    <div
      style="
        padding: 4px 8px;
        border-radius: 4px;
        max-width: 100%;
        height: max-content;
        position: relative;
      "
      :style="messageBorderStyle"
    >
      <span
        v-if="message.gptInfo"
        style="
          top: -7px;
          user-select: none;
          position: relative;
          height: 4px;
          font-size: 10px;
          color: rgb(156, 163, 175);
          display: flex;
          align-items: center;
          background-color: white;
          width: max-content;
        "
        >{{ title }}</span
      >
      <div style="font-size: 12px">
        <span style="white-space: pre-wrap"
          >{{ message.message.content
          }}<span style="display: inline-block; height: 1em"></span
        ></span>
      </div>
    </div>
  </div>
</template>
