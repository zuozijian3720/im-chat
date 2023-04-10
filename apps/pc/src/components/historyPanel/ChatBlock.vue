<template>
  <div
    ref="containerRef"
    b-1
    b-white
    b-solid
    hover="b-gray"
    transition-all
    bg-white
    relative
    p-2
    rd-2
    cursor="pointer"
    @click="clickChat(chat.messages[chat.messages.length - 1].id)"
    shadow
  >
    <share-message-view
      v-for="(msg, i) in chat.messages.slice(0, 4)"
      :key="msg.id"
      :class="[i != 0 && 'mt-2']"
      :message="msg"
      short
    ></share-message-view>
    <ForkedMessage :chat="chat" />
    <div
      :class="[!hover && 'invisible']"
      absolute
      style="right: 0; top: -4px"
      p-2
    >
      <ToolsBar :options="ops" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Chat, injectTreeChat } from "chat-logic";
import ShareMessageView from "../message/ShareMessageView.vue";
import ForkedMessage from "../message/ForkedMessage.vue";
import { ref } from "vue";
import ToolsBar, { ToolsBarOption } from "../ToolsBar.vue";
import { useElementHover } from "@vueuse/core";

const props = defineProps<{
  chat: Chat;
}>();
const ops: ToolsBarOption[] = [
  {
    icon: "i-ic-round-delete-outline",
    tips: "删除对话",
    size: "text-18px",
    onClick: () => {
      treeChat.deleteMessage(props.chat.messages[0].id);
    },
  },
];
const containerRef = ref<HTMLDivElement>();
const hover = useElementHover(containerRef);

const treeChat = injectTreeChat();
const clickChat = (id: string) => {
  treeChat.current.value = id;
};
</script>
