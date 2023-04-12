<template>
  <ion-page>
    <TitleBar title="Chat 历史">
      <template #right>
        <GoSetting />
      </template>
    </TitleBar>
    <ion-content>
      <div flex flex-col h-full>
        <div
          flex-col
          flex
          overflow-x-hidden
          overflow-y-scroll
          flex-1
          p-2
          class="primary-bg"
        >
          <ChatBlock
            :class="[i != 0 && 'mt-2']"
            v-for="(chat, i) in treeChat.historyList.value"
            :key="i"
            :chat="chat"
          />
        </div>
        <input-panel placeholder="开启新话题"></input-panel>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { injectTreeChat } from "chat-logic";
import ChatBlock from "./ChatBlock.vue";
import InputPanel from "../common/InputPanel.vue";
import { IonContent, IonPage, useIonRouter } from "@ionic/vue";
import TitleBar from "../common/TitleBar.vue";
import GoSetting from "../common/GoSetting.vue";

const treeChat = injectTreeChat();
const router = useIonRouter();
const jumpToSetting = () => {
  router.push({
    path: "/setting",
  });
};
</script>

<style scoped></style>
