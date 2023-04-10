<script setup lang="ts">
import { computed, ref } from "vue";
import { injectTreeChat } from "chat-logic";
import MessageView from "../message/MessageView.vue";
import ForkedMessage from "../message/ForkedMessage.vue";
import MainPanel from "../MainPanel.vue";
import InputPanel from "./InputPanel.vue";
import { inputPanelHeight } from "../../utils/inputPanelHeight";

const chat = injectTreeChat();
const scrollContainer = ref<HTMLDivElement>();

const isRoot = computed(() => chat.current.value == null);

const currentMessage = computed(() => {
  return chat.getCurrentMessage();
});
const afterList = computed(() => chat.getAfterChatList(chat.current.value));
</script>
<template>
  <div class="primary-bg" flex flex-col overflow-hidden relative>
    <div v-if="!isRoot" flex flex-col overflow-hidden flex-1 relative>
      <div
        p-2
        z="1"
        h="38px"
        flex
        justify-center
        absolute
        w="100%"
        class="primary-bg-blur"
      >
        <n-switch size="medium" v-model:value="currentMessage!.workMode">
          <template #checked>
            <n-tooltip>
              <template #trigger> Work</template>
              工作模式，每一次提问都会从 Prompt 创建分叉
            </n-tooltip>
          </template>
          <template #unchecked>
            <n-tooltip>
              <template #trigger> Chat</template>
              对话模式，在一个话题下进行多轮对话
            </n-tooltip>
          </template>
        </n-switch>
      </div>
      <div ref="scrollContainer" flex-1 overflow-y-scroll overflow-x-hidden>
        <div h-38px></div>
        <div p-2>
          <div
            v-for="(chat, i) in afterList"
            :key="i"
            bg="white"
            rd="2"
            mb="2"
            p="2"
            shadow
          >
            <message-view
              v-for="(msg, i) in chat.messages"
              :key="msg.id"
              :class="[i != 0 && 'mt-2']"
              :message="msg"
            ></message-view>
            <ForkedMessage :chat="chat" />
          </div>
        </div>
        <div :style="`height:${inputPanelHeight}px`"></div>
      </div>
    </div>
    <MainPanel v-else />
    <InputPanel absolute w="100%" bottom-0 class="primary-bg-blur" />
  </div>
</template>

<style scoped lang="scss">
.title-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.bottom-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
</style>
