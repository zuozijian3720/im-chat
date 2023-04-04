<template>
  <div flex flex-col bg="gray-200" overflow-hidden h-full>
    <div overflow-y-scroll overflow-x-hidden flex-1 flex flex-col p-2>
      <div
        v-for="(chat, i) in rootList"
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
        @click="clickChat(chat[chat.length - 1].id)"
      >
        <message-view
          v-for="(msg, i) in chat"
          :key="msg.id"
          :class="[i != 0 && 'mt-2']"
          :message="msg"
          short
        ></message-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectTreeChat } from "../logic/TreeChat";
import { computed } from "vue";
import MessageView from "./MessageView.vue";

const chat = injectTreeChat();
const rootList = computed(() => {
  return chat.getAfterChatList().map((v) => {
    return v.slice(0, 4);
  });
});
const clickChat = (id: string) => {
  console.log(id);
  chat.current.value = id;
};
</script>

<style scoped></style>
