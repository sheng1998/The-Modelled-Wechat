import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api/v1' : 'http://119.91.74.150:3002/api/v1',
  xsrfCookieName: 'csrfToken',
  xsrfHeaderName: 'x-csrf-token',
});

// 请求拦截器
// request.interceptors.request.use((config) => {
//   // 在发送请求之前做些什么
//   return config;
// }, (error) => {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });

// 响应拦截器
request.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  if (response.data.code !== undefined && response.data.code !== 0) {
    ElMessage.error({
      message: response.data.message,
      grouping: true,
    });
  }
  return response;
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  switch (error.response.status) {
    case 500:
      ElMessage.error({ message: '服务器异常！', grouping: true });
      break;
    default:
      ElMessage.error({
        message: error.response?.data?.message || '未知错误！',
        grouping: true,
      });
      break;
  }
  return Promise.reject(error.response.data);
});

export default request;
