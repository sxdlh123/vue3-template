<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in" appear>
      <component :is="Component" :key="$route.name" />
    </transition>
  </router-view>
</template>

<script setup>
import api from "@/api/api";
import { provide } from "vue";
provide("api", api);
</script>
<style lang="scss">
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-15px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(15px);
}
</style>
