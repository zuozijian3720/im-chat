<template>
  <div flex flex-col bg-gray-100 overflow-hidden h-full>
    <div flex justify-center p2>
      <div font-bold select-none>Chat 记录</div>
    </div>
    <div overflow-y-scroll overflow-x-hidden flex-1 flex flex-col p-2>
      <ChatBlock
        :class="[i != 0 && 'mt-2']"
        v-for="(chat, i) in treeChat.rootList.value"
        :key="i"
        :chat="chat"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectTreeChat } from "../../logic/TreeChat";
import ChatBlock from "./ChatBlock.vue";

const treeChat = injectTreeChat();
</script>

<style scoped></style>
