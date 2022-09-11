<!-- 历史版本，暂时留着 -->
<template>
  <div class="form">
    <div class="input-wrap">
      <input v-model="username" type="text" placeholder="用户名" @input="checkUsername" />
      <div v-if="usernameErrorTip" class="error-tip">
        {{ usernameErrorTip }}
      </div>
    </div>
    <div class="password input-wrap">
      <input
        v-model="password"
        :type="passwordVisible ? 'text' : 'password'"
        placeholder="密码"
        @input="passwordChange"
      />
      <div v-if="passwordErrorTip" class="error-tip">
        {{ passwordErrorTip }}
      </div>
      <el-icon @click="passwordVisible = !passwordVisible">
        <Hide v-if="passwordVisible" />
        <View v-else />
      </el-icon>
    </div>
    <div v-if="type === 'register'" class="password password-again input-wrap">
      <input
        v-model="password2"
        :type="passwordVisible ? 'text' : 'password'"
        placeholder="再次输入密码"
        @input="checkPasswordSame"
      />
      <div v-if="password2ErrorTip" class="error-tip">
        {{ password2ErrorTip }}
      </div>
      <el-icon @click="passwordVisible = !passwordVisible">
        <Hide v-if="passwordVisible" />
        <View v-else />
      </el-icon>
    </div>
    <button v-if="type === 'login'" @click="toLogin">登录</button>
    <button v-else @click="toRegister">注册</button>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { ElIcon, ElMessage } from 'element-plus';
import { View, Hide } from '@element-plus/icons-vue';

const props = defineProps({
  type: String as PropType<'login' | 'register'>,
});
const emit = defineEmits(['login', 'register']);

const username = ref('');
const usernameErrorTip = ref('');
const password = ref('');
const passwordErrorTip = ref('');
const password2 = ref('');
const password2ErrorTip = ref('');
const passwordVisible = ref(false);

const messageTip = ref<any>(null);

// 校验用户名
const checkUsername = () => {
  let errorTip = '';
  if (!username.value) {
    errorTip = '请输入用户名！';
  } else if (/\s+/.test(username.value)) {
    errorTip = '用户名禁止携带空格！';
  } else if (username.value.length < 2 || username.value.length > 15) {
    errorTip = '用户名长度限制在2-15字符之间！';
  } else if (/[\\/]+/.test(username.value)) {
    errorTip = '用户名禁止携带斜杠！';
  }
  if (errorTip) {
    usernameErrorTip.value = errorTip;
    return false;
  }
  usernameErrorTip.value = '';
  return true;
};

// 校验密码是否符合要求
const checkPassword = () => {
  let errorTip = '';
  if (!password.value) {
    errorTip = '请输入密码！';
  } else if (/\s+/.test(password.value)) {
    errorTip = '密码禁止携带空格！';
  } else if (/[‘’“”，。、；：？！【】《》（）\u4e00-\u9fa0]/.test(password.value)) {
    errorTip = '密码禁止含有中文或中文字符！';
  } else if (password.value.length < 8 || password.value.length > 30) {
    errorTip = '密码长度限制在8-30字符之间！';
  } else if (/[\\/]/.test(password.value)) {
    errorTip = '密码禁止携带斜杠或括号！';
  } else if (!/([a-z].?\d)|(\d.?[a-z])/i.test(password.value)) {
    errorTip = '密码必需含有字母和数字！';
  }
  if (errorTip) {
    passwordErrorTip.value = errorTip;
    return false;
  }
  passwordErrorTip.value = '';
  return true;
};

// 校验密码一致性
const checkPasswordSame = () => {
  if (!password2.value) {
    password2ErrorTip.value = '请再次输入密码！';
    return false;
  }
  password2ErrorTip.value = password.value === password2.value ? '' : '两次输入密码不一致！';
  return password.value === password2.value;
};

const passwordChange = () => {
  checkPassword();
  if (props.type === 'login' || !password2.value) return;
  checkPasswordSame();
};

const toLogin = () => {
  checkUsername();
  checkPassword();
  const message = usernameErrorTip.value || passwordErrorTip.value;
  if (message) {
    messageTip.value?.close?.();
    messageTip.value = ElMessage.error(message);
    return;
  }
  emit('login', username.value, password.value);
};

const toRegister = () => {
  checkUsername();
  checkPassword();
  checkPasswordSame();
  const message = usernameErrorTip.value || passwordErrorTip.value || password2ErrorTip.value;
  if (message) {
    messageTip.value?.close?.();
    messageTip.value = ElMessage.error(message);
    return;
  }
  emit('register', username.value, password.value);
};

watch(
  () => props.type,
  () => {
    usernameErrorTip.value = '';
    passwordErrorTip.value = '';
    password2ErrorTip.value = '';
    passwordVisible.value = false;
    messageTip.value?.close?.();
  },
);
</script>

<style lang="scss" scoped>
@import './common';
.form {
  .input-wrap {
    position: relative;
    width: 100%;
    + .input-wrap {
      margin-top: 28px;
    }
    &::after {
      @include backgroundImage(right);

      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      content: '';
    }
    .error-tip {
      position: absolute;
      bottom: -20px;
      left: 10px;
      font-size: 14px;
      color: red;
    }
  }
  input {
    width: 100%;
    padding: 10px;
    border: none;
    outline: none;
  }
  .password {
    :deep(.el-icon) {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
  button {
    @include backgroundImage(right);

    width: 100%;
    height: 36px;
    margin-top: 52px;
    font-size: 16px;
    color: #fff;
    border: none;
    border-radius: 8px;
    outline: none;
    letter-spacing: 6px;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
