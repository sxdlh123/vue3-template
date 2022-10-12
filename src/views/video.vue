<template>
  <div class="myvideo" id="mui-player"></div>
</template>
<script setup>
import MuiPlayer from "mui-player";
import "mui-player/dist/mui-player.min.css";
import { onMounted, ref } from "vue";

const mp = ref(null);
const video = ref(null);
onMounted(() => {
  mp.value = new MuiPlayer({
    container: "#mui-player",
    src: "https://rmt-panlong-hz-file-vcdn.kmzscc.com/panlongrongmei/panlong/2022/10/09/FaZxmXtC6Wu45.mp4",
    autoOrientaion: false, //全屏时否自动切换方向
    objectFit: "cover",
    autoplay: true,
    pageHead: true,
    videoAttribute: [
      { attrKey: "webkit-playsinline", attrValue: "webkit-playsinline" },
      { attrKey: "playsinline", attrValue: "playsinline" },
      { attrKey: "x5-video-player-type", attrValue: "h5-page" },
    ],
  });
  video.value = mp.value.video();
  mp.value.toggleControls(true);
});
</script>
<style lang="scss" scoped>
.myvideo {
  width: 100vh !important;
  height: 100vw !important;
}
:deep(.mplayer-footer) {
  display: inline !important;
}
</style>
