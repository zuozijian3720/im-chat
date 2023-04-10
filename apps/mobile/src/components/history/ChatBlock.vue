<template>
  <div
    ref="containerRef"
    bg-white
    relative
    p-2
    rd-2
    @click="jumpTo(chat.messages[chat.messages.length - 1].id)"
    shadow
  >
    <share-message-view
      v-for="(msg, i) in chat.messages.slice(0, 4)"
      :key="msg.id"
      :class="[i != 0 && 'mt-2']"
      :message="msg"
      short
    ></share-message-view>
    <ForkedMessage :short="true" :chat="chat" />
  </div>
</template>
<script lang="ts" setup>
import { Chat, injectTreeChat } from "chat-logic";
import ShareMessageView from "../message/ShareMessageView.vue";
import ForkedMessage from "../message/ForkedMessage.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  chat: Chat;
}>();
const router = useRouter();
const jumpTo = (id: string) => {
  router.push({
    path: "/chat",
    query: {
      id,
    },
  });
};
const containerRef = ref<HTMLDivElement>();

const treeChat = injectTreeChat();
</script>
