<template>
  <div shrink-0 p-6px flex flex-col transition-all ref="containerRef">
    <textarea
      :disabled="noAPIKey"
      ref="inputRef"
      v-model.trim="text"
      autofocus
      width="100%"
      :placeholder="noAPIKey ? '请先设置 APIKey' : '你好！'"
      @keydown.exact.enter.prevent="sendMessage"
      style="background-color: transparent"
    ></textarea>
  </div>
</template>
<script lang="ts" setup>
import { injectTreeChat } from "chat-logic";
import { computed, ref } from "vue";

const chat = injectTreeChat();
const text = ref<string>("");
const inputRef = ref<HTMLInputElement>();
const noAPIKey = computed(() => !chat.config.value.apiKey);
const messageChain = chat.messageChain;
const lastMessage = computed(
  () => messageChain.value[messageChain.value.length - 1]
);
const sendMessage = () => {
  if (!text.value) {
    return;
  }
  const current = chat.currentMessage.value;
  if (!current) {
    return;
  }
  //chat model
  const lastMessage = messageChain.value[messageChain.value.length - 1];
  const msg = chat.newMessage("user", text.value, { parent: lastMessage.id });
  chat.getAnswer(msg.id, chat.getSetting(current.id));
  text.value = "";
};
const containerRef = ref<HTMLDivElement>();
const abort = () => {
  lastMessage.value.abort?.abort?.();
  lastMessage.value.abort = undefined;
};
</script>
