<template>
  <div class="primary-bg" h-48px flex justify-between shadow items-center="">
    <div>
      <slot name="left"></slot>
    </div>
    <ion-title>{{ title }}</ion-title>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IonTitle } from "@ionic/vue";

defineProps<{
  title: string;
}>();
</script>
