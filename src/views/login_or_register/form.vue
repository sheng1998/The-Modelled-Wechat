<template>
  <div class="form">
    <ValidatorInput
      ref="usernameInputRef"
      v-model="username"
      placeholder="用户名"
      :rules="usernameRules"
    />
    <ValidatorInput
      ref="passwordInputRef"
      v-model="password"
      type="password"
      placeholder="密码"
      :rules="passwordRules"
    />
    <ValidatorInput
      v-if="type === 'register'"
      ref="password2InputRef"
      v-model="password2"
      type="password"
      placeholder="再次输入密码"
      :rules="password2Rules"
    />
    <button v-if="type === 'login'" @click="submit('login')">
      登录
    </button>
    <button v-else @click="submit('register')">
      注册
    </button>
  </div>
</template>

<script setup lang='ts'>
import { PropType, ref } from 'vue';
import { ElMessage, MessageHandler } from 'element-plus';
import { TRule } from '@/utils/validator';
import ValidatorInput from './validator_input.vue';

interface TTriggerRule extends TRule {
  trigger: 'blur' | 'focus' | 'input' | 'change';
}

defineProps({ type: String as PropType<'login' | 'register'> });
const emit = defineEmits(['login', 'register']);

// 用户名输入框的ref对象
const usernameInputRef = ref<any>(null);
const username = ref('');
// 用户名的校验规则
const usernameRules: TTriggerRule[] = [
  { required: true, message: '请输入用户名！', trigger: 'blur' },
  {
    regular: /\s+/, reverse: true, message: '用户名禁止携带空格！', trigger: 'blur',
  },
  {
    min: 2, max: 15, message: '用户名长度限制在2-15字符之间！', trigger: 'blur',
  },
  {
    regular: /[\\/]/, reverse: true, message: '用户名禁止携带斜杠！', trigger: 'blur',
  },
];

// 密码输入框的ref对象
const passwordInputRef = ref<any>(null);
// 再次输入密码输入框的ref对象
const password2InputRef = ref<any>(null);
const password = ref('');
// 密码校验规则
const passwordRules: TTriggerRule[] = [
  { required: true, message: '请输入密码！', trigger: 'blur' },
  {
    regular: /\s+/, reverse: true, message: '密码禁止携带空格！', trigger: 'blur',
  },
  {
    regular: /[‘’“”，。、；：？！【】《》（）\u4e00-\u9fa0]/, reverse: true, message: '密码禁止携带中文或中文字符！', trigger: 'blur',
  },
  {
    min: 8, max: 30, message: '密码长度限制在8-30字符之间！', trigger: 'blur',
  },
  {
    regular: /[\\/]/, reverse: true, message: '密码禁止携带斜杠！', trigger: 'blur',
  },
  { regular: /([a-z].?\d)|(\d.?[a-z])/i, message: '密码必需含有字母和数字！', trigger: 'blur' },
];
const password2 = ref('');
// 再次输入密码的校验规则
const password2Rules: TTriggerRule[] = [
  { required: true, message: '请再次输入密码！', trigger: 'blur' },
  { method: (value) => value === password.value, message: '两次输入密码不一致！', trigger: 'blur' },
];

// 用来记录ElMessage对象的（关闭的时候需要）
const messageTip = ref<MessageHandler | null>(null);

// 表单提交
const submit = (key: 'login' | 'register') => {
  // 校验用户名
  usernameInputRef.value?.check();
  // 校验密码
  passwordInputRef.value?.check();
  let errorTip = usernameInputRef.value?.errorTip || passwordInputRef.value?.errorTip;
  // 注册时候还需要校验密码2
  if (key === 'register') {
    password2InputRef.value?.check();
    errorTip = errorTip || password2InputRef.value?.errorTip;
  }
  if (errorTip) {
    messageTip.value?.close?.();
    messageTip.value = ElMessage.error(errorTip);
    return;
  }
  emit(key, username.value, password.value);
};
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
