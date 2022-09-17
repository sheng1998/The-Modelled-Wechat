/**
 * 异步并发限制
 * @param {number} limit 限制每次最多允许同时执行的数量
 * @param {Function[]} list 异步并发函数组成的数组(promise数组)
 * @param {number} errorTime 每个异步事件允许失败的次数(超过指定次数后不会再执行该异步事件), 默认值为3
 * @param {Function} cb [index, progress, current, error_time, results]
 * cb 函数用于返回当前执行的结果包括当前进度、当前结果、已执行的结果
 */
const asyncLimit = (
  limit: number,
  list: (() => Promise<unknown>)[],
  errorTime = 3,
  cb?: (
    index: number,
    progress: number,
    current: PromiseFulfilledResult<any> | PromiseRejectedResult,
    errorTime: number,
    results: PromiseSettledResult<any>[],
  ) => void,
): Promise<PromiseSettledResult<any>[]> => {
  // 将 Map 数据结构转为数组
  const mapToArray = (
    map: Map<number, unknown>,
    rejectedMap: Map<number, unknown>,
  ): PromiseSettledResult<any>[] => {
    const array: PromiseSettledResult<any>[] = [];
    for (let i = 0; i < list.length; i += 1) {
      if (rejectedMap.has(i)) {
        array.push({
          status: 'rejected',
          reason: rejectedMap.get(i),
        });
      } else if (map.has(i)) {
        array.push({
          status: 'fulfilled',
          value: map.get(i),
        });
      }
    }
    return array;
  };

  return new Promise((resolve) => {
    // 用来记录失败执行的次数(第一个number对应了list的下标, 第二个为失败次数)
    const rejectedTimeMap: Map<number, number> = new Map();
    // 彻底失败的Map(超出允许失败次数了)
    const rejectedMap: Map<number, unknown> = new Map();
    // 执行成功的Map
    const fulfilledMap: Map<number, unknown> = new Map();
    // 记录当前执行的指针(对应list的下标)
    let index = -1;

    // 执行函数
    const run = (currentIndex: number) => {
      // 记录promise执行的结果(在finally中使用)
      let result: PromiseFulfilledResult<any> | PromiseRejectedResult | null = null;
      list[currentIndex]()
        .then((res) => {
          result = { status: 'fulfilled', value: res };
          fulfilledMap.set(currentIndex, res);
          if (rejectedMap.size + fulfilledMap.size === list.length) {
            resolve(mapToArray(fulfilledMap, rejectedMap));
          }
          if (index < list.length - 1) {
            run((index += 1));
          }
        })
        .catch((error) => {
          // 失败次数
          const time = rejectedTimeMap.get(currentIndex) || 0;
          result = { status: 'rejected', reason: error };
          rejectedTimeMap.set(currentIndex, time + 1);
          // 失败次数超出限制
          if (time >= errorTime - 1) {
            rejectedMap.set(currentIndex, error);
            if (rejectedMap.size + fulfilledMap.size === list.length) {
              resolve(mapToArray(fulfilledMap, rejectedMap));
            } else if (index < list.length - 1) {
              run((index += 1));
            }
          } else {
            // 失败重新执行当前函数(失败重传)
            run(currentIndex);
          }
        })
        .finally(() => {
          if (typeof cb === 'function') {
            cb(
              currentIndex,
              (fulfilledMap.size + rejectedMap.size) / list.length,
              result as PromiseFulfilledResult<any> | PromiseRejectedResult,
              rejectedTimeMap.get(currentIndex) || 0,
              mapToArray(fulfilledMap, rejectedMap),
            );
          }
        });
    };

    // 初始化的时候直接执行(并发执行)
    for (let i = 0; i < Math.min(list.length, limit); i += 1) {
      run((index += 1));
    }
  });
};

export default asyncLimit;
