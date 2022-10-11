<template>
  <div class="content">
    <div id="mui-player"></div>
    <!--    遮罩-->
    <div class="top_box u-flex-column u-col-center u-row-center">
      <!--      <van-button @click="play()" v-if="step === 'loading'"-->
      <!--        >引导开始</van-button-->
      <!--      >-->
      <van-circle
        v-model:current-rate="currentRate"
        :rate="rate"
        v-if="step === 'loading'"
        :speed="1500"
        size="180"
        :color="{
          '0%': '#3fecff',
          '100%': '#6149f6',
        }"
        text="渐变色"
      >
        <template #default>
          <div class="u-flex-column u-row-center" style="height: 100%">
            <van-image
              @load="startLoading"
              src="https://kmzsccfile.kmzscc.com/Uploads/common/painting/mascot.gif"
              width="135"
            ></van-image>
            <van-button
              @click="play()"
              :type="rate === 100 ? 'success' : 'warning'"
              plain
              class="mt-5"
              >{{ rate === 100 ? "开始" : rate + "%" }}
            </van-button>
          </div>
        </template>
      </van-circle>

      <van-button @click="play()" v-if="step === 'guide'">
        播放沙画视频
      </van-button>
      <!--      活动图-->
      <img
        v-if="step === 'activity'"
        :src="require('@@/img/street_back.png')"
        alt="Planets"
        usemap="#planetmap"
        class="street_img"
      />
      <div class="light_list" v-if="step === 'activity'">
        <!--        闪点-->
        <div
          v-for="item in lightList"
          :key="item.title"
          class="light_item"
          :style="{
            top: item.top,
            left: item.left,
          }"
        >
          <div class="light"></div>
        </div>

        <!--        热区-->
        <div
          v-for="(item, id) in hotList"
          :key="item.title"
          class="hot_item"
          @click="goItem(id)"
          :style="{
            top: item.top,
            left: item.left,
          }"
        ></div>
      </div>
      <!--      预览-->
      <!--      <div v-if="step === 'street'" class="flex-1" style="overflow: scroll">-->
      <!--        <van-image-->
      <!--          :src="previewImg"-->
      <!--          width="100%"-->
      <!--          height="100%"-->
      <!--          fit="cover"-->
      <!--        ></van-image>-->
      <!--      </div>-->
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import MuiPlayer from "mui-player";
import "mui-player/dist/mui-player.min.css";
import { showDialog } from "vant";
import load from "@/store/load";
import { useRouter } from "vue-router";
const router = useRouter();
//预加载图片资源
const imgLoad = load();

const mp = ref(null);
const Bvideo = ref(null); //原生视频
const currentRate = ref(0); // 进度条
const rate = ref(15); //进度

const opacity = ref(1); //遮罩透明度
const background = ref("#c9e3e4"); //遮罩背景
const fontShow = ref("none"); //底部控件
const mask_index = ref(10); //遮罩层级

// 步骤条 loading:加载 guide:引导,activity:活动首页，street:各个街道,
const step = ref("activity");

