<template>
  <div class="content" ref="container">
    <van-image
      :src="route.query.url"
      class="showImg"
      height="100vw"
    ></van-image>

    <van-image
      :src="require('@@/img/img_back.png')"
      width="55"
      height="55"
      class="img_back"
      @click="back"
    ></van-image>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
const container = ref(null);
const route = useRoute();
const router = useRouter();
// onMounted(() => {
//   showImagePreview([route.query.url]);
// });

function back() {
  router.replace({ path: "./", query: { activity: "true" } });
}
</script>
<style lang="scss" scoped>
.content {
  position: relative;
}
.showImg {
  position: absolute;
}
.img_back {
  //position: fixed;
}
:deep(.van-image__img) {
  width: auto;
}
</style>
