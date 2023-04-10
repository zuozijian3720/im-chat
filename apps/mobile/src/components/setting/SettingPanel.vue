<script lang="ts" setup>
import { injectTreeChat } from "chat-logic";

const chat = injectTreeChat();
</script>
<template>
  <div h-screen>
    <div>API Key</div>
    <div>
      <input v-model="chat.config.value.apiKey" type="text" />
    </div>
  </div>
</template>
