import { Socket } from 'socket.io-client';
// eslint-disable-next-line
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { nanoid } from 'nanoid';
import { Ref } from 'vue';
import { Store } from 'pinia';
import { decrypt, encrypt } from '@/utils/encrypt';
import { Message } from '@/typings/user';
import { SocketType } from '@/typings/socket';

export default function useMessage(
  socket: Ref<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
  userStore: Store<'user', {
    id: string;
    username: string;
    avatar: string;
    privileges: number;
  }>,
  // eslint-disable-next-line no-unused-vars
  messageCallback: (data: Message, type: SocketType, method: 'receive' | 'send') => void,
) {
  // 私聊
  const privateChat = (data: Partial<Message> & Pick<Message, 'message'>, sync = false) => {
    const messageData = fillDataInfo(data);
    const { send_user_id, receive_user_id } = messageData;
    // 同步消息到其他端(同一用户建立了多个连接)
    if (sync) {
      receiveMessage(messageData, send_user_id === receive_user_id ? 'self' : 'private');
      return;
    }
    if (send_user_id === receive_user_id) {
      emitMessage(messageData, 'self');
      return;
    }
    // 发送消息
    if (send_user_id === userStore.id) {
      emitMessage(messageData, 'private');
    }
    // 收到消息
    if (receive_user_id === userStore.id) {
      receiveMessage(messageData, 'private');
    }
  };

  // 补充消息的详细信息
  const fillDataInfo = (data: Partial<Message> & Pick<Message, 'message'>): Message => {
    const messageData = { ...data };
    if (!data.send_user_id) messageData.send_user_id = userStore.id;
    if (!data.receive_user_id) messageData.receive_user_id = userStore.id;
    if (!data.id) messageData.id = nanoid();
    if (!data.time) messageData.time = Date.now();
    if (!data.type) messageData.type = 'text';
    return messageData as Message;
  };

  // 推送消息到客户端(socket.emit)
  const emitMessage = (data: Message, type: SocketType = 'self') => {
    console.log('发送消息!', data, encrypt(data.message));
    const emitData = { ...data, message: encrypt(data.message) };
    if (type === 'private' || type === 'self') {
      socket.value?.emit('message-private', emitData);
    } else if (type === 'group') {
      socket.value?.emit('message-group', emitData);
    } else {
      socket.value?.emit('message-robot', emitData);
    }
    messageCallback(data, type, 'send');
  };

  // 接收信息(socket.on)
  const receiveMessage = (data: Message, type: SocketType = 'self') => {
    console.log('接收消息!', data, type);
    const message = decrypt(data.message);
    // TODO 解密失败处理
    if (!message) return;
    messageCallback({ ...data, message }, type, 'receive');
  };

  return { privateChat };
}
