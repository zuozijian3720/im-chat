<template>
  <div flex flex-col class="primary-bg" overflow-hidden h-full>
    <div flex justify-center p2>
      <div font-bold select-none>Chat 记录</div>
    </div>
    <div overflow-y-scroll overflow-x-hidden flex-1 flex flex-col p-2>
      <ChatBlock
        :class="[i != 0 && 'mt-2']"
        v-for="(chat, i) in treeChat.historyList.value"
        :key="i"
        :chat="chat"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectTreeChat } from "chat-logic";
import ChatBlock from "./ChatBlock.vue";

const treeChat = injectTreeChat();
</script>

<style scoped></style>
