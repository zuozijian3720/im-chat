<template>
  <div flex flex-col class="primary-bg" overflow-hidden h-screen>
    <div flex items-center justify-between>
      <div></div>
      <div></div>
      <div>
        <div @click.prevent.stop="jumpToSetting">setting</div>
      </div>
    </div>
    <div overflow-y-scroll overflow-x-hidden flex-1 flex flex-col p-2>
      <ChatBlock
        :class="[i != 0 && 'mt-2']"
        v-for="(chat, i) in treeChat.historyList.value"
        :key="i"
        :chat="chat"
      />
    </div>
    <input-panel></input-panel>
  </div>
</template>

<script setup lang="ts">
import { injectTreeChat } from "chat-logic";
import ChatBlock from "./ChatBlock.vue";
import InputPanel from "../chat/InputPanel.vue";
import { useRouter } from "vue-router";

const treeChat = injectTreeChat();
const router = useRouter();
const jumpToSetting = () => {
  router.push({
    path: "/setting",
  });
};
</script>

<style scoped></style>
