<script lang="ts" setup>
import { injectTreeChat } from "chat-logic";
import { IonContent, IonInput, IonItem, IonPage } from "@ionic/vue";
import TitleBar from "../common/TitleBar.vue";

const chat = injectTreeChat();
</script>
<template>
  <ion-page>
    <TitleBar title="设置"> </TitleBar>
    <ion-content>
      <ion-item>
        <ion-input
          label="API Key"
          v-model="chat.config.value.apiKey"
        ></ion-input>
      </ion-item>
    </ion-content>
  </ion-page>
</template>
