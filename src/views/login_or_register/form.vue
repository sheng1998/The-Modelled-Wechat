<template>
  <div class="form">
    <div class="input-wrap">
      <input v-model="username" type="text" placeholder="用户名">
    </div>
    <div class="password input-wrap">
      <input v-model="password" :type="passwordVisible ? 'text' : 'password'" placeholder="密码">
      <el-icon @click="passwordVisible = !passwordVisible">
        <Hide v-if="passwordVisible" />
        <View v-else />
      </el-icon>
    </div>
    <button v-if="type === 'login'">
      登录
    </button>
    <button v-else>
      注册
    </button>
  </div>
</template>

<script setup lang='ts'>
import { View, Hide } from '@element-plus/icons-vue';
import { PropType } from 'vue';

defineProps({
  type: String as PropType<'login' | 'register'>,
});

const username = ref('');
const password = ref('');
const passwordVisible = ref(false);
/**
 * TODO 校验账号密码
 * 1、区分登录还是注册
 * 2、登录时候只需要校验不为空
 * 3、注册时校验账号（2-15位数，禁止斜杠和空格）和密码（看接口的要求）是否符合要求
 * 4、失去焦点在输入框下面红字提示
 * 5、点击按钮时候也校验同时还给出ElMessage提示
 */
</script>

<style lang="scss" scoped>
@import './common.scss';
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
</style>
