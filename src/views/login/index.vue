<template>
  <div class="login-or-register flex-center" :class="type">
    <div class="dialog">
      <div class="header flex-center">
        <div class="title">
          {{ type === 'login' ? '登录' : '注册' }}
        </div>
      </div>
      <InputForm
        ref="inputFromRef"
        :key="type"
        :type="type"
        @login="login"
        @register="register"
      ></InputForm>
      <div class="footer flex-center">
        <div v-if="type === 'login'">
          <span>没有账号？</span>
          <span
            class="change-type to-register"
            @click="changeType('register')"
            @mousedown="mousedown"
          >去注册</span>
        </div>
        <div v-else>
          <span>已有账号。</span>
          <span
            class="change-type to-login"
            @click="changeType('login')"
            @mousedown="mousedown"
          >去登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import mergeQuery from '@/utils/merge_query';
import request from '@/server';
import InputForm from './form.vue';
import { useUserStore } from '@/store/user';

const inputFromRef = ref<any>(null);
const route = useRoute();
const router = useRouter();
// 用户的状态信息
const userStore = useUserStore();

const type = ref<'login' | 'register'>(route.query.type === 'register' ? 'register' : 'login');

// 阻止点击去注册\去登录时的默认行为，防止输入框失焦
const mousedown = (e: Event) => {
  e.preventDefault();
  return false;
};

const changeType = (value: 'login' | 'register') => {
  type.value = value;
  router.replace({ query: mergeQuery(route.query, { type: value }) });
};

const login = (username: string, password: string) => {
  request.post('/user/login', { username, password }).then((res) => {
    userStore.setUserInfo(res.data.data);
    ElMessage.success('登陆成功！');
    router.replace({ name: 'Home' });
  }, (error) => {
    handleResponseError(error);
  });
};

const register = (username: string, password: string) => {
  request.post('/user/register', { username, password }).then((res) => {
    userStore.setUserInfo(res.data.data);
    ElMessage.success('注册成功，将自动登录并跳转首页！');
    router.replace({ name: 'Home' });
  }, (error) => {
    handleResponseError(error);
  });
};

const handleResponseError = (error?: { data: { type: 'username' | 'password' }, message: string}) => {
  if (!error || !error.data?.type) return;
  inputFromRef.value?.setErrorTip(error.data.type, error.message);
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
