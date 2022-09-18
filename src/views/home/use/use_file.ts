import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/server';
import getFileHash, { getFileMD5 } from '@/utils/get_file_hash';
import asyncLimit from '@/utils/async_limit';

export default () => {
  const inputFileDom = ref<HTMLInputElement | null>(null);

  // 选择上传的文件
  const selectFile = () => {
    if (!inputFileDom.value) {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = fileChange;
      inputFileDom.value = input;
    }
    // 模拟点击事件
    inputFileDom.value.click();
  };

  // 校验文件
  const beforeUpload = (file: File): boolean => {
    if (file.size > 50 * 1024 * 1024) {
      ElMessage.warning('仅支持上传小于等于 50MB 的文件');
      if (inputFileDom.value) {
        inputFileDom.value.value = '';
      }
      return false;
    }
    return true;
  };

  // 上传文件
  const uploadFile = async (file: File) => {
    if (!beforeUpload(file)) return;
    const fileFash = await getFileHash(file, ['md5', 'sha1']);
    // 分片大小(每个分片最大 5MB)
    const chunkSize = 5 * 1024 * 1024;
    // 分片数量
    const totalChunk = Math.ceil(file.size / chunkSize);
    // 用来记录所有分片上传函数的数组
    const requestList: (() => Promise<unknown>)[] = [];

    for (let i = 0; i < totalChunk; i += 1) {
      const start = i * chunkSize;
      const end = start + chunkSize > file.size ? file.size : start + chunkSize;
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('file_name', file.name);
      formData.append('index', i.toString());
      formData.append('total_chunk', totalChunk.toString());
      formData.append('file_md5', fileFash.md5);
      formData.append('file_sha1', fileFash.sha1);

      requestList.push(
        () =>
          new Promise((resolve, reject) => {
            getFileMD5(chunk)
              .then((chunkHash) => {
                formData.append('chunk_hash', chunkHash || '');
                return request.post('/file/upload_chunck', formData);
              })
              .then((res) => {
                resolve(res.data);
              })
              .catch((error) => {
                reject(error);
              });
          }),
      );
    }

    // 分片上传
    asyncLimit(requestList, 3).then((res) => {
      console.log(res);
    });
  };

  const fileChange = () => {
    const file = inputFileDom.value?.files?.[0];
    if (!file) return;
    uploadFile(file);
  };

  return { selectFile };
};
