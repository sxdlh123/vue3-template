import { defineStore } from "pinia";
import api from "@/api/api";
import { showToast } from "vant";

const SM4 = require("gm-crypt").sm4;
let sm4Config = {
  key: "kmrbzscckbitjszx",
  mode: "ecb",
  cipherType: "base64",
};
let sm4 = new SM4(sm4Config);

const userInfo = defineStore("user", {
  state: () => {
    return {
      test_paper_id: 104,
      uid: 1210,
      answer_id: 0,
    };
  },
  actions: {
    //解密数据
    decrypt(res) {
      return sm4.decrypt(res);
    },
    //获取uid
    get_uid(params) {
      api.add_group_user(params).then((res) => {
        this.uid = res.data.id;
      });
    },
  },
  persist: {
    enabled: true,
  },
});

export default userInfo;
