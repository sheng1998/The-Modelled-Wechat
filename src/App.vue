<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import request from './server';

const route = useRoute();
const router = useRouter();

// 非登录页面要检查登录状态（重定向登录页）
if (route.name !== 'Login') {
  // 校验登录状态
  request.get('/user/check').catch((error) => {
    if (error?.code === 1) {
      router.replace({ name: 'Login' });
    }
  });
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
