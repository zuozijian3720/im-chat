<script lang="ts" setup>
import dti from "dom-to-image";
import { computed, ref } from "vue";
import axios from "axios";
import { injectTreeChat, MessageNode } from "../../logic/TreeChat";
import { useMessage } from "naive-ui";
import SharePreview from "./SharePreview.vue";

const props = defineProps<{
  message: MessageNode;
}>();
const contentRef = ref<HTMLDivElement>();
const chat = injectTreeChat();
const drawQuality = ref(3);
const messageList = computed(() => chat.getBeforeChat(props.message.id));
const copyImageLoading = ref(false);
const message = useMessage();
const copyImage = async () => {
  if (!contentRef.value) {
    return;
  }
  copyImageLoading.value = true;
  try {
    const blob = await dti.toBlob(contentRef.value, {
      width: previewWidth.value * drawQuality.value,
      height: contentRef.value?.offsetHeight * drawQuality.value,
    });
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    message.success("已复制图片");
  } catch (e) {
    console.error(e);
    message.error("分享失败");
  } finally {
    copyImageLoading.value = false;
  }
};
const genShareUrl = async () => {
  const getShareId = async (): Promise<string> => {
    const result = await axios.post("https://jpzrg8mqpi.hk.aircode.run/share", {
      data: chat.getBeforeChat(props.message.id),
    });
    return result.data.id;
  };
  const shareId = props.message.shareId ?? (await getShareId());
  const url = new URL(location.origin);
  url.pathname = "/share";
  url.searchParams.set("id", shareId);
  props.message.shareId = shareId;
  return url.href;
};
const copyLinkLoading = ref(false);
const copyLink = async () => {
  copyLinkLoading.value = true;
  try {
    const url = await genShareUrl();
    await navigator.clipboard.writeText(url);
    message.success("已复制链接");
  } catch (e) {
    console.error(e);
    message.error("分享失败");
  } finally {
    copyLinkLoading.value = false;
  }
};
const previewWidth = ref(600);
const previewStyle = computed(() => {
  return `width:${previewWidth.value}px;`;
});
const scaleStyle = computed(() => {
  return {
    enlarge: `transform: scale(${drawQuality.value}); transform-origin: 0 0;`,
    reduce: `transform: scale(${
      1 / drawQuality.value
    }); transform-origin: 0 0;`,
  };
});
</script>

<template>
  <div flex flex-col>
    <div
      style="
        position: absolute;
        left: -999999999px;
        user-select: none;
        pointer-events: none;
      "
    >
      <div ref="contentRef">
        <SharePreview
          :message-list="messageList"
          :style="previewStyle + scaleStyle.enlarge"
        />
      </div>
    </div>
    <div flex justify-center>
      <n-slider
        w="600px"
        v-model:value="previewWidth"
        :step="5"
        :max="1200"
        :min="200"
      ></n-slider>
    </div>
    <div overflow-y-scroll max-h="500px" flex justify-center w-full mt-4 mb-4>
      <div>
        <SharePreview :message-list="messageList" :style="previewStyle" />
      </div>
    </div>
    <n-space justify="center">
      <n-button :loading="copyImageLoading" @click="copyImage()"
        >分享图片
      </n-button>
      <n-button :loading="copyLinkLoading" @click="copyLink()"
        >分享链接
      </n-button>
    </n-space>
  </div>
</template>
