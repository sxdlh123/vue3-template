import { defineStore } from "pinia";
import { Image } from "vant";

const load = defineStore("load", {
  state: () => {
    return {
      nowLoad: 0,
      sum: 14,
    };
  },
  getters: {
    //初始的两张背景图片
    createdImg(state) {
      let img1 = new Image();
      img1.src = require("@@/img/back.png");
      img1.onLoad = () => {
        state.nowLoad += 1;
      };
      let img2 = new Image();
      img2.src = require("@@/img/street_back.png");
      img2.onLoad = () => {
        state.nowLoad += 1;
      };
    },
    //街道图
    loadImg(state) {
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          let image = new Image();
          image.src = `https://kmzsccfile.kmzscc.com/Uploads/common/painting/id_${i}.jpg`;
          image.onload = () => {
            state.nowLoad += 1;
          };
        }, 350);
      }
    },
  },
});
export default load;
