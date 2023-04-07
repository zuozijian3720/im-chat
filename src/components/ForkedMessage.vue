<template>
  <div v-if="chat.lastFork" mt-2 relative>
    <message-view :message="chat.lastFork"></message-view>
    <n-tooltip placement="left">
      <template #trigger>
        <div
          select-none
          absolute
          b-dashed
          b-1
          w="16px"
          h="16px"
          text-gray-400
          rd="50%"
          flex=""
          items-center=""
          justify-center=""
          text="12px"
          bg="white"
          style="right: -4px; bottom: -4px"
        >
          {{ chat.forkCount }}
        </div>
      </template>
      共{{ chat.forkCount }}条分支
    </n-tooltip>
  </div>
</template>
<script lang="ts" setup>
import { Chat } from "../logic/TreeChat";
import MessageView from "./MessageView.vue";

defineProps<{ chat: Chat }>();
</script>
