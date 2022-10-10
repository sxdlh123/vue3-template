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

export default userInfo;
