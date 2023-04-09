<template>
  <div flex flex-col bg="gray-200" overflow-hidden h-full>
    <div overflow-y-scroll overflow-x-hidden flex-1 flex flex-col p-2>
      <div
        v-for="(chat, i) in treeChat.rootList.value"
        :key="i"
        b-1
        b-white
        b-solid
        hover="b-gray"
        transition-all
        bg-white
        p-2
        rd-2
        cursor="pointer"
        :class="[i != 0 && 'mt-2']"
        @click="clickChat(chat.messages[chat.messages.length - 1].id)"
      >
        <share-message-view
          v-for="(msg, i) in chat.messages.slice(0, 4)"
          :key="msg.id"
          :class="[i != 0 && 'mt-2']"
          :message="msg"
          short
        ></share-message-view>
        <ForkedMessage :chat="chat" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectTreeChat } from "../logic/TreeChat";
import ForkedMessage from "./message/ForkedMessage.vue";
import ShareMessageView from "./message/ShareMessageView.vue";
import { useElementHover } from "@vueuse/core";

const treeChat = injectTreeChat();
useElementHover();
const clickChat = (id: string) => {
  treeChat.current.value = id;
};
</script>

<style scoped></style>
