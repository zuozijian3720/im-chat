<template>
  <div bg="white" rd="2" mb="2" p="2">
    <share-message-view
      v-for="(msg, i) in messageList"
      :key="msg.id"
      :class="[i != 0 && 'mt-2']"
      :message="msg"
    ></share-message-view>
    <div flex justify-center mt-1 select-none text-gray-400 text-10px>
      IM-Chat
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessageNode } from "../../logic/TreeChat";
import ShareMessageView from "../message/ShareMessageView.vue";

defineProps<{
  messageList: MessageNode[];
}>();
</script>
