<!--题目详情-->
<template>
  <div class="content-box u-flex-column">
    <van-nav-bar fixed placeholder>
      <template #left>
        <van-image
          :src="require('@@/img/fish_arrow.png')"
          width="9"
          @click="$router.push('./')"
        ></van-image>
      </template>
      <template #title>
        <span class="km-title">{{ route.query.title }}</span>
      </template>
      <template #right>
        <van-image
          :src="require('@@/img/three_right.png')"
          width="18"
        ></van-image>
      </template>
    </van-nav-bar>

    <div class="content p-15 overflow-y width100">
      <van-skeleton title :row="8" :loading="loading" class="width100">
        <div class="width100 u-flex-column">
          <!--      进度条-->
          <div class="tip">
            <span class="tip_start">{{ active + 1 }}</span>
            <span class="gray font-10">/</span>
            <span class="gray font-14">{{ queList.length }}</span>
          </div>

          <van-progress
            class="width100"
            :percentage="((active + 1) / queList.length) * 100"
            :show-pivot="false"
            color="linear-gradient(to right, #56B9FF, #1970AD)"
          />
          <!--      题目-->
          <transition name="van-fade">
            <div v-if="queLoading" class="width100">
              <div class="font-14 font-bold que_title mt-10">
                {{ active + 1 }}.{{ queList[active].question }}
              </div>

              <div class="mt-10">
                <div
                  :class="setClass(queList[active], index + 1)"
                  class="que_answer width100 mb-15 font-15 u-flex u-row-between"
                  v-for="(item, index) in queList[active][
                    'question_answer_list'
                  ]"
                  :key="item"
                  @click="answer(queList[active], index + 1)"
                >
                  <div>{{ item }}</div>
                  <van-image
                    v-if="queList[active].status"
                    :src="setImg(queList[active], index + 1)"
                    width="25"
                  >
                    <template #error>加载失败</template>
                  </van-image>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </van-skeleton>
    </div>

    <!--          下一题-->
    <transition name="van-fade">
      <div class="u-flex-column" @click="next()" v-if="!loading">
        <span class="font-20" v-if="queList[active].answer.length > 0">{{
          active + 1 === queList.length ? "提交" : "下一题"
        }}</span>
        <div
          v-if="queList[active].answer.length > 0"
          class="next_arrow mt-10 u-flex-column u-row-center"
        >
          <van-image
            width="30"
            :src="require('@@/img/right_arrow.png')"
          ></van-image>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import userInfo from "@/store/user";
