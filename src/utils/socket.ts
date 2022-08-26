import { io } from 'socket.io-client';

const url = import.meta.env.MODE === 'development' ? 'ws://127.0.0.1:3002' : 'ws://119.91.74.150:3002:3002';
const socket = io(url, { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('socket连接成功!');
});

socket.on('disconnect', () => {
  console.log('socket断开连接!');
  // console.log('socket断开连接, 将自动尝试重连!');
  // socket = io(url, { transports: ['websocket'] });
});

// 用户之间的私聊
// socket.emit('message', { uid, message, type })
// 发送群消息
// socket.emit('message-group', { gid, message, type })
// 接收到用户的消息
// socket.on('message', { uid, message, type })
// 接收到群消息
// socket.on('message-group', { gid, message, type })
// 接收到公告消息
// socket.on('notice', { nid, message, type })

export default socket;
