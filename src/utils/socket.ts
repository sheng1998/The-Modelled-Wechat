/**
 * socket连接成功
 *    socket.on('connect', () => void)
 * socket断开连接
 *    socket.on('disconnect', () => void)
 * 用户之间的私聊
 *    socket.emit('message-private', { receive_user_id, send_user_id, message, type })
 * 发送群消息
 *    socket.emit('message-group', { receive_user_id, send_user_id, message, type })
 * 给机器人发消息
 *    socket.emit('message-robot', { receive_user_id, send_user_id, message, type })
 * 接收到用户的消息
 *    socket.on('message-private', { receive_user_id, send_user_id, message, type })
 * 接收到群消息
 *    socket.on('message-group', { receive_user_id, send_user_id, message, type })
 * 接机器人消息
 *    socket.on('message-robot', { receive_user_id, send_user_id, message, type })
 * 同步消息到其他端(同一用户建立了多个连接)
 *    socket.on('message-private-sync', { receive_user_id, send_user_id, message, type })
 * 接收到公告消息
 *    socket.on('notice', { nid, message, type })
 */

import { io } from 'socket.io-client';
import { getCookie } from './cookie';

export default (uid: string) =>
  new Promise((resolve, reject) => {
    // socket 连接的url
    const url =
      import.meta.env.MODE === 'development' ? 'ws://127.0.0.1:3002' : 'ws://119.91.74.150:3002';
    // socket 连接
    const socket = io(url, {
      transports: ['websocket'],
      // 后端需要这个cookie来做校验
      auth: { uid, session: getCookie('session_id') },
    });

    socket.on('connect', () => {
      console.log('socket连接成功, 等待服务端校验身份!');
    });

    socket.on('authority', (result) => {
      if (result.code === 0) {
        console.log('身份校验成功!');
        resolve(socket);
      } else {
        reject();
        console.log('身份校验失败, 自动断开连接!');
        socket?.disconnect();
      }
    });

    socket.on('disconnect', () => {
      console.log('socket断开连接!');
    });
  });
