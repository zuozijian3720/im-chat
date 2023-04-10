<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useElementHover } from "@vueuse/core";
import { injectTreeChat, MessageNode } from "chat-logic";
import InfoBox from "./InfoBox.vue";

const props = defineProps<{
  message: MessageNode;
  short?: boolean;
}>();
const container = ref<HTMLDivElement>();
const hover = useElementHover(container);
const chat = injectTreeChat();
onMounted(() => {
  if (props.message.isNew) {
    // eslint-disable-next-line vue/no-mutating-props
    props.message.isNew = false;
    container.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
const toolsRef = ref<HTMLDivElement>();
watch(hover, (hover) => {
  const ele = toolsRef.value;
  if (ele && hover) {
    if (ele.offsetLeft < 0) {
      ele.style.right = `-${ele.offsetWidth - 18}px`;
    }
  }
});
</script>
<template>
  <div
    class="flex"
    w-full
    relative
    :class="[message.message.role === 'assistant' && 'pt-1']"
  >
    <div
      ref="container"
      py-1
      px-2
      rd-1
      max-w-full
      h="max"
      relative
      :class="[
        message.message.role === 'user'
          ? 'bg-dark-50 color-light-50'
          : 'b-dashed b-1 b-gray-200',
      ]"
    >
      <info-box :message="message"></info-box>
      <div text-12px>
        <div v-if="short" whitespace="nowrap" text-ellipsis overflow-hidden>
          {{ message.message.content }}<span inline-block h="1em"></span>
        </div>
        <span v-else whitespace="pre-wrap"
          >{{ message.message.content }}<span inline-block h="1em"></span
        ></span>
        <span class="ping" v-if="message.abort" text-gray-300></span>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.ping::after {
  content: "";
  width: 3px;
  height: 1.6em;
  background: #b2b2b2;
  display: inline-block;
  vertical-align: bottom;
  position: relative;
  left: 3px;
}

.ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  0% {
    opacity: 1;
  }
  8% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
