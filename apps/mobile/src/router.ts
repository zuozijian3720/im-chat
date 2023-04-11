import { RouteRecordRaw } from "vue-router";
import HistoryPanel from "./components/history/HistoryPanel.vue";
import ChatView from "./components/chat/ChatView.vue";
import SettingPanel from "./components/setting/SettingPanel.vue";
import Share from "./Share.vue";
import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/history",
  },
  {
    path: "/history",
    name: "History",
    component: HistoryPanel,
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatView,
  },
  {
    path: "/setting",
    name: "Setting",
    component: SettingPanel,
  },
  {
    path: "/share",
    name: "Share",
    component: Share,
  },
];
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
