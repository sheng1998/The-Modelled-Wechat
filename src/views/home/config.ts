import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import { User } from '@/typings/user';

// 用户的状态信息
const userStore = useUserStore();

// 文件传输助手
const assistant = ref<User>({
  id: userStore.id,
  username: '文件传输助手',
  avatar: '',
  privileges: 1,
  messages: [],
  input: '',
});

export { assistant };
