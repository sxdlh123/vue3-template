import { defineStore } from "pinia";
import md5 from "md5";

const SM4 = require("gm-crypt").sm4;
let sm4Config = {
  key: "kmrbzscckbitjszx",
  mode: "ecb",
  cipherType: "base64",
};
let sm4 = new SM4(sm4Config);

const headQuery = defineStore("head", {
  state: () => {
    return {
      appid: "",
      timestamp: Math.round(new Date().valueOf() / 1000),
      encrypt: "",
      token: "",
      noncestr: "",
      urlKey: "", //原始加密
      // isGet: false, //判断是否在请求
    };
  },
  //方法
  actions: {
    //处理加密数据
    async setInfo(res) {
      if (!res) {
        return false;
      } else {
        this.urlKey = JSON.stringify(res.data);
        const str = `${sm4.decrypt(res.data)}`;
        const obj = JSON.parse(str)[0];
        this.appid = obj["app_id"];
        this.encrypt = md5(
          this.appid + obj["app_secret"] + this.timestamp + this.randomString()
        );
        this.token = "s";
        this.noncestr = this.randomString();
      }
    },
    //随机数
    randomString(len) {
      len = len || 32;
      const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      const maxPos = $chars.length;
      let pwd = "";
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
  },
  persist: {
    enabled: true,
  },
});

export default headQuery;
