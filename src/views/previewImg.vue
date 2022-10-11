<template>
  <div class="content">
    <van-button @click="back()">返回</van-button>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, onMounted, ref } from "vue";
import { showImagePreview } from "vant";
const route = useRoute();
const router = useRouter();
onMounted(() => {
  // showImagePreview([route.query.url]);
});

function back() {
  router.replace("./");
}
</script>
<style lang="scss" scoped></style>
<style scoped>
body {
  transform-origin: 0 0;
  transform: none !important;
}
</style>
