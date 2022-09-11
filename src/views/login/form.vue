<template>
  <div class="form">
    <ValidatorInput
      ref="usernameRef"
      v-model="username.value"
      placeholder="用户名"
      :maxlength="15"
      :rules="username.rules"
      auto-focus
      @keyup-enter="submit"
    />
    <ValidatorInput
      ref="passwordRef"
      v-model="password.value"
      type="password"
      placeholder="密码"
      :maxlength="30"
      :rules="password.rules"
      @keyup-enter="submit"
    />
    <ValidatorInput
      v-if="type === 'register'"
      ref="password2Ref"
      v-model="password.value2"
      type="password"
      placeholder="再次输入密码"
      :rules="password.rules2"
      @keyup-enter="submit"
    />
    <button @click="submit">
      {{ type === 'register' ? '注册' : '登录' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, ref } from 'vue';
import { ElMessage, MessageHandler } from 'element-plus';
import ValidatorInput from './validator_input.vue';
import handleUsername from './handle_username';
import handlePassword from './handle_password';

const props = defineProps({
  type: {
    type: String as PropType<'login' | 'register'>,
    default: 'login',
  },
});
const emit = defineEmits(['login', 'register']);

const usernameRef = ref<any>(null);
const passwordRef = ref<any>(null);
const password2Ref = ref<any>(null);
const username = reactive(handleUsername(props.type));
const password = reactive(handlePassword(props.type));

// 用来记录ElMessage对象的（关闭的时候需要）
const messageTip = ref<MessageHandler | null>(null);

// 表单提交
const submit = () => {
  const key = props.type;
  // 校验用户名
  usernameRef.value?.check();
  // 校验密码
  passwordRef.value?.check();
  let errorTip = usernameRef.value?.errorTip || passwordRef.value?.errorTip;
  // 注册时候还需要校验密码2
  if (key === 'register') {
    password2Ref.value?.check();
    errorTip = errorTip || password2Ref.value?.errorTip;
  }
  if (errorTip) {
    messageTip.value?.close?.();
    messageTip.value = ElMessage.error(errorTip);
    return;
  }
  emit(key, username.value, password.encrypt(password.value));
};

// 设置错误信息
const setErrorTip = (key: 'username' | 'password', message: string) => {
  const input = key === 'password' ? passwordRef.value : usernameRef.value;
  input?.setErrorTip?.(message);
};

defineExpose({ setErrorTip });
</script>

<style lang="scss" scoped>
@import './common.scss';
.form {
  .validator-input + .validator-input {
    margin-top: 28px;
  }
  button {
    width: 100%;
    height: 36px;
    margin-top: 52px;
    border-radius: 8px;
    border: none;
    outline: none;
    letter-spacing: 6px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    @include backgroundImage(right);
    cursor: pointer;
  }
}
</style>
