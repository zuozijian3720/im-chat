import { createApp } from "vue";
import "uno.css";
import {
  create,
  NAvatar,
  NButton,
  NCard,
  NDivider,
  NEllipsis,
  NFormItem,
  NIcon,
  NInput,
  NInputNumber,
  NList,
  NListItem,
  NModal,
  NPopconfirm,
  NSelect,
  NSlider,
  NSpace,
  NSpin,
  NSwitch,
  NTooltip,
} from "naive-ui";
import App from "./App.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ImChat from "./ImChat.vue";
import Share from "./Share.vue";

const naive = create({
  components: [
    NButton,
    NInput,
    NAvatar,
    NSpin,
    NDivider,
    NIcon,
    NTooltip,
    NModal,
    NCard,
    NPopconfirm,
    NSelect,
    NSlider,
    NEllipsis,
    NFormItem,
    NList,
    NListItem,
    NInputNumber,
    NSpace,
    NSwitch,
  ],
});

const routes: RouteRecordRaw[] = [
  { path: "/", component: ImChat },
  { path: "/share", component: Share },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
createApp(App).use(naive).use(router).mount("#app");
