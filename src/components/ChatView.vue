<template>
  <div bg="gray-200" flex flex-col overflow-hidden>
    <div flex-1 flex flex-col overflow-hidden>
      <div v-if="!isRoot" flex flex-col overflow-hidden flex-1>
        <div
          p-2
          shrink-0
          relative
          z-index="10"
          :class="[!scroll.arrivedState.top && 'title-bar-shadow']"
          transition
        >
          <n-switch v-model:value="currentMessage!.workModel">
            <template #checked> work 模式</template>
            <template #unchecked> chat 模式</template>
          </n-switch>
        </div>
        <div ref="scrollContainer" flex-1 overflow-y-scroll overflow-x-hidden>
          <div p-2>
            <div
              v-for="(chat, i) in afterList"
              :key="i"
              bg="white"
              rd="2"
              mb="2"
              p="2"
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
        </div>
      </div>
      <div flex-1 flex items-center justify-center v-else>
        <div w-90>
          <n-form-item label="APIKey">
            <n-input
              size="small"
              v-model:value="chat.config.value.apiKey"
              type="password"
              placeholder="输入 APIKey"
            ></n-input>
          </n-form-item>
        </div>
      </div>
    </div>
    <div
      shrink-0
      p-8px
      flex
      flex-col
      relative
      z-index="10"
      :class="[!isRoot && !scroll.arrivedState.bottom && 'title-bar-shadow']"
      transition-all
    >
      <n-space mb-2 flex>
        <n-select
          v-model:value="setting.model"
          w-40
          :options="modelOps"
          size="tiny"
        ></n-select>
        <n-input-number
          v-model:value="setting.temperature"
          w-26
          step="0.1"
          max="2"
          min="0"
          size="tiny"
        >
          <template #suffix>℃</template>
        </n-input-number>
        <n-button
          size="tiny"
          v-if="text && currentMessage && !currentMessage.workModel"
          @click="fork"
        >
          <span v-for="(icon, i) in '⌘⇧⏎'.split('')" :key="i" m-r="1px">{{
            icon
          }}</span>
          分叉
          <template #icon></template>
        </n-button>
      </n-space>
      <n-input
        :disabled="noAPIKey"
        ref="inputRef"
        v-model:value.trim="text"
        type="textarea"
        size="small"
        autofocus
        :resizable="false"
        width="100%"
        :autosize="{
          minRows: 2,
          maxRows: 15,
        }"
        :placeholder="noAPIKey ? '请先设置 APIKey' : '输入你想说的'"
        @blur="blur"
        @keydown="inputHotKey($event)"
      >
        <template v-if="text" #suffix><span m-r="1px">⏎</span>发送</template>
      </n-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { injectTreeChat, MessageNode } from "../logic/TreeChat";
import MessageView from "./MessageView.vue";
import { useScroll } from "@vueuse/core";
import { models } from "../utils/chatApi";
import isHotkey from "is-hotkey";
import ForkedMessage from "./ForkedMessage.vue";

const chat = injectTreeChat();
const text = ref<string>("");
const inputRef = ref<HTMLInputElement>();
const scrollContainer = ref<HTMLDivElement>();

const isRoot = computed(() => chat.current.value == null);
const scroll = useScroll(scrollContainer);
const noAPIKey = computed(() => !chat.config.value.apiKey);
const blur = () => {
  // setTimeout(() => {
  //   inputRef.value?.focus()
  // })
};
const CMD_SHIFT_ENTER = isHotkey("cmd+shift+enter");
const ENTER = isHotkey("enter");
const inputHotKey = (event: KeyboardEvent) => {
  if (CMD_SHIFT_ENTER(event)) {
    event.preventDefault();
    fork();
    return;
  }
  if (ENTER(event)) {
    event.preventDefault();
    sendMessage();
    return;
  }
};
const setting = computed(() => {
  const msg = chat.getCurrentMessage();
  if (!msg) {
    return chat.config.value;
  }
  return msg.setting;
});
const currentMessage = computed(() => {
  return chat.getCurrentMessage();
});
const afterList = computed(() => chat.getAfterChatList(chat.current.value));
const sendMessage = () => {
  if (!text.value) {
    return;
  }
  const current = chat.getCurrentMessage();
  if (!current) {
    //root
    const msg = chat.newMessage("user", text.value);
    const answer = chat.getAnswer(msg.id);
    chat.current.value = answer.id;
  } else if (current.workModel) {
    //work model
    const msg = chat.newMessage("user", text.value, { parent: current.id });
    chat.getAnswer(msg.id, chat.getSetting(current.id));
  } else {
    //chat model
    let lastMessage: MessageNode;
    const lastChat = afterList.value[afterList.value.length - 1];
    if (!lastChat) {
      lastMessage = current;
    } else {
      lastMessage = lastChat.messages[lastChat.messages.length - 1];
    }
    const msg = chat.newMessage("user", text.value, { parent: lastMessage.id });
    chat.getAnswer(msg.id, chat.getSetting(current.id));
  }
  text.value = "";
};
const fork = () => {
  const current = chat.getCurrentMessage();
  if (!current) {
    return;
  }
  const msg = chat.newMessage("user", text.value, { parent: current.id });
  chat.getAnswer(msg.id, chat.getSetting(current.id));
};
const modelOps = models.map((v) => ({ label: v, value: v }));
</script>

<style scoped lang="scss">
.title-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.bottom-bar-shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
</style>
