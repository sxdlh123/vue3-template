import axios from "axios";
import { showFailToast } from "vant";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import api from "@/api/api";
import Vrouter from "@/router";
import headQuery from "@/store/head-query";

//进度条配置
//进度条颜色在app.vue
NProgress.configure({
  easing: "linear", // 动画方式
  speed: 800, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 500, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

const route = Vrouter.currentRoute; //路由参数
axios.defaults.baseURL = process.env.VUE_APP_URL;
//设置超时时间
axios.defaults.timeout = 3 * 10000;

//request请求拦截器
axios.interceptors.request.use(
  async (config) => {
    NProgress.start();
    //判断是否携带请求参数，如果没有，就去请求配置
    const query = headQuery();
    if (
      query.noncestr.length < 1 &&
      config.url !== "/addons_admin_api/answer/site/get_config"
    ) {
      const res = await api.get_config({
        // FDSL5qqv0DTnjQEn,QFCfLawViLm3VWCU
        site_id: route.value.query.ankey || "QFCfLawViLm3VWCU",
      });
      await query.setInfo(res);
      config.headers["appid"] = query["appid"];
      config.headers["timestamp"] = query["timestamp"];
      config.headers["encrypt"] = query["encrypt"];
      config.headers["token"] = query["token"];
      config.headers["noncestr"] = query["noncestr"];
    } else if (query.noncestr.length > 0) {
      //设置请求参数
      config.headers["appid"] = query["appid"];
      config.headers["timestamp"] = query["timestamp"];
      config.headers["encrypt"] = query["encrypt"];
      config.headers["token"] = query["token"];
      config.headers["noncestr"] = query["noncestr"];
    }

    return config;
  },
  (error) => {
    NProgress.start();
    Promise.reject(error);
  }
);
//response响应拦截器
axios.interceptors.response.use(
  (config) => {
    NProgress.done();
    let res = config.data;
    if (res.code === 400 || res.code === 2 || res.code === 1) {
      showFailToast(res.message);
      return false;
    } else {
      return config.data;
    }
  },
  (error) => {
    NProgress.done();

    console.log(error);
    showFailToast("数据获取失败");
    return Promise.reject(error);
  }
);

export default axios;
