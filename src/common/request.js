import axios from "axios";
import { showFailToast } from "vant";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

//进度条配置
//进度条颜色在app.vue
NProgress.configure({
  easing: "linear", // 动画方式
  speed: 800, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 500, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

axios.defaults.baseURL = process.env.VUE_APP_URL;
//设置超时时间
axios.defaults.timeout = 3 * 10000;

//request请求拦截器
axios.interceptors.request.use(
  async (config) => {
    NProgress.start();
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
