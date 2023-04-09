<script setup lang="ts">
import { computed, h, ref } from "vue";
import { injectTreeChat, MessageNode } from "../logic/TreeChat";
import MessageView from "./message/MessageView.vue";
import { useScroll } from "@vueuse/core";
import {
  models,
  modelsColor,
  temperatureColors,
  temperatureMarks,
} from "../utils/chatApi";
import isHotkey from "is-hotkey";
import ForkedMessage from "./message/ForkedMessage.vue";

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
  } else if (current.workMode) {
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
  text.value = "";
};
const modelOps = models.map((v) => ({
  label: () =>
    h("span", { style: `color:${modelsColor[v]}` }, [v.toUpperCase()]),
  key: v,
}));
</script>
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
          flex
          justify-center
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
      <div flex-1 flex flex-col items-center justify-center v-else>
        <div
          text-120px
          font-bold
          text-gray
          flex
          justify-center
          whitespace="nowrap"
          style="
            color: transparent;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
            background-color: #afafaf;
            -webkit-background-clip: text;
            background-clip: text;
          "
        >
          IM Chat
        </div>
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
      p-6px
      flex
      flex-col
      relative
      z-index="10"
      :class="[!isRoot && !scroll.arrivedState.bottom && 'title-bar-shadow']"
      transition-all
    >
      <div mb-1 flex>
        <n-dropdown
          @select="(v) => (setting.model = v)"
          trigger="click"
          :options="modelOps"
          size="small"
        >
          <div
            text-12px
            cursor="pointer"
            hover="bg-white"
            transition
            px-2
            rd-1
            :style="`color:${modelsColor[setting.model]}`"
          >
            {{ setting.model?.toUpperCase() }}
          </div>
        </n-dropdown>
        <n-popover trigger="click" :show-arrow="false">
          <template #trigger>
            <div
              text-12px
              cursor="pointer"
              hover="bg-white"
              transition
              px-2
              rd-1
              :style="`color:${temperatureColors[setting.temperature * 10]}`"
            >
              {{ setting.temperature?.toString() }}℃
              {{ temperatureMarks[setting.temperature] }}
            </div>
          </template>
          <n-slider
            autofocus
            v-model:value="setting.temperature"
            :marks="temperatureMarks"
            :min="0"
            :max="2"
            :step="0.1"
            style="width: 300px"
            :format-tooltip="(v) => `${v}℃`"
          >
          </n-slider>
        </n-popover>
      </div>
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
          minRows: 3,
          maxRows: 15,
        }"
        :placeholder="noAPIKey ? '请先设置 APIKey' : '你好！'"
        @blur="blur"
        @keydown="inputHotKey($event)"
        style="background-color: transparent"
      >
        <template v-if="text" #suffix>
          <div flex flex-col items-end text-gray-400>
            <div
              cursor="pointer"
              hover="bg-gray-200"
              transition
              @click="sendMessage()"
              p-1
              rd-1
              h="1.8em"
              flex
              items-center
              justify-center
            >
              <span mr-1 rd-2px b-1px p-x-2px b-gray-300>⏎</span>发送
            </div>
            <div
              v-if="text && currentMessage && !currentMessage.workMode"
              @click="fork"
              cursor="pointer"
              hover="bg-gray-200"
              transition
              p-1
              rd-1
              h="1.8em"
              flex
              items-center
              justify-center
            >
              <span rd-2px b-1px p-x-1px b-gray-300 mr-1>
                <span v-for="(icon, i) in '⌘⇧⏎'.split('')" :key="i" m-r="1px">{{
                  icon
                }}</span> </span
              >分叉
            </div>
          </div>
        </template>
      </n-input>
    </div>
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
