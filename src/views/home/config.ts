import { ref } from 'vue';
import { User } from '@/typings/user';

// 文件传输助手
const assistant = ref<User>({
  id: '',
  username: '文件传输助手',
  avatar: '',
  privileges: 1,
  messages: [],
  input: '',
});

export { assistant };
