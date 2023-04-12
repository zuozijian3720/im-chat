import { RouteRecordRaw } from "vue-router";
import HistoryPage from "./components/history/HistoryPage.vue";
import ChatPage from "./components/chat/ChatPage.vue";
import SettingPage from "./components/setting/SettingPage.vue";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import SharePage from "./components/share/SharePage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/history",
  },
  {
    path: "/history",
    name: "History",
    component: HistoryPage,
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatPage,
  },
  {
    path: "/setting",
    name: "Setting",
    component: SettingPage,
  },
  {
    path: "/share",
    name: "Share",
    component: SharePage,
  },
];
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
