<script lang="ts" setup>
import { provideTreeChat } from "chat-logic";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
const chat = provideTreeChat();
</script>
<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
<style></style>
