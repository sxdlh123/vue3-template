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
//埋点

require("@/common/common.js");

//指令
app.directive("throttle", {
  mounted(el, binding) {
    // 至少需要回调函数以及监听事件类型
    if (typeof binding.value.fn !== "function" || !binding.value.event) return;
    let delay = 500;
    el.timer = null;
    el.handler = function () {
      if (el.timer) return;
      el.timer = setTimeout(() => {
        binding.value.fn.apply(this, arguments);
        el.timer = null;
      }, binding.value.delay || delay);
    };
    el.addEventListener(binding.value.event, el.handler);
  },
  // 元素卸载前也记得清理定时器并且移除监听事件
  beforeMount(el, binding) {
    if (el.timer) {
      clearTimeout(el.timer);
      el.timer = null;
    }
    el.removeEventListener(binding.value.event, el.handler);
  },
});
