<script setup lang="ts">
import { computed, h, onMounted, ref } from "vue";
import { useElementHover } from "@vueuse/core";
import { injectTreeChat, MessageNode } from "../logic/TreeChat";
import { NSpin, useDialog } from "naive-ui";
import axios from "axios";
import ShareLink from "./ShareLink.vue";

const props = defineProps<{
  message: MessageNode;
  short?: boolean;
}>();
const container = ref<HTMLDivElement>();
const hover = useElementHover(container);
const chat = injectTreeChat();
const dialog = useDialog();

const ops = computed<
  {
    icon: string;
    tips: string;
    size: string;
    color?: string;
    onClick: () => void;
  }[]
>(() => {
  return [
    {
      icon: "i-ph-share-network-light",
      tips: "分享",
      size: "text-18px",
      onClick: async () => {
        const urlRef = ref<string>("");
        const getShareId = async (): Promise<string> => {
          const result = await axios.post(
            "https://jpzrg8mqpi.hk.aircode.run/share",
            {
              data: chat.getBeforeChat(props.message.id),
            }
          );
          return result.data.id;
        };
        dialog.create({
          title: "分享",
          icon: () => h("div", { class: "i-ph-share-network-light" }),
          content: () => h(ShareLink, { url: urlRef.value }),
        });
        const shareId = props.message.shareId ?? (await getShareId());
        const url = new URL(location.origin);
        url.pathname = "/share";
        url.searchParams.set("id", shareId);
        urlRef.value = url.href;
        props.message.shareId = shareId;
      },
    },
    {
      icon: "i-ic-round-star-outline",
      tips: "收藏成 prompt",
      size: "text-20px",
      onClick: () => {
        dialog.info({
          title: "未实现",
        });
        console.log(props.message.gptInfo);
      },
    },
    {
      icon: "i-gg-git-fork",
      tips: "从这里分叉",
      size: "text-16px",
      onClick: () => {
        chat.current.value = props.message.id;
      },
    },
    {
      icon: "i-teenyicons-bulb-on-outline",
      tips: "生成回答",
      size: "text-14px",
      onClick: () => {
        chat.getAnswer(props.message.id);
      },
    },
    {
      icon: "i-ic-round-delete-outline",
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
});
const title = computed(() => {
  const gptInfo = props.message.gptInfo;
  if (!gptInfo) {
    return;
  }
  const infoList: string[] = [];
  if (gptInfo.model != null) {
    infoList.push(gptInfo.model);
  }
  if (gptInfo.temperature != null) {
    infoList.push(`${gptInfo.temperature}℃`);
  }
  if (gptInfo.totalTime != null) {
    infoList.push(`${(gptInfo.totalTime / 1000).toFixed(2)}s`);
  }
  if (props.message.children.length) {
    infoList.push(`⑁${props.message.children.length}`);
  }
  return infoList.join(" ");
});
onMounted(() => {
  if (props.message.isNew) {
    // eslint-disable-next-line vue/no-mutating-props
    props.message.isNew = false;
    container.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
</script>
<template>
  <div class="flex" w-full relative>
    <div
      ref="container"
      py-1
      px-2
      rd-1
      max-w-full
      h="max"
      relative
      class="markdown"
      :class="[
        message.message.role === 'user'
          ? 'bg-dark-50 color-light-50'
          : 'b-dashed b-1 b-gray-100',
      ]"
    >
      <span
        v-if="message.gptInfo"
        select-none
        relative
        h-1
        style="top: -7px"
        text-2.5
        text-gray-400
        flex
        items-center
        bg-white
        w-max
        >{{ title }}</span
      >
      <div
        :class="[!hover && 'invisible']"
        absolute
        style="right: 0; top: -24px"
        p-2
      >
        <div
          flex
          border="1px solid gray-100"
          overflow="hidden"
          rd="4px"
          bg="white"
          shadow-md
        >
          <template v-for="(v, i) in ops" :key="i">
            <div v-if="i !== 0" w="1px" bg="gray-100" />
            <n-tooltip>
              <template #trigger>
                <div
                  w="20px"
                  h="20px"
                  flex
                  items-center
                  justify-center
                  hover="bg-gray200"
                  transition
                  cursor="pointer"
                  @click.prevent.stop="v.onClick()"
                >
                  <div :class="[v.icon, 'text-gray-400', v.size]"></div>
                </div>
              </template>
              <span>{{ v.tips }}</span>
            </n-tooltip>
          </template>
        </div>
      </div>
      <div text-12px>
        <n-button
          v-if="message.abort"
          size="tiny"
          mr-2
          dashed
          @click="message.abort?.abort()"
        >
          <template #icon>
            <n-spin size="small"></n-spin>
          </template>
          闭嘴
        </n-button>
        <div v-if="short" whitespace="nowrap" text-ellipsis overflow-hidden>
          {{ message.message.content }}
        </div>
        <span v-else whitespace="pre-wrap"
          >{{ message.message.content }}<span inline-block h="1em"></span
        ></span>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
