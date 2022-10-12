import { defineStore } from "pinia";
const userInfo = defineStore("user", {
  state: () => {
    return {
      id: "",
      name: "",
    };
  },
  actions: {},
  persist: {
    enabled: true,
  },
});
// persist: {
//   enabled: true,
//       strategies: [
//     { storage: sessionStorage, paths: ['firstName', 'lastName'] }, // firstName 和 lastName字段用sessionStorage存储
//     { storage: localStorage, paths: ['accessToken'] }, // accessToken字段用 localstorage存储
//   ],
export default userInfo;