//闪点数组
const lightList = [
  { title: "阿子营街", top: "25.3%", left: "42.5%" },
  { title: "松华街", top: "42%", left: "42%" },
  { title: "茨坝街", top: "53%", left: "40.6%" },
  { title: "龙泉街", top: "60.9%", left: "43.5%" },
  { title: "联盟街", top: "71.9%", left: "36.8%" },
  { title: "鼓楼街", top: "78.7%", left: "36.2%" },
  { title: "拓东街", top: "81%", left: "38.2%" },
  { title: "东华街", top: "76.2%", left: "39.5%" },
  { title: "青云街", top: "71.3%", left: "46%" },
  { title: "今辰街", top: "67.2%", left: "39.3%" },
  { title: "双龙街", top: "59.3%", left: "50.3%" },
  { title: "滇源街", top: "36.2%", left: "53.5%" },
];
//热区数组
const hotList = [
  { title: "阿子营街", top: "24.3%", left: "26.5%" },
  { title: "松华街", top: "41%", left: "27%" },
  { title: "茨坝街", top: "52%", left: "25.6%" },
  { title: "龙泉街", top: "59.9%", left: "27.5%" },
  { title: "联盟街", top: "70.9%", left: "21.8%" },
  { title: "鼓楼街", top: "78.7%", left: "21.2%" },
  { title: "拓东街", top: "87%", left: "35.2%" },
  { title: "东华街", top: "76.2%", left: "47.5%" },
  { title: "青云街", top: "70.3%", left: "59%" },
  { title: "今辰街", top: "66.2%", left: "48.3%" },
  { title: "双龙街", top: "58.3%", left: "58.3%" },
  { title: "滇源街", top: "35.2%", left: "61.5%" },
];
const previewImg = ref("");
onMounted(() => {
  //开启进度条加载
  mp.value = new MuiPlayer({
    container: "#mui-player",
    src: "https://rmt-panlong-hz-file-vcdn.kmzscc.com/panlongrongmei/panlong/2022/10/09/FaZxmXtC6Wu45.mp4",
    autoOrientaion: true, //全屏时否自动切换方向
    objectFit: "cover",
    pageHead: false,
    videoAttribute: [
      { attrKey: "webkit-playsinline", attrValue: "webkit-playsinline" },
      { attrKey: "playsinline", attrValue: "playsinline" },
      { attrKey: "x5-video-player-type", attrValue: "h5-page" },
    ],
  });
  mp.value.on("ready", () => {
    setTimeout(() => {
      rate.value = 100;
    }, 1500);
  });
  Bvideo.value = mp.value.video();
  //监听播放事件
  // 结束
  Bvideo.value.addEventListener("ended", (e) => {
    setTimeout(() => {
      opacity.value = 1;
    }, 500);
    //处理各个状态的背景图
    if (step.value === "loading") {
      //引导定格页
      background.value = "url(" + require("@@/img/back.png") + ")";
      return (step.value = "guide");
    }
    if (step.value === "guide") {
      //活动页
      background.value = "white";
      //改变遮罩层级
      mask_index.value = 10;
      return (step.value = "activity");
    }
  });
});

// 播放
async function play() {
  if (rate.value < 100) {
    return;
  }
  const val = step.value;
  if (val === "loading") {
    await Bvideo.value.play();
    opacity.value = 0;
  }
  if (val === "guide") {
    //沙画视频
    Bvideo.value.src =
      "https://rmt-panlong-hz-file-vcdn.kmzscc.com/panlongrongmei/panlong/2022/10/08/NxcsTeb2SAu45.mp4";

    setTimeout(async () => {
      await mp.value.video().play();
      // mp.value.toggleControls(true);
      //改变遮罩层级
      opacity.value = 0.2;
      mask_index.value = -1;
      // 开启底部播放控件
      fontShow.value = "inline";
    }, 1000);
  }
}

//图片热区
function goItem(id) {
  // previewImg.value = `https://kmzsccfile.kmzscc.com/Uploads/common/painting/id_${id}.jpg`;
  // // step.value = "street";
  router.replace({
    path: "/previewImg",
    query: {
      url: `https://kmzsccfile.kmzscc.com/Uploads/common/painting/id_${id}.jpg`,
    },
  });
}
//进度条加载
function startLoading() {
  let _time = null;
  return new Promise((res, rej) => {
    _time = setInterval(() => {
      if (rate.value > 95) {
        return window.clearInterval(_time);
      }
      rate.value += 14;
    }, 500);
  });
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
    z-index: v-bind(mask_index);
    width: 100%;
    height: 100%;
    background: v-bind(background);
    background-size: 100% 100%;
    opacity: v-bind(opacity);
    transition: all ease 1.5s;
  }
}

.street_img {
  width: 78%;
  height: 100%;
  position: absolute;
  //object-fit: contain;
}

:deep(.mplayer-footer) {
  display: v-bind(fontShow) !important;
}

:deep(.m-player) {
  position: absolute;
}

.light_item {
  position: fixed;
  z-index: 50;
  //background: #2481de;
  padding: 7.5px 30px;

  .light {
    width: 20px;
    height: 20px;
    border-radius: 100%;
    filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f00a0e9, endcolorstr=#7f00a0e9);
    animation: blings-3 2.5s linear infinite;
    position: absolute;
    left: -5px;
    top: -5px;
    //background: #18e3b3;
    background: red;
  }

  @keyframes blings-3 {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    25% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
}

.hot_item {
  position: fixed;
  z-index: 50;
  //background: #2481de;
  opacity: 0.6;
  padding: 7px 17px;
}
</style>
