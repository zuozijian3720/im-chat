<template>
  <ion-buttons>
    <ion-button router-link="/setting">
      <ion-icon
        slot="icon-only"
        :ios="ellipsisHorizontal"
        :md="ellipsisVertical"
      ></ion-icon>
    </ion-button>
  </ion-buttons>
</template>
<script lang="ts" setup>
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import { IonIcon, IonButtons, IonButton } from "@ionic/vue";
</script>
