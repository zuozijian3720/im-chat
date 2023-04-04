<template>
  <div flex w-screen h-screen items-center justify-center>
    <NSpin size="large"></NSpin>
  </div>
</template>

<script setup lang="ts">
import { injectTreeChat, MessageNode } from "./logic/TreeChat";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const chat = injectTreeChat();
const route = useRoute();
const id = route.query.id;
const router = useRouter();
if (id) {
  axios
    .get("https://jpzrg8mqpi.hk.aircode.run/getShareData", {
      params: { id: id },
    })
    .then((res) => {
      const data: MessageNode[] = res.data.data;
      if (Array.isArray(data)) {
        const last = data[data.length - 1];
        chat.isExist(last.id);
        if (!chat.isExist(last.id)) {
          chat.load(data);
        }
        chat.current.value = last.id;
        router.push({
          path: "/",
          replace: true,
        });
      }
    });
}
</script>

<style scoped></style>
