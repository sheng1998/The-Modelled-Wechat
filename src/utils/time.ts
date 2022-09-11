/**
 * 封装的时间处理函数
 * 如果更多的需求建议使用第三方库
 * moment:
 *    体积最大,功能稍强,同时支持全局导入
 *    https://momentjs.com/
 * dayjs:
 *    体积基本上与date-fns一致,支持全局导入
 *    https://dayjs.gitee.io/zh-CN/
 * date-fns:
 *    体积较小,功能基本上可以代替moment,不支持全局导入
 *    https://date-fns.org/
 */

type Time = number | Date | string;
type Unit = 'ms' | 's';
type DiffUnit = 'D' | 'h' | 'm' | 's' | 'ms';

/**
 * 获取某个时间的时间戳
 * @param {number | Date | string} time 时间点，默认为当前时间
 * @param {'ms' | 's'} unit 时间戳的单位，默认为毫秒
 * @returns {number} 时间戳，传入参数不合法将返回NaN
 */
function getTimestamp(time: Time = Date.now(), unit: Unit = 'ms'): number {
  return new Date(time).getTime() / (unit === 's' ? 1000 : 1);
}

/**
 * 获取某个时间的零点的时间戳
 * @param {number | Date | string} time 时间点，默认为当前时间
 * @param {'ms' | 's'} unit 时间戳的单位，默认为毫秒
 * @returns {number} 时间戳，传入参数不合法将返回NaN
 */
function getDateStartTimestamp(time: Time = Date.now(), unit: Unit = 'ms'): number {
  return new Date(new Date(time).toLocaleDateString()).getTime() / (unit === 's' ? 1000 : 1);
}

/**
 * 获取某个时间的23:59:59的时间戳
 * @param {number | Date | string} time 时间点，默认为当前时间
 * @param {'ms' | 's'} unit 时间戳的单位，默认为毫秒
 * @returns {number} 时间戳，传入参数不合法将返回NaN
 */
function getDateEndTimestamp(time: Time = Date.now(), unit: Unit = 'ms'): number {
  return (
    new Date(new Date(time).toLocaleDateString()).getTime() +
    24 * 60 * 60 * (unit === 'ms' ? 1000 : 1) -
    1
  );
}

/**
 * 获取某个时间的n天后的时间戳
 * @param {number} day 天数
 * @param {number | Date | string} time 时间点，默认为当前时间
 * @param {'ms' | 's'} unit 时间戳的单位，默认为毫秒
 * @returns {Number} day天后的时间戳
 */
function toNextTimestamp(day = 0, time: Time = Date.now(), unit: Unit = 'ms'): number {
  return getTimestamp(time) + day * (unit === 'ms' ? 1000 : 1) * 60 * 60 * 24;
}

/**
 * 判断传入时间是否为今天
 * @param {number | Date | string} time 需要验证的时间
 * @return {boolean}
 */
function isToday(time: Time): boolean {
  return new Date().toLocaleDateString() === new Date(time).toLocaleDateString();
}

/**
 * 判断两个时间是否为同一天
 * @param {number | Date | string} time1 需要验证的时间1
 * @param {number | Date | string} time2 需要验证的时间2
 * @return {boolean} 返回布尔值
 */
function isSameDay(time1: Time, time2: Time): boolean {
  return getDateStartTimestamp(time1) < getDateStartTimestamp(time2);
}

/**
 * 比较两个时间(判断时间1是否小于时间2)
 * @param {number | Date | string} time1 需要验证的日期1
 * @param {number | Date | string} time2 需要验证的日期2
 * @return {boolean} 返回布尔值
 */
function compareDate(time1: Time, time2: Time): boolean {
  return getTimestamp(time1) < getTimestamp(time2);
}

