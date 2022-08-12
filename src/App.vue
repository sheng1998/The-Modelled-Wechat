<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import request from './server';

const route = useRoute();
const router = useRouter();

// 校验登录状态
request.get('/login/check').catch(() => {
  if (route.name === 'Login') return;
  router.replace({ name: 'Login' });
});
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
