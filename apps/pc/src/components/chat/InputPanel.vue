<template>
  <div shrink-0 p-6px flex flex-col transition-all ref="containerRef">
    <div mb-1 flex>
      <n-dropdown
        @select="(v:GPTModel) => (setting.model = v)"
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
          font-bold
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
          :format-tooltip="(v:number) => `${v}℃`"
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
</template>
<script lang="ts" setup>
import {
  GPTModel,
  injectTreeChat,
  MessageNode,
  models,
  modelsColor,
  temperatureColors,
  temperatureMarks,
} from "chat-logic";
import { computed, h, ref, watch } from "vue";
import isHotkey from "is-hotkey";
import { useElementSize } from "@vueuse/core";
import { inputPanelHeight } from "../../utils/inputPanelHeight";

const chat = injectTreeChat();
const text = ref<string>("");
const inputRef = ref<HTMLInputElement>();
const noAPIKey = computed(() => !chat.config.value.apiKey);
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
    const lastChat =
      chat.currentChats.value[chat.currentChats.value.length - 1];
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
    h("span", { style: `color:${modelsColor[v]}`, class: "font-bold" }, [
      v.toUpperCase(),
    ]),
  key: v,
}));
const currentMessage = chat.currentMessage;
const containerRef = ref<HTMLDivElement>();
const size = useElementSize(containerRef);
watch(
  () => size.height.value,
  (height) => {
    inputPanelHeight.value = height;
  }
);
</script>
