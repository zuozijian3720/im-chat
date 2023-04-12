<script setup lang="ts">
import { onMounted, ref } from "vue";
import { onClickOutside, onLongPress, useElementHover } from "@vueuse/core";
import { injectTreeChat, MessageNode } from "chat-logic";
import InfoBox from "./InfoBox.vue";
import { Clipboard } from "@capacitor/clipboard";
import { toastController, useIonRouter } from "@ionic/vue";

const router = useIonRouter();
const writeToClipboard = async () => {
  await Clipboard.write({
    string: props.message.message.content,
  });
  const toast = await toastController.create({
    message: "复制成功",
    position: "top",
    duration: 1000,
  });
  await toast.present();
};
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
const showToolsBox = ref<{ x: number; y: number }>();
const toolsBoxRef = ref<HTMLDivElement>();
onLongPress(container, (evt) => {
  showToolsBox.value = {
    x: evt.x,
    y: evt.y,
  };
  // if (container.value) {
  //   const selection = getSelection();
  //   selection.removeAllRanges();
  //   const range = new Range();
  //   range.selectNodeContents(container.value);
  //   selection.addRange(range);
  // }
});

onClickOutside(toolsBoxRef, () => {
  showToolsBox.value = undefined;
});
const tools = (
  [
    {
      name: "复制",
      click: () => {
        writeToClipboard();
      },
    },
    {
      name: "分享",
      click: async () => {
        router.push({
          path: "/share",
          query: {
            id: props.message.id,
          },
        });
      },
    },
    {
      name: "删除",
      click: async () => {
        const toast = await toastController.create({
          message: "功能未实现",
          position: "top",
          duration: 1000,
        });
        await toast.present();
      },
    },
  ] satisfies Array<{
    name: string;
    click: () => void;
  }>
).map((v) => ({
  ...v,
  click: () => {
    v.click();
    showToolsBox.value = undefined;
  },
}));
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
    <Teleport to="body">
      <div
        v-if="showToolsBox"
        :style="`left:${showToolsBox.x}px;top:${showToolsBox.y}px`"
        ref="toolsBoxRef"
        absolute
        shadow
        rd-1
        bg-white=""
      >
        <div
          v-for="(tool, i) in tools"
          :key="i"
          py-2
          px-4
          @click="tool.click()"
        >
          {{ tool.name }}
        </div>
      </div>
    </Teleport>
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
