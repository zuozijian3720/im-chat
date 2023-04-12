<script lang="ts" setup>
import dti from "dom-to-image";
import { computed, nextTick, ref } from "vue";
import axios from "axios";
import { injectTreeChat } from "chat-logic";
import SharePreview from "./SharePreview.vue";
import { HOST } from "../../utils/host";
import { IonButton, IonContent, IonPage, toastController } from "@ionic/vue";
import TitleBar from "../common/TitleBar.vue";
import { useRoute } from "vue-router";
import { Clipboard } from "@capacitor/clipboard";
import { Directory, Filesystem } from "@capacitor/filesystem";

const route = useRoute();
const message = computed(() => {
  const id = route.query.id;
  if (typeof id === "string") {
    return chat.getMessage(id);
  }
});
const messageList = computed(() => {
  if (message.value) {
    return chat.getBeforeChat(message.value.id);
  }
  return [];
});
const contentRef = ref<HTMLDivElement>();
const chat = injectTreeChat();
const drawQuality = ref(3);
const copyImageLoading = ref(false);
const copyImage = async () => {
  if (!contentRef.value || !message.value) {
    return;
  }
  copyImageLoading.value = true;
  try {
    syncWidth();
    await new Promise((res) => nextTick(() => res()));
    const png = await dti.toPng(contentRef.value, {
      width: previewWidth.value * drawQuality.value,
      height: contentRef.value?.offsetHeight * drawQuality.value,
    });
    const uri = await Filesystem.writeFile({
      path: `im-chat/${message.value.id}.png`,
      data: png,
      directory: Directory.Documents,
      recursive: true,
    });
    const toast = await toastController.create({
      message: "图片已保存",
      position: "top",
      duration: 1000,
    });
    await toast.present();
  } catch (e) {
    const toast = await toastController.create({
      message: "保存失败",
      position: "top",
      duration: 1000,
    });
    await toast.present();
    console.error(e);
  } finally {
    copyImageLoading.value = false;
  }
};
const genShareUrl = async () => {
  const messageNode = message.value!;
  const getShareId = async (): Promise<string> => {
    const result = await axios.post("https://jpzrg8mqpi.hk.aircode.run/share", {
      data: chat.getBeforeChat(messageNode.id),
    });
    return result.data.id;
  };
  const shareId = messageNode.shareId ?? (await getShareId());
  const url = new URL(HOST);
  url.pathname = "/preview";
  url.searchParams.set("id", shareId);
  messageNode.shareId = shareId;
  return url.href;
};
const copyLinkLoading = ref(false);
const copyLink = async () => {
  copyLinkLoading.value = true;
  try {
    const url = await genShareUrl();
    await Clipboard.write({ string: url });
  } catch (e) {
    console.error(e);
  } finally {
    copyLinkLoading.value = false;
  }
};
const previewRef = ref<HTMLDivElement>();
const syncWidth = () => {
  previewWidth.value = previewRef.value?.getBoundingClientRect().width ?? 300;
};
const previewWidth = ref(0);
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
  <ion-page>
    <Teleport to="body">
      <div
        v-if="message"
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
    </Teleport>
    <title-bar title="分享"></title-bar>
    <ion-content v-if="message">
      <div h-full flex flex-col class="primary-bg" px-2>
        <div overflow-y-scroll flex justify-center w-full flex-1>
          <div ref="previewRef" h-max w-full>
            <SharePreview :message-list="messageList" />
          </div>
        </div>
        <div w="100%" flex flex-col="" justify="center" pb-4 pt-2>
          <div justify="center" flex>
            <ion-button :loading="copyImageLoading" @click="copyImage()"
              >分享图片
            </ion-button>
            <!--            <ion-button-->
            <!--              size="small"-->
            <!--              :loading="copyLinkLoading"-->
            <!--              @click="copyLink()"-->
            <!--              >分享链接-->
            <!--            </ion-button>-->
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
