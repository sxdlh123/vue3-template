import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    name: "首页",
    component: () => import("@/views/index.vue"),
  },
  {
    path: "/answer-detail",
    name: "题目详情",
    component: () => import("@/views/answer-detail.vue"),
  },
  {
    path: "/result",
    name: "测试结果",
    component: () => import("@/views/result.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
