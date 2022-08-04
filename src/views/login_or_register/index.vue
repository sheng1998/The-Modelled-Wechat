<template>
  <div class="login-or-register flex-center" :class="type">
    <div class="dialog">
      <div class="header flex-center">
        <div class="title">
          {{ type === 'login' ? '登录' : '注册' }}
        </div>
        <div v-if="type === 'register'" class="avatar">
          <img src="@/assets/img/avatar.png" alt="头像">
          <div class="change-avatar flex">
            更换头像
          </div>
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
      flex-direction: column;
      height: 32%;
      .title {
        font-weight: 900;
        font-size: 28px;
      }
      .avatar {
        position: relative;
        width: 80px;
        height: 80px;
        margin-top: 20px;
        border-radius: 50%;
        background-color: $pink;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
        .change-avatar {
          position: absolute;
          bottom: 0;
          left: 0;
          justify-content: center;
          width: 100%;
          height: 28px;
          padding-top: 5px;
          font-size: 12px;
          background-color: rgba($color: $blue, $alpha: 0.3);
        }
      }
    }
    .form {
      .input-wrap {
        position: relative;
        width: 100%;
        + .input-wrap {
          margin-top: 28px;
        }
        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          @include backgroundImage(right);
          content: '';
        }
      }
      input {
        width: 100%;
        border: none;
        outline:none;
        padding: 10px;
      }
      .password {
        :deep(.el-icon) {
          position: absolute;
          right: 10px;
          top:50%;
          transform:translateY(-50%);
          cursor: pointer;
        }
      }
      button {
        width: 100%;
        height: 36px;
        margin-top: 52px;
        border-radius: 8px;
        border: none;
        outline:none;
        letter-spacing: 6px;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        @include backgroundImage(right);
        cursor: pointer;
      }
    }
    .footer {
      margin-top: 24px;
      .to-register,
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
  &.register {
    .dialog .form {
      margin-top: 20px;
    }
  }
}
</style>
