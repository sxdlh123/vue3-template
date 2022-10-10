import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPluginPersist);

const app = createApp(App);

//桌面端适配
import "@vant/touch-emulator";
// Toast,showDialog,showNotify,showImagePreview
import { Toast, Dialog, Notify, ImagePreview } from "vant";
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";

app
  .use(router)
  .use(pinia)
  .use(Toast)
  .use(Dialog)
  .use(Notify)
  .use(ImagePreview)
  .mount("#app");

// api
import api from "@/api/api.js";

app.config.globalProperties.$api = api;
//vh
import vhCheck from "vh-check";
vhCheck();
