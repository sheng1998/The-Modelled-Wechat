import cryptoJs from 'crypto-js';
import encHex from 'crypto-js/enc-hex';
import sparkMd5 from 'spark-md5';

type HashType = 'md5' | 'sha1' | 'sha224' | 'sha256';

type Result = {
  // eslint-disable-next-line no-unused-vars
  [key in HashType]?: string
}

// 获取文件Hash值(md5、sha1、sha224、sha256)
const getFileHash = (file: File | Blob, hashList: HashType[] = ['md5']): Promise<Result> => {
  if (hashList.length <= 0) {
    throw new Error('至少需要计算一个hash值!');
  }
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    // 文件切片计算MD5, 防止内存泄露(标签页崩溃)
    const chunkSize = 5 * 1024 * 1024; // 每个切片 5MB
    const totalChunk = Math.ceil(file.size / chunkSize);
    // 指针, 用于记录当前处理到第几个分片
    let currentIndex = 0;

    // 需要获取的时候才初始化
    const spark = hashList.includes('md5') ? new sparkMd5.ArrayBuffer() : null;
    const alogSha1 = hashList.includes('sha1') ? cryptoJs.algo.SHA1.create() : null;
    const alogSha224 = hashList.includes('sha224') ? cryptoJs.algo.SHA224.create() : null;
    const alogSha256 = hashList.includes('sha256') ? cryptoJs.algo.SHA256.create() : null;

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const result = e.target?.result;
      if (!result || typeof result === 'string') {
        reject();
        return;
      }

      // 需要获取的时候才执行
      spark?.append(result);
      if (alogSha1 || alogSha224 || alogSha256) {
        const wordArray = cryptoJs.lib.WordArray.create(result as unknown as number[]);
        alogSha1?.update(wordArray);
        alogSha224?.update(wordArray);
        alogSha256?.update(wordArray);
      }

      currentIndex += 1;
      if (currentIndex < totalChunk) {
        loadNextChunk();
      } else {
        const data: Result = {};
        if (spark) {
          data.md5 = spark.end();
        }
        if (alogSha1) {
          data.sha1 = encHex.stringify(alogSha1.finalize());
        }
        if (alogSha224) {
          data.sha224 = encHex.stringify(alogSha224.finalize());
        }
        if (alogSha256) {
          data.sha256 = encHex.stringify(alogSha256.finalize());
        }
        resolve(data);
      }
    };

    fileReader.onerror = (e) => {
      reject(e);
    };

    // 加载下一个分片
    function loadNextChunk() {
      const start = currentIndex * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNextChunk();
  });
};

// 获取文件MD5值
const getFileMD5 = (file: File | Blob): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    getFileHash(file).then((result) => {
      resolve(result.md5);
    }).catch((error) => {
      reject(error);
    });
  });
}

// 获取文件SHA1值
const getFileSHA1 = (file: File | Blob): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    getFileHash(file).then((result) => {
      resolve(result.sha1);
    }).catch((error) => {
      reject(error);
    });
  });
}

// 获取文件SHA256值
const getFileSHA256 = (file: File | Blob): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    getFileHash(file).then((result) => {
      resolve(result.sha256);
    }).catch((error) => {
      reject(error);
    });
  });
}

export default { getFileHash };

export {
  getFileHash, getFileMD5, getFileSHA1, getFileSHA256,
};
