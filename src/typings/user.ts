import { MessageType } from './socket';

interface Message {
  id: string;
  send_user_id: string;
  receive_user_id: string;
  message: string;
  type: MessageType;
  time: number | Date | string;
}

interface User {
  id: string;
  isRobot?: boolean;
  isAssistant?: boolean;
  username: string;
  avatar: string;
  privileges: number;
  unread?: number; // 未读消息
  messages: Message[];
  input?: string; // 输入框的未发送消息
}

type UserList = User[];

export type { User, UserList, Message };