/**
 * 获取两个时间的差值
 * @param {number | Date | string} time1 时间1
 * @param {number | Date | string} time2 时间2
 * @param {D | h | m | s | ms} unit 时间戳的单位，默认为天
 * @return {boolean} 时间的差值
 * e.g:
 *    timeDifference('2022/08/28', '2022/08/29', 'D') = -1
 *    timeDifference('2022/08/29', '2022/08/28', 'D') = 1
 *    timeDifference('2022-08-28 11:23:45:233', '2022-08-29 17:25:46:334') = 1天6小时2分钟1秒101毫秒
 */
function timeDifference(time1: Time, time2: Time, unit?: DiffUnit): number | string {
  const timestamp1 = getTimestamp(time1);
  const timestamp2 = getTimestamp(time2);
  const diffTimestamp = timestamp1 - timestamp2;
  switch (unit) {
    case 'D':
      return diffTimestamp / (1000 * 60 * 60 * 24);
    case 'h':
      return diffTimestamp / (1000 * 60 * 60);
    case 'm':
      return diffTimestamp / (1000 * 60);
    case 's':
      return diffTimestamp / 1000;
    case 'ms':
      return diffTimestamp;
    default:
      /* eslint-disable no-case-declarations */
      let ms = Math.abs(diffTimestamp);
      const D = Math.floor(ms / (1000 * 60 * 60 * 24));
      const h = Math.floor((ms - D * 1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      const m = Math.floor((ms - D * 1000 * 60 * 60 * 24 - h * 1000 * 60 * 60) / (1000 * 60));
      // eslint-disable-next-line max-len
      const s = Math.floor(
        (ms - D * 1000 * 60 * 60 * 24 - h * 1000 * 60 * 60 - m * 1000 * 60) / 1000,
      );
      ms %= 1000;
      return (
        `${D ? `${D}天` : ''}${h ? `${h}小时` : ''}${m ? `${m}分钟` : ''}${s ? `${s}秒` : ''}${
          ms ? `${ms}毫秒` : ''
        }` || '同一时刻'
      );
    /* eslint-enable */
  }
}

/**
 * 格式化时间
 * @param {number | Date | string} time 被格式化的时间
 * @param {string} format 格式化的格式，默认为 YYYY-MM-DD hh:mm:ss =》 2022-08-28 17:11:10
 * @returns {string} 格式化后的时间
 */
function formatTime(time: Time = Date.now(), format = 'YYYY-MM-DD hh:mm:ss'): string {
  const date = new Date(time);
  const YY = date.getFullYear().toString();
  const MM = `0${date.getMonth() + 1}`.slice(-2);
  const DD = `0${date.getDate()}`.slice(-2);
  const hh = `0${date.getHours()}`.slice(-2);
  const mm = `0${date.getMinutes()}`.slice(-2);
  const ss = `0${date.getSeconds()}`.slice(-2);
  const ms = `00${date.getMilliseconds()}`.slice(-3);
  return format
    .replace('YYYY', YY)
    .replace('YY', YY.slice(2))
    .replace('MM', MM)
    .replace('DD', DD)
    .replace('hh', hh)
    .replace('mm', mm)
    .replace('ss', ss)
    .replace('ms', ms);
}

/**
 * 时间对比，相比当前时间（口语化格式）
 * @param {number | Date | string} time 被格式化的时间
 * @returns {string} 格式化后的时间字符串
 */
function timeToSimpleness(time: Time = Date.now()): string {
  if (isToday(time)) {
    return formatTime(time, 'hh:mm');
  }
  const differenceDay = timeDifference(
    getDateStartTimestamp(time),
    getDateStartTimestamp(Date.now()),
    'D',
  );
  if (differenceDay === 1) {
    return '明天';
  }
  if (differenceDay === 2) {
    return '后天';
  }
  if (differenceDay === -1) {
    return '昨天';
  }
  if (differenceDay === -2) {
    return '前天';
  }
  return formatTime(time, 'YY/MM/DD');
}

export {
  getTimestamp,
  getDateStartTimestamp,
  getDateEndTimestamp,
  toNextTimestamp,
  isToday,
  isSameDay,
  compareDate,
  timeDifference,
  formatTime,
  timeToSimpleness,
};
