<template>
  <div shrink-0 p-4 flex flex-col transition-all ref="containerRef">
    <div flex flex-col shadow rd="1" bg="white" p-2>
      <textarea
        outline="none"
        b="none"
        p="0"
        :disabled="noAPIKey"
        rows="1"
        ref="inputRef"
        v-model.trim="text"
        autofocus
        width="100%"
        :placeholder="noAPIKey ? '请先设置 APIKey' : '你好！'"
        @keydown.exact.enter.prevent="sendMessage"
        style="background-color: transparent; resize: none"
      ></textarea>
    </div>
    <div style="height: env(safe-area-inset-bottom)"></div>
  </div>
</template>
<script lang="ts" setup>
import { injectTreeChat } from "chat-logic";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const chat = injectTreeChat();
const text = ref<string>("");
const inputRef = ref<HTMLInputElement>();
const noAPIKey = computed(() => !chat.config.value.apiKey);
const messageChain = chat.messageChain;
const lastMessage = computed(
  () => messageChain.value[messageChain.value.length - 1]
);
const router = useRouter();
const sendMessage = () => {
  if (!text.value) {
    return;
  }
  //chat model
  const lastMessage = messageChain.value[messageChain.value.length - 1];
  if (!lastMessage) {
    const msg = chat.newMessage("user", text.value);
    chat.getAnswer(msg.id);
    router.push({
      path: "chat",
      query: {
        id: msg.id,
      },
    });
  } else {
    const msg = chat.newMessage("user", text.value, { parent: lastMessage.id });
    chat.getAnswer(msg.id, lastMessage.setting);
  }
  text.value = "";
};
const containerRef = ref<HTMLDivElement>();
const abort = () => {
  lastMessage.value.abort?.abort?.();
  lastMessage.value.abort = undefined;
};
</script>
