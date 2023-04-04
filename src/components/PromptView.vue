<template>
  <div h-full flex flex-col>
    <div shrink-0 p-2>
      <n-button round size="tiny" @click="chat.current.value = undefined">
        <template #icon>
          <div class="i-material-symbols-arrow-back-rounded"></div>
        </template>
        主页
      </n-button>
    </div>
    <div flex-1 overflow-y-scroll overflow-x-hidden>
      <div p-2>
        <message-view
          :class="[i != 0 && 'mt-2']"
          v-for="(msg, i) in beforeList"
          :key="msg.id"
          :message="msg"
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
const beforeList = computed(() => {
  if (chat.current.value) {
    return chat.getBeforeChat(chat.current.value);
  }
});
</script>

<style scoped></style>
