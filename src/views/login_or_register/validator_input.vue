<template>
  <div class="validator-input" :class="{ error: errorTip, password: type === 'password' }">
    <input
      v-model="keyword"
      :type="inputType"
      :placeholder="placeholder"
      @blur="check('blur')"
      @change="check('change')"
      @focus="check('focus')"
      @input="check('input')"
    >
    <div v-if="errorTip" class="error-tip">
      {{ errorTip }}
    </div>
    <el-icon v-if="type === 'password'" @click="toggleShowPassword">
      <Hide v-if="passwordVisible" />
      <View v-else />
    </el-icon>
  </div>
</template>

<script setup lang='ts'>
import { computed, PropType, ref } from 'vue';
import { ElIcon } from 'element-plus';
import { View, Hide } from '@element-plus/icons-vue';
import validator, { TRule } from '@/utils/validator';

type TTrigger = 'blur' | 'focus' | 'input' | 'change';
interface TTriggerRule extends TRule {
  trigger: TTrigger;
}

const props = defineProps({
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

const emits = defineEmits(['blur', 'change', 'focus', 'input', 'update:modelValue']);

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
const check = (key: TTrigger) => {
  for (let i = 0; i < rules[key].length; i += 1) {
    const rule = rules[key][i];
    errorTip.value = validator(rule, keyword.value) || '';
    if (errorTip.value) break;
  }
};
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
