<script setup lang="ts">
import { MessageNode } from "chat-logic";
import InfoBox from "./InfoBox.vue";

const props = defineProps<{
  message: MessageNode;
  short?: boolean;
}>();
</script>
<template>
  <div
    class="flex"
    w-full
    relative
    :class="[message.message.role === 'assistant' && 'pt-1']"
  >
    <div
      py-1
      px-2
      rd-1
      max-w-full
      h="max"
      relative
      :class="[
        message.message.role === 'user'
          ? 'bg-dark-50 color-light-50'
          : 'b-dashed b-1 b-gray-200',
      ]"
    >
      <info-box :message="message" hide-fork-count></info-box>
      <div text-12px>
        <div v-if="short" ellipsis overflow-hidden>
          {{ message.message.content }}<span inline-block h="1em"></span>
        </div>
        <span v-else whitespace="pre-wrap"
          >{{ message.message.content }}<span inline-block h="1em"></span
        ></span>
      </div>
    </div>
  </div>
</template>
