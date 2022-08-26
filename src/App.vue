<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const route = useRoute();
const router = useRouter();
// 用户的状态信息
const userStore = useUserStore();

// 非登录页面要检查登录状态
if (route.name !== 'Login') {
  userStore.checkLogin(router);
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
