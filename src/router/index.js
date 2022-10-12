import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    name: "首页",
    component: () => import("@/views/index"),
  },
  {
    path: "/previewImg",
    name: "简介",
    component: () => import("@/views/previewImg"),
  },
  {
    path: "/video",
    name: "视频",
    component: () => import("@/views/video"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
