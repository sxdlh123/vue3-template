<template>
  <div class="content">
    <div id="mui-player"></div>
    <!--    遮罩-->
    <div class="top_box">
      <van-button @click="play()" v-if="step === 'loading'"
        >引导开始</van-button
      >
      <van-button @click="play()" v-if="step === 'guide'">
        播放沙画视频</van-button
      >
      <img
        v-if="step === 'activity'"
        :src="require('@@/img/street_back.png')"
        alt="Planets"
        usemap="#planetmap"
        class="street_img"
      />
      <map name="planetmap" id="planetmap">
        <area
          alt="测试"
          shape="rect"
          coords="254,235,391,292"
          @click="testImg"
        />
      </map>
      <div class="light_list" v-if="step === 'activity'">
        <div
          v-for="item in lightList"
          :key="item.title"
          class="light_item"
          :style="{
            top: item.top,
            left: item.left,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import MuiPlayer from "mui-player";
import "mui-player/dist/mui-player.min.css";
const mp = ref(null);
const Bvideo = ref(null); //原生视频

const opacity = ref(1); //遮罩透明度
const background = ref("antiquewhite"); //遮罩背景

// 步骤条 loading:加载 guide:引导,activity:活动首页，street:各个街道,
const step = ref("activity");

const lightList = [
  { title: "阿子营街", top: "27%", left: "24%" },
  { title: "松华街", top: "42.5%", left: "22%" },
  { title: "茨坝街", top: "53.5%", left: "21%" },
  { title: "龙泉街", top: "62%", left: "24%" },
  { title: "联盟街", top: "65%", left: "24%" },
  { title: "鼓楼街", top: "", left: "" },
  { title: "拓东街", top: "", left: "" },
  { title: "东华街", top: "", left: "" },
  { title: "青云街", top: "", left: "" },
  { title: "今辰街", top: "", left: "" },
  { title: "双龙街", top: "", left: "" },
  { title: "滇源街", top: "", left: "" },
];
onMounted(() => {
  mp.value = new MuiPlayer({
    container: "#mui-player",
    src: "https://rmt-panlong-hz-file-vcdn.kmzscc.com/panlongrongmei/panlong/2022/10/09/FaZxmXtC6Wu45.mp4",
    autoOrientaion: false, //全屏时否自动切换方向
    objectFit: "cover",
    videoAttribute: [
      { attrKey: "webkit-playsinline", attrValue: "webkit-playsinline" },
      { attrKey: "playsinline", attrValue: "playsinline" },
      { attrKey: "x5-video-player-type", attrValue: "h5-page" },
    ],
  });
  Bvideo.value = mp.value.video();
  //监听播放事件
  // 结束
  Bvideo.value.addEventListener("ended", (e) => {
    //处理各个状态的背景图
    if (step.value === "loading") {
      //引导定格页
      background.value = "url(" + require("@@/img/back.png") + ")";
      step.value = "guide";
    }
    if (step.value === "guide") {
      //活动页
      background.value = "white";
      step.value = "activity";
    }
    opacity.value = 1;
  });
});
// 播放
async function play() {
  const val = step.value;
  if (val === "loading") {
    await Bvideo.value.play();
    opacity.value = 0;
  }
  if (val === "guide") {
    //沙画视频
    Bvideo.value.src =
      "https://rmt-panlong-hz-file-vcdn.kmzscc.com/panlongrongmei/panlong/2022/10/09/FaZxmXtC6Wu45.mp4";

    opacity.value = 0;
    setTimeout(() => {
      mp.value.video().play();
    }, 1000);
  }
}
//图片热区
function testImg(e) {
  console.log(e, "我点击了");
}
</script>
<style lang="scss" scoped>
.content {
  #mui-player {
    width: 100% !important;
    height: 100% !important;
    z-index: 10;
  }
  .top_box {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: v-bind(background);
    background-size: 100% 100%;
    opacity: v-bind(opacity);
    transition: all ease 1.5s;
  }
}
.street_img {
  width: 100%;
  height: 100%;
  position: absolute;
}
:deep(.mplayer-header) {
  display: none !important;
}
:deep(.mplayer-footer) {
  display: none !important;
}
:deep(.m-player) {
  position: absolute;
}
.light_item {
  position: fixed;
  z-index: 50;
  background: red;
  padding: 10px 30px;
}
</style>
