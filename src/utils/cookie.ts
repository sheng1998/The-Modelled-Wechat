/**
 * 获取cookie
 * @param key {string} 要获取的cookie名
 * @returns {string | undefined} 获取的cookie值, 默认值为 undefined, 表示没有这个cookie
 */
function getCookie(key: string): string | undefined {
  const arr1 = document.cookie.split('; ');
  for (let i = 0; i < arr1.length; i += 1) {
    const arr2 = arr1[i].split('=');
    if (arr2[0] === key) {
      return decodeURI(arr2[1]);
    }
  }
  return undefined;
}

/**
 * 设置cookie
 * @param key {string} 要设置的cookie名
 * @param value {string} 要设置的cookie值
 * @param t {number} cookie的过期时间
 * @param unit {s|m|h|d|w} cookie过期时间的单位，默认为秒
 */
function setCookie(key: string, value: string, t?: number, unit?: string) {
  if (!t) {
    document.cookie = `${key}=${value}`;
    return;
  }
  switch (unit) {
    // 分
    case 'm':
      t *= 60;
      break;
    // 时
    case 'h':
      t *= 60 * 60;
      break;
    // 天
    case 'd':
      t *= 60 * 60 * 24;
      break;
    // 周
    case 'w':
      t *= 60 * 60 * 24 * 7;
      break;
  }
  const oDate = new Date();
  oDate.setTime(oDate.getTime() + t * 1000);
  document.cookie = `${key}=${value}; expires=${oDate.toUTCString()}`;
}

/**
 * 移除cookie
 * @param key {string} 要移除的cookie名
 */
function removeCookie(key: string) {
  setCookie(key, '', -1); // 把cookie设置为过期
}

export { getCookie, setCookie, removeCookie };
