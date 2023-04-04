import { createApp } from "vue";
import "uno.css";
import {
  // create naive ui
  create,
  NAvatar,
  // component
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

createApp(App).use(naive).mount("#app");
