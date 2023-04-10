<template>
  <div flex flex-col class="primary-bg" overflow-hidden h-screen>
    <div overflow-y-scroll overflow-x-hidden flex-1 flex flex-col p-2>
      <ChatBlock
        :class="[i != 0 && 'mt-2']"
        v-for="(chat, i) in treeChat.historyList.value"
        :key="i"
        :chat="chat"
      />
    </div>
    <input-panel></input-panel>
    <!--    <div @click="newChat" shadow m-2 flex items-center justify-center py-2 rd-1 bg-dark-50 text-white>-->
    <!--      新聊天-->
    <!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import { injectTreeChat } from "chat-logic";
import ChatBlock from "./ChatBlock.vue";
import InputPanel from "../chat/InputPanel.vue";

const treeChat = injectTreeChat();
</script>

<style scoped></style>