import { inject, onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
const user = userInfo();
const api = inject("api");
const route = useRoute();
const router = useRouter();
const _time = ref(null); //计时器

const loading = ref(true);
const queLoading = ref(true);
const isSumbit = ref(false); //正在提交
const queList = ref({}); //题目列表
const userAnswer = ref([]); //用户答案
const answer_info = reactive({
  cost_time: 1, //时间
  score: 0, // 得分
});
const active = ref(0); //当前题目
const rightPng = require("@@/img/right.png"); //正确图
const errPng = require("@@/img/error.png"); //错误图

onBeforeMount(() => {
  getDate();
  setTime();
});

//计时器
function setTime() {
  _time.value = setInterval(() => {
    answer_info.cost_time += 1;
  }, 1000);
}
//获取答题信息
function getDate() {
  api
    .question_list({ test_paper_id: route.query.test_paper_id, uid: user.uid })
    .then((res) => {
      queList.value = res.data.question_list;
      //解密数据
      res.data.question_list.forEach((el) => {
        const decrypt = user.decrypt(el["right_anser"]);
        el.decrypt = decrypt.split("_")[1]; //正确答案
        el.status = false; //是否点提交
      });
      setTimeout(() => {
        loading.value = false;
        //埋点
        window.loggerCallback({
          event_type: "cat_click",
          event_value: route.query.test_paper_id,
          topic: "cat",
          route_referer: document.referrer,
          route_type: "questions",
          route_value: route.query.test_paper_id,
        });
      }, 1000);
    });
}

//确定选择
function answer(res, index) {
  if (!res.status) {
    res.answer = index.toString();
  }
}

//设置样式
function setClass(item, index) {
  // 检查提交状态
  if (!item.status) {
    if (item.answer == index) {
      return "answer_confirm";
    }
  }
  //在提交状态
  else {
    const right_answer = item.decrypt;
    //如果正确答案一样
    if (right_answer == index && item.answer == index) {
      return "answer_confirm";
    }
    //如果正确答案不一样
    if (right_answer !== index && item.answer == index) {
      return "answer_error";
    }
    //赋值正确答案
    if (right_answer == index) {
      return "answer_confirm";
    }
  }
}
//设置图片
function setImg(item, index) {
  const right_answer = item.decrypt;
  //如果正确答案一样
  if (right_answer == index && item.answer == index) {
    return rightPng;
  }
  //如果正确答案不一样
  if (right_answer !== index && item.answer == index) {
    return errPng;
  }
  //赋值正确答案
  if (right_answer == index) {
    return rightPng;
  }
}
// 下一题
function next() {
  if (isSumbit.value) return false;
  isSumbit.value = true;
  queList.value[active.value].status = true;
  //赋值选项
  const res = queList.value[active.value];
  userAnswer.value.push({
    answer: res.answer,
    answer_id: res.answer_id,
    id: res.id,
    is_answer: 1,
    is_right: res.decrypt == res.answer ? 1 : 0,
    question_id: res.question_id,
    record_id: res.record_id,
    score: res.decrypt == res.answer ? res.score : 0,
    test_paper_id: route.query.test_paper_id,
    update_time: new Date().getTime(),
  });
  //计算分数
  if (res.decrypt == res.answer) {
    answer_info.score += res.score;
  }
  //下一题
  if (active.value + 1 !== queList.value.length) {
    return setTimeout(() => {
      queLoading.value = false;
      active.value += 1;
      setTimeout(() => {
        queLoading.value = true;
        isSumbit.value = false;
      }, 300);
    }, 1000);
  }
  //提交
  else {
    const params = {
      answer_id: queList.value[0].answer_id,

      data: JSON.stringify({
        list: userAnswer.value,
        answer_info: answer_info,
      }),
    };
    isSumbit.value = false;
    api.submit_test_paper_all(params).then((res) => {
      // 提交埋点
      window.loggerCallback({
        event_type: "cat_click",
        event_value: queList.value[0].answer_id,
        topic: "cat",
        route_referer: document.referrer,
        route_type: "submitQuestion",
        route_value: queList.value[0].answer_id,
      });
      showToast({
        message: "提交成功",
        duration: 1500,
        forbidClick: true,
        onClose: () => {
          router.replace({
            path: "/result",
            query: {
              id: 234,
              shareId: queList.value[0].answer_id,
              score: answer_info.score,
            },
          });
        },
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.content-box {
  background: url("~@@/img/back.png");
  background-size: 100% 100%;
  .km-title {
    color: #1970ad;
    letter-spacing: 2px;
  }
  .tip {
    align-self: flex-end;
    .tip_start {
      color: #1970ad;
    }
  }

  .content {
    background: #ffffff;
    height: 60vh;
    margin: 40px 10px 25px;
    box-shadow: 0 0 13px 0 rgba(0, 0, 0, 0.18);
  }
  .que_title {
    line-height: 22px;
  }
  .que_answer {
    background: #f0f1f0;
    border-radius: 15px;
    color: #898989;
    transition: all 0.5s ease;
    border: 1px solid #f0f1f0;
    padding: 15px 10px;
  }
  //确定
  .answer_confirm {
    background: #e3f4fd;
    border: 1px solid #3b89be;
    color: #3b89be;
  }
  //错误
  .answer_error {
    background: #fdd5cc;
    border: 1px solid #fd6c4d;
    color: #fd6c4d;
  }
  .next_arrow {
    width: 50px;
    height: 50px;
    background: #66e842;
    border-radius: 35px;
  }
  //关闭错误图片
  :deep(.van-image__loading) {
    display: none;
  }
}
</style>
