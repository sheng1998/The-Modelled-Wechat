import { computed, ref } from 'vue';
import JSEncrypt from 'jsencrypt';
import { TTriggerRule } from './type';

export default function (type: 'login' | 'register') {
  const value = ref('');
  const value2 = ref('');
  // 密码校验规则
  const rules = computed<TTriggerRule[]>(() => {
    if (type === 'login') {
      // 登录时只需要验证密码不为空
      return [{ required: true, message: '请输入密码！', trigger: 'blur' }];
    }
    return [
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
  });
  // 再次输入密码的校验规则
  const rules2: TTriggerRule[] = [
    { required: true, message: '请再次输入密码！', trigger: 'blur' },
    { method: (data) => data === value.value, message: '两次输入密码不一致！', trigger: 'blur' },
  ];

  // 使用公钥加密数据
  const encrypt = (data: string): string => {
    const publicKey = '-----BEGIN PUBLIC KEY-----\n'
    + 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDN4PbNvbScu1F0ZO63fbKWg7P5\n'
    + 'mjE9LhfQdG4He8t2P5LIocGgsYk9z+Q94++C+b86KrYirRMEq0vANgS3nCHH7M9R\n'
    + 'dZHQ0e7Kyvp/eEKos7/thf4nTm52lg3ERT/tecyIPTrR1BJ0BEyd8i3i4WR/Ep7S\n'
    + 'RknuZknUHCP1EjIqsQIDAQAB\n'
    + '-----END PUBLIC KEY-----';
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(publicKey);
    return jsEncrypt.encrypt(data) as string;
  };

  return {
    value, value2, rules, rules2, encrypt,
  };
}
