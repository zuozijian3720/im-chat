<script lang="ts" setup>
import { injectTreeChat } from "chat-logic";

const chat = injectTreeChat();
</script>
<template>
  <div h-screen flex flex-col p-4>
    <div>API Key</div>
    <div>
      <input w-full v-model="chat.config.value.apiKey" type="text" />
    </div>
  </div>
</template>
