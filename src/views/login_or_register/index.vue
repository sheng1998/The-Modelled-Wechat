<template>
  <div class="login-or-register flex-center" :class="type">
    <div class="dialog">
      <div class="header flex-center">
        <div class="title">
          {{ type === 'login' ? '登录' : '注册' }}
        </div>
      </div>
      <InputForm :type="type"></InputForm>
      <div class="footer flex-center">
        <div v-if="type === 'login'">
          <span>没有账号？</span>
          <span class="change-type to-register" @click="changeType('register')">去注册</span>
        </div>
        <div v-else>
          <span>已有账号。</span>
          <span class="change-type to-login" @click="changeType('login')">去登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import InputForm from './form.vue';

const type = ref<'login' | 'register'>('login');
const changeType = (value: 'login' | 'register') => {
  // TODO 切换路由query
  type.value = value;
};
</script>

<style lang="scss" scoped>
@import './common.scss';
.login-or-register {
  width: 100%;
  height: 100%;
  @include backgroundImage();
  .dialog {
    width: 360px;
    height: 500px;
    padding: 24px;
    background-color: #fff;
    border-radius: 16px;
    .header {
      height: 32%;
      .title {
        font-weight: 900;
        font-size: 28px;
      }
    }
    .footer {
      margin-top: 24px;
      .change-type  {
        display: inline-block;
        padding-bottom: 1px;
        cursor: pointer;
        border-bottom: 1px solid;
        user-select: none;
      }
      .to-register {
        color: $pink;
        border-bottom-color: $pink;
      }
      .to-login {
        color: $blue;
        border-bottom-color: $blue;
      }
    }
  }
}
</style>
