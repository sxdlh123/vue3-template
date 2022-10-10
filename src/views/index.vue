<template>
  <div class="content-box u-flex-column">
    <div class="flex-1 u-flex-column" style="overflow: auto">
      <!--      播放器-->
      <div id="mui-player" class="mb-15 mui-player"></div>
      <div
        v-if="playShow"
        class="play_btn u-flex-column u-col-center u-row-center"
      >
        <van-image
          :src="require('@@/img/play.png')"
          fit="center"
          width="55"
          @click="playVideo"
        ></van-image>
      </div>
      <div class="font-16 m-0-15">
        您的昆明话及格吗？快来测试一下你昆明话水平吧 ......
      </div>
      <van-divider
        :style="{ padding: 0, borderColor: '#d5c1c1', margin: '10px 20px' }"
        class="width100"
      />
      <!--      列表-->
      <van-skeleton title :row="10" :loading="loading" class="width100">
        <div class="m-0-15 width100 flex-1 overflow-y">
          <div
            v-for="item in tabList"
            :key="item.id"
            class="mb-10"
            @click="getTest(item)"
          >
            <div class="u-flex u-row-between u-col-bottom">
              <!--图片-->
              <van-image
                :src="item.logo + '?x-oss-process=image/resize,m_fill,w_400'"
                height="100"
                fit="cover"
                radius="10"
                width="45%"
              ></van-image>
              <!--              <img-->
              <!--                class="wz-img"-->
              <!--                :src="item.logo + '?x-oss-process=image/resize,m_fill,w_400'"-->
              <!--              />-->
              <!--          标题按钮-->
              <div class="flex-1 u-flex-column m-0-10">
                <span class="font-12 font-bold mb-20">{{ item.title }}</span>
                <div class="test_btn font-10">我要测试</div>
              </div>
            </div>

            <van-divider
              :style="{
                padding: 0,
                borderColor: '#d5c1c1',
                margin: '10px 0 0 0',
              }"
              class="width100"
            />
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>
<script setup>
import "mui-player/dist/mui-player.min.css";
import MuiPlayer from "mui-player";
import { inject, onBeforeMount, onMounted, ref } from "vue";
import { showFailToast, showToast } from "vant";
import { useRouter } from "vue-router";

const api = inject("api");
const router = useRouter();

const loading = ref(true);
const playShow = ref(true); //播放遮罩
const mp = ref(null); //播放器
const tabList = ref([]); //文章列表

onMounted(() => {
  getDate();
});

//获取文章详情(视频接口)和项目列表
async function getDate() {
  //视频
  api.getNewsDetail({ news_id: 138 }).then((res) => {
    //初始化播放器
    mp.value = new MuiPlayer({
      container: "#mui-player",
      title: "", //res.data["title"],
      poster: res.data["news_big_img"],
      src: res.data["video_url"],
      videoAttribute: [
        { attrKey: "webkit-playsinline", attrValue: "webkit-playsinline" },
        { attrKey: "playsinline", attrValue: "playsinline" },
        { attrKey: "x5-video-player-type", attrValue: "h5-page" },
      ],
    });
  });
  //文章
  api.siteProjectList().then((res) => {
    setTimeout(() => {
      loading.value = false;
      // 加载完成埋点
      window.loggerCallback({
        event_type: "cat_click",
        event_value: res.data[0].id,
        topic: "cat",
        route_referer: document.referrer,
        route_type: "index",
        route_value: res.data[0].id,
      });
      tabList.value = res.data;
    }, 1200);
  });
}

// 视频播放
function playVideo() {
  playShow.value = false;
  const video = mp.value.video();
  video.play();
}

//我要测试
function getTest(item) {
  //获取当前题目配置信息
  //   1、status为0提示用户考试已关闭。
  // 2、test_paper里没数据，提示暂时不能考试。
  // 3、当前时间大于end_time提示该考试已结束。
  // 4、当前时间小于start_time提示改考试未开始
  //埋点
  setTimeout(() => {
    window.loggerCallback({
      event_value: item.id,
      route_referer: document.referrer,
      route_type: "opBtn",
      route_value: item.id,
    });
  }, 1000);
  api.answer_config({ answer_id: item.id }).then((res) => {
    //检查
    if (res.data.status === 0) return showToast("考试已关闭");
    if (res.data["test_paper"] === null) return showFailToast("暂时不能考试");
    const Time = new Date().getTime();
    if (Time > res.data["end_time"] * 1000)
      return showFailToast("该考试已结束");
    if (Time < res.data["start_time"] * 1000)
      return showFailToast("该考试未开始");
    //进入答题
    router.push({
      path: "/answer-detail",
      query: { test_paper_id: item.test_paper_id, title: item.title },
    });
  });
}
</script>
<style lang="scss" scoped>
#mui-player {
  width: 100% !important;
  height: 190px !important;
}

.play_btn {
  height: 190px;
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  position: absolute;
}

.km-title {
  color: #1970ad;
  letter-spacing: 2px;
}

.wz-img {
  height: 100px;
  width: 45%;
  background-position: center center;
}

.test_btn {
  background: url("~@@/img/test_btn.png");
  background-size: 100% 100%;
  color: #fff;
  padding: 5px 20px;
}

:deep(.mplayer-header) {
  display: none !important;
}
</style>
