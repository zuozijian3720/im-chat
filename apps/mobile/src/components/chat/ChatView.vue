<script setup lang="ts">
import { ref, toRaw } from "vue";
import { injectTreeChat } from "chat-logic";
import MessageView from "../message/MessageView.vue";
import InputPanel from "./InputPanel.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.query.id;
const chat = injectTreeChat();
if (id && typeof id === "string") {
  chat.current.value = id;
}
const scrollContainer = ref<HTMLDivElement>();

const messageChain = chat.messageChain;
</script>
<template>
  <div flex flex-col overflow-hidden relative h-screen>
    <div ref="scrollContainer" flex-1 overflow-y-scroll overflow-x-hidden>
      <div p-2>
        <message-view
          v-for="(msg, i) in messageChain"
          :key="msg.id"
          :class="[i != 0 && 'mt-2']"
          :message="msg"
        ></message-view>
      </div>
    </div>
    <InputPanel w="100%" bottom-0 class="primary-bg-blur" />
  </div>
</template>

<style scoped lang="scss">
.title-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.bottom-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
</style>
