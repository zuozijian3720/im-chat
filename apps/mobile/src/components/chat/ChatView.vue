<script setup lang="ts">
import { ref } from "vue";
import { injectTreeChat } from "chat-logic";
import MessageView from "../message/MessageView.vue";
import InputPanel from "./InputPanel.vue";
import { useRoute } from "vue-router";
import {
  IonContent,
  IonPage,
  onIonViewDidEnter,
  onIonViewWillLeave,
} from "@ionic/vue";
import TitleBar from "../common/TitleBar.vue";
import GoSetting from "../common/GoSetting.vue";

const route = useRoute();
const chat = injectTreeChat();
const scrollContainer = ref<HTMLDivElement>();
onIonViewDidEnter(() => {
  const id = route.query.id;
  if (id && typeof id === "string") {
    chat.current.value = id;
  }
});
onIonViewWillLeave(() => {
  chat.current.value = undefined;
});
const messageChain = chat.messageChain;
</script>
<template>
  <ion-page>
    <TitleBar title="Chat">
      <template #right>
        <GoSetting />
      </template>
    </TitleBar>
    <ion-content>
      <div flex flex-col overflow-hidden relative h-full>
        <div ref="scrollContainer" flex-1 overflow-y-scroll overflow-x-hidden>
          <div p-2>
            <message-view
              v-for="(msg, i) in messageChain"
              :key="msg.id"
              :class="[i != 0 && 'mt-2']"
              :message="msg"
            ></message-view>
          </div>
        </div>
        <InputPanel
          placeholder="你好！"
          w="100%"
          bottom-0
          class="primary-bg-blur"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.title-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.bottom-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
</style>
