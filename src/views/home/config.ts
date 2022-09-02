import { ref } from 'vue';
import { Message, User } from '@/typings/user';

// 文件传输助手
const assistant = ref<User>({
  id: '',
  username: '文件传输助手',
  avatar: '',
  privileges: 1,
  messages: [],
  input: '',
});

// 给文件传输助手发消息
const pushMessageToAssistant = (message: Message) => {
  assistant.value.messages.push(message);
};

export { assistant, pushMessageToAssistant };
