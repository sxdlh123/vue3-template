<template>
  <div class="content-box">
    <van-nav-bar fixed placeholder>
      <template #title>
        <span class="km-title">测试结果</span>
      </template>
    </van-nav-bar>
    <van-dialog v-model:show="show" width="90%" :show-confirm-button="false">
      <div class="dialog_back u-flex-column p-20">
        <van-image
          class="mt-40"
          :src="require('@@/img/grade.png')"
          width="20%"
        ></van-image>
        <div class="mt-5 font-bold">恭喜你，得分{{ route.query.score }}</div>
        <div class="mt-5 msg">{{ msg }}</div>
        <div class="btn_box share mt-40" @click="share">分享</div>
        <div @click="back()" class="btn_box continue mt-20">继续测试</div>
      </div>
    </van-dialog>

    <van-overlay :show="layShow" @click="layShow = false" z-index="10000">
      <van-image
        :src="require('@@/img/wxShare.jpg')"
        width="100%"
        fit="contain"
      ></van-image>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import wx from "weixin-js-sdk";

const router = useRouter();
const route = useRoute();
const api = inject("api");
const show = ref(true);
const layShow = ref(false); //遮罩显示
const msg = "过了这级，去吃点好的慰劳一下自己";
onBeforeMount(() => {
  api
    .getWechatJssdk({
      url: sessionStorage.getItem("wxShare"),
    })
    .then(async (res) => {
      let wx_config = res.data;
      await wx.config({
        debug: false,
        appId: wx_config.appId, // 必填，公众号的唯一标识
        timestamp: wx_config.timestamp, // 必填，生成签名的时间戳
        nonceStr: wx_config.nonceStr, // 必填，生成签名的随机串
        signature: wx_config.signature, // 必填，签名
        jsApiList: wx_config.jsApiList, // 必填，需要使用的JS接口列表
      });

      setTimeout(() => {
        wx.ready(() => {
          //朋友
          wx.updateAppMessageShareData({
            title: "昆明话测试", // 分享标题
            desc: "你的昆明话及格吗？快来测试一下你的水平吧", // 分享描述
            link: sessionStorage.getItem("wxShare"), // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl:
              "https://kmzsccfile.kmzscc.com/Uploads/common/kmhshare.jpg?x-oss-process=image/resize,m_fill,w_400",
            // 分享图标
            success: function () {
              // 设置成功
            },
          });
          //朋友圈
          wx.updateTimelineShareData({
            title: "昆明话测试", // 分享标题
            desc: "你的昆明话及格吗？快来测试一下你的水平吧", // 分享描述
            link: sessionStorage.getItem("wxShare"), // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl:
              "https://kmzsccfile.kmzscc.com/Uploads/common/kmhshare.jpg?x-oss-process=image/resize,m_fill,w_400",
            // 分享图标
            success: function () {
              // 设置成功
            },
          });
        });
      }, 300);
    });
});

function back() {
  router.push("./");
}

// 分享
function share() {
  if (!!window["JKEventHandler"]) {
    const jdk = window["JKEventHandler"];
    jdk.callNativeFunction(
      "share",
      {
        image:
          "https://kmzsccfile.kmzscc.com/Uploads/common/kmhshare.jpg?x-oss-process=image/resize,m_fill,w_400",
        url: sessionStorage
          .getItem("wxShare")
          .slice(sessionStorage.getItem("wxShare").indexOf("//") + 2),
        title: "昆明话测试",
        desc: "你的昆明话及格吗？快来测试一下你的水平吧",
        platform: 1,
      },
      function (data) {
        api.shareCount({ answer_id: route.query.shareId });
      }
    );
  }
  //微信分享
  let ua = navigator.userAgent.toLowerCase();
  let isWeixin = ua.indexOf("micromessenger") != -1;
  if (isWeixin) {
    layShow.value = true;
  }
}
</script>

<style lang="scss" scoped>
.content-box {
  .km-title {
    color: #1970ad;
    letter-spacing: 2px;
  }

  .dialog_back {
    background: url("~@@/img/back.png");
    background-size: 100% 100%;

    .msg {
      color: #318dcb;
    }

    .btn_box {
      padding: 8px 10px;
      border-radius: 35px;
      width: 80%;
      text-align: center;
    }

    .share {
      background: #f0f1f0;
      color: #898989;
    }

    .continue {
      background: #e3f4fd;
      color: #3b89be;
    }
  }
}

:deep(.van-overlay) {
  background: rgba(0, 0, 0, 0.45);
}
</style>
