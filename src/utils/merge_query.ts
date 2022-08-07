import { LocationQuery } from 'vue-router';

type TBase = string | number | undefined | null;
type TCustomQuery = {
  [key: string]: TBase | TBase[];
}
// 定义排除类型：将U从T中剔除, keyof 会取出T与U的所有键, 限定P的取值范围为T中的所有键, 并将其类型设为never
// eslint-disable-next-line no-unused-vars
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
// 定义互斥类型，T或U只有一个能出现（互相剔除时，被剔除方必须存在）
type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);
type TIncludes = {
  includes: string[];
}
type TExclude = {
  exclude: string[];
}

export default function (
  query: LocationQuery,
  target: TCustomQuery,
  config?: XOR<TIncludes, TExclude>,
): LocationQuery {
  const result = { ...query, ...target };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (config?.includes) {
        if (!config.includes.includes(key)) {
          delete result[key];
          continue;
        }
      } else if (config?.exclude) {
        if (config.exclude.includes(key)) {
          delete result[key];
          continue;
        }
      }
      if (result[key] === undefined || result[key] === null || result[key] === '') {
        delete result[key];
        continue;
      } else if (Object.prototype.toString.call(result[key]) === '[object Array]') {
        // eslint-disable-next-line array-callback-return, consistent-return
        result[key] = (result[key] as TBase[]).filter((item) => {
          if (item !== undefined && item !== null) {
            return String(item);
          }
        });
        if ((result[key] as TBase[]).length === 0) {
          delete result[key];
          continue;
        }
      } else {
        result[key] = String(result[key]);
      }
    }
  }
  return result as LocationQuery;
}
