import { createApp } from "vue";
import "uno.css";
import "./main.scss";
import App from "./App.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Share from "./Share.vue";
import HistoryPanel from "./components/history/HistoryPanel.vue";
import ChatView from "./components/chat/ChatView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: HistoryPanel },
  { path: "/chat", component: ChatView },
  { path: "/share", component: Share },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
createApp(App).use(router).mount("#app");
