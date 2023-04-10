<script lang="ts" setup>
import { provideTreeChat } from "chat-logic";

const chat = provideTreeChat();
</script>
<template>
  <router-view></router-view>
</template>
<style>
div {
  box-sizing: border-box;
}
</style>
