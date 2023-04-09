<script setup lang="ts">
import { h, onMounted, ref, watch } from "vue";
import { useElementHover } from "@vueuse/core";
import { injectTreeChat, MessageNode } from "../../logic/TreeChat";
import { useDialog } from "naive-ui";
import ShareLink from "../share/ShareLink.vue";
import InfoBox from "./InfoBox.vue";
import ToolsBar, { ToolsBarOption } from "../ToolsBar.vue";

const props = defineProps<{
  message: MessageNode;
  short?: boolean;
}>();
const container = ref<HTMLDivElement>();
const hover = useElementHover(container);
const chat = injectTreeChat();
const dialog = useDialog();
const ops = [
  {
    icon: "i-ph-share-network-light",
    tips: "分享",
    size: "text-18px",
    onClick: async () => {
      dialog.create({
        style: "width:max-content",
        class: "bg-gray-100",
        title: "分享",
        icon: () => h("div", { class: "i-ph-share-network-light" }),
        content: () => h(ShareLink, { message: props.message }),
      });
    },
  },
  {
    icon: "i-ph-star-light",
    tips: "收藏成 prompt",
    size: "text-18px",
    onClick: () => {
      dialog.info({
        title: "未实现",
      });
      console.log(props.message.gptInfo);
    },
  },
  {
    icon: "i-ph-git-fork",
    tips: "从这里分叉",
    size: "text-18px",
    onClick: () => {
      chat.current.value = props.message.id;
    },
  },
  {
    icon: "i-teenyicons-bulb-on-outline",
    tips: "生成回答",
    size: "text-16px",
    onClick: () => {
      chat.getAnswer(props.message.id);
    },
  },
  {
    icon: "i-ph-trash",
    tips: "删除消息",
    size: "text-18px",
    onClick: () => {
      if (props.message.children.length > 0) {
        dialog.warning({
          title: "删除消息",
          content: "删除消息会删除所有子消息，是否继续？",
          positiveText: "继续",
          negativeText: "取消",
          onPositiveClick() {
            chat.deleteMessage(props.message.id);
          },
        });
      } else {
        chat.deleteMessage(props.message.id);
      }
    },
  },
];
onMounted(() => {
  if (props.message.isNew) {
    // eslint-disable-next-line vue/no-mutating-props
    props.message.isNew = false;
    container.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
const abort = () => {
  props.message.abort?.abort?.();
  props.message.abort = undefined;
};
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
      <div
        :class="[!hover && 'invisible']"
        ref="toolsRef"
        absolute
        style="right: 0; top: -24px"
        p-2
      >
        <ToolsBar :options="ops" />
      </div>
      <div text-12px>
        <n-button
          float-left
          type="error"
          size="tiny"
          mr-2
          v-if="message.abort"
          @click="abort()"
        >
          {{ message.message.content ? "闭嘴" : "取消" }}
        </n-button>
        <div v-if="short" whitespace="nowrap" text-ellipsis overflow-hidden>
          {{ message.message.content }}
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
