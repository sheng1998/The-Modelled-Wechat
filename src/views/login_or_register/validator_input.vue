<template>
  <div class="validator-input" :class="{ error: errorTip, password: type === 'password' }">
    <input
      ref="inputRef"
      v-model="keyword"
      :type="inputType"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @blur="check('blur')"
      @change="check('change')"
      @focus="check('focus')"
      @input="check('input')"
      @keyup.enter="$emit('keyup-enter')"
    >
    <div v-if="errorTip" class="error-tip">
      {{ errorTip }}
    </div>
    <el-icon v-if="type === 'password'" @click="toggleShowPassword">
      <View v-if="passwordVisible" />
      <Hide v-else />
    </el-icon>
  </div>
</template>

<script setup lang='ts'>
import {
  computed, onMounted, PropType, ref,
} from 'vue';
import { ElIcon } from 'element-plus';
import { View, Hide } from '@element-plus/icons-vue';
import validator from '@/utils/validator';
import { TTrigger, TTriggerRule } from './type';

const inputRef = ref<any>(null);

const props = defineProps({
  maxlength: {
    type: Number,
    default: Infinity,
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String as PropType<'text' | 'password'>,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rules: {
    type: Array as PropType<TTriggerRule[]>,
    default: () => [],
  },
});

const emits = defineEmits(['blur', 'change', 'focus', 'input', 'update:modelValue', 'keyup-enter']);

const keyword = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', value);
  },
});
// 输入框的类型（text\password）
const inputType = ref(props.type);
// 错误提示语
const errorTip = ref('');
// 密码可视化
const passwordVisible = ref(false);

// 校验规则
const rules = {
  blur: props.rules.filter((rule) => rule.trigger === 'blur'),
  focus: props.rules.filter((rule) => rule.trigger === 'focus'),
  input: props.rules.filter((rule) => rule.trigger === 'input'),
  change: props.rules.filter((rule) => rule.trigger === 'change'),
};

// 密码框切换显示状态
const toggleShowPassword = () => {
  passwordVisible.value = !passwordVisible.value;
  inputType.value = passwordVisible.value ? 'text' : 'password';
};

// 参数校验
const check = (key?: TTrigger) => {
  let isError = '';
  const checkRules = key ? rules[key] : props.rules;
  for (let i = 0; i < checkRules.length; i += 1) {
    const rule = checkRules[i];
    isError = validator(rule, keyword.value) || '';
    if (isError) break;
  }
  errorTip.value = isError;
};

const focus = () => {
  inputRef.value?.focus?.();
};

// 设置错误信息
const setErrorTip = (message: string) => {
  errorTip.value = message;
};

defineExpose({
  errorTip, check, setErrorTip, focus,
});

onMounted(() => {
  if (props.autoFocus) {
    focus();
  }
});
</script>

<style lang="scss" scoped>
@import './common.scss';
.validator-input {
  position: relative;
  width: 100%;
  input {
    width: 100%;
    border: none;
    outline:none;
    padding: 10px;
  }
  &.password {
    :deep(.el-icon) {
      position: absolute;
      right: 10px;
      top:50%;
      transform:translateY(-50%);
      cursor: pointer;
    }
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
  .error-tip {
    position: absolute;
    bottom: -20px;
    left: 10px;
    font-size: 14px;
    color: red;
  }
}
</style>
