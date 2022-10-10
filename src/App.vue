<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in" appear>
      <component :is="Component" :key="$route.name" />
    </transition>
  </router-view>
</template>

<script setup>
import api from "@/api/api";
import { onBeforeMount, provide } from "vue";
provide("api", api);

onBeforeMount(() => {
  //强制横屏
  init();
});

function init() {
  forceLandscapeScreenHandle();
  // 这里监控
  onWindowSizeChanged();
}
function forceLandscapeScreenHandle() {
  const body = document.getElementsByTagName("body")[0];
  const html = document.getElementsByTagName("html")[0];
  const width = html.clientWidth;
  const height = html.clientHeight;
  const max = width > height ? width : height;
  const min = width > height ? height : width;
  body.style.width = max + "px";
  body.style.height = min + "px";
}

function onWindowSizeChanged() {
  window.addEventListener("resize", forceLandscapeScreenHandle);
}
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
