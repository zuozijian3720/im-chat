<template>
  <div flex w-screen h-screen>
    <div w="50%">
      <RootView v-if="isRoot"></RootView>
      <BeforeView v-else></BeforeView>
    </div>
    <AfterView w="50%"></AfterView>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import RootView from "./components/RootView.vue";
import BeforeView from "./components/PromptView.vue";
import AfterView from "./components/ChatView.vue";
import { provideTreeChat } from "./logic/TreeChat";

const chat = provideTreeChat();
const isRoot = computed(() => {
  return chat.current.value == null;
});
</script>

<style scoped></style>
