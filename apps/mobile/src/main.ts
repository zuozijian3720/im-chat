import { createApp } from "vue";
import "uno.css";
import "./main.scss";
import App from "./App.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ImChat from "./ImChat.vue";
import Share from "./Share.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: ImChat },
  { path: "/share", component: Share },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
createApp(App).use(router).mount("#app");
