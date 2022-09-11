import { TripleDES, enc } from 'crypto-js';

// 默认密钥
const secretKey = 'sBUoieHX';

// 加密
// eslint-disable-next-line max-len
const encrypt = (string: string, secret = secretKey) =>
  TripleDES.encrypt(string, secret).toString();

// 解密
// eslint-disable-next-line max-len
const decrypt = (string: string, secret = secretKey): string | undefined => {
  try {
    return TripleDES.decrypt(string, secret).toString(enc.Utf8);
  } catch (error) {
    return undefined;
  }
};

export { encrypt, decrypt };
