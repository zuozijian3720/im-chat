import { createApp } from "vue";
import "uno.css";
import "./main.scss";
import AppView from "./App.vue";
import { IonicVue } from "@ionic/vue";
import { router } from "./router";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";

StatusBar.setBackgroundColor({ color: "#f3f4f6" });
StatusBar.setStyle({ style: Style.Light });
App.addListener("backButton", (event) => {
  if (event.canGoBack) {
    router.back();
  } else {
    App.minimizeApp();
  }
});
const app = createApp(AppView).use(IonicVue).use(router);
router.isReady().then(() => {
  app.mount("#app");
});
