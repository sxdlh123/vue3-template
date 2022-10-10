<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in" appear>
      <component :is="Component" :key="$route.name" />
    </transition>
  </router-view>
</template>

<script setup>
import api from "@/api/api";
import { onBeforeMount, onMounted, provide } from "vue";
import Fingerprint from "fingerprintjs";
import wx from "weixin-js-sdk";
import userInfo from "@/store/user";
import { useRoute } from "vue-router";
import { showDialog } from "vant";

const user = userInfo();
const route = useRoute();
provide("api", api);

//检测环境获取uid
onMounted(() => {
  if (!!window["JKEventHandler"]) {
    const jdk = window["JKEventHandler"];
    return jdk.callNativeFunction("getUserInfo", null, (res) => {
      //需要登录
      const obj = JSON.parse(res);
      if (obj.status == 0) {
        jdk.callNativeFunction("login", null, (res_2) => {
          location.reload();
        });
      } else {
        user.get_uid({
          answer_id: route.query.id || 55,
          name: obj.nickname,
          tel: obj.tel,
        });
      }
    });
  } else {
    //检测微信和app端
    //储存answer_id
    setTimeout(() => {
      user.$patch({
        // 55,66,138
        answer_id: route.query.id || 55,
      });
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf("micromessenger") != -1;
      // if (isWeixin) {
      //获取wx端权限
      // 配置微信分享key
      sessionStorage.setItem("wxShare", window.location.href);

      const params = {
        unique_code: new Fingerprint().get(),
        answer_id: user.answer_id,
      };
      user.get_uid(params);
      // }
      //其它端
      // else {
      //
      // }
    }, 200);
  }
});
</script>
<style lang="scss">
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-15px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(15px);
}
</style>
