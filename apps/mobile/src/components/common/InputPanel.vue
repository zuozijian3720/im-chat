<template>
  <div
    shrink-0
    flex
    flex-col
    transition-all
    ref="containerRef"
    px-6
    py-2
    class="primary-bg"
    shadow
  >
    <div flex flex-col rd="1" bg="white" text-18px p-2>
      <div
        v-if="noAPIKey"
        @click="goSetting"
        flex
        items-center=""
        justify-center
      >
        点击去设置 API Key
      </div>
      <textarea
        v-else
        outline="none"
        b="none"
        p="0"
        :disabled="noAPIKey"
        rows="1"
        ref="inputRef"
        v-model.trim="text"
        autofocus
        width="100%"
        :placeholder="placeholder"
        @keydown.exact.enter.prevent="sendMessage"
        style="background-color: transparent; resize: none"
      ></textarea>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { injectTreeChat } from "chat-logic";
import { computed, ref } from "vue";
import { useIonRouter } from "@ionic/vue";

defineProps<{
  placeholder?: string;
}>();
const chat = injectTreeChat();
const text = ref<string>("");
const inputRef = ref<HTMLInputElement>();
const noAPIKey = computed(() => !chat.config.value.apiKey);
const messageChain = chat.messageChain;
const lastMessage = computed(
  () => messageChain.value[messageChain.value.length - 1]
);
const router = useIonRouter();
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
const goSetting = () => {
  router.push({
    path: "/setting",
  });
};
</script>
