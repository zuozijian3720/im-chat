<template>
  <div flex-1 flex flex-col items-center justify-center>
    <div
      text-120px
      font-bold
      text-gray
      select-none
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
    <div w-120>
      <n-input
        size="small"
        v-model:value="chat.config.value.apiKey"
        :type="showKey ? 'text' : 'password'"
        placeholder=""
        style="background-color: transparent"
      >
        <template #prefix>
          <div text-gray mr-1>API Key</div>
        </template>
        <template #suffix>
          <div
            @click="showKey = !showKey"
            text-18px
            cursor="pointer"
            :class="showKey ? 'i-mdi-eye-outline' : 'i-mdi-eye-off-outline'"
          ></div>
        </template>
      </n-input>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { injectTreeChat } from "chat-logic";
import { ref } from "vue";

const chat = injectTreeChat();
const showKey = ref(false);
</script>
