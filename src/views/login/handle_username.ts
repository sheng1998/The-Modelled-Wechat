import { computed, ref } from 'vue';
import { TTriggerRule } from './type';

export default function (type: 'login' | 'register') {
  const value = ref('');
  // 用户名的校验规则
  const rules = computed<TTriggerRule[]>(() => {
    if (type === 'login') {
      // 登录时只需要验证用户名不为空
      return [{ required: true, message: '请输入用户名！', trigger: 'blur' }];
    }
    return [
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
  });

  return { value, rules };
}
