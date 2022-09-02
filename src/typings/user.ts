import { SocketType } from './socket';

interface Message {
  id: string,
  send_user_id: string;
  receive_user_id: string;
  message: string,
  type: SocketType;
  time: number | Date | string;
}

interface User {
  id: string;
  username: string;
  avatar: string;
  privileges: number;
  unread?: number; // 未读消息
  messages: Message[];
  input?: string; // 输入框的未发送消息
}

type UserList = User[];

export type { User, UserList, Message };
