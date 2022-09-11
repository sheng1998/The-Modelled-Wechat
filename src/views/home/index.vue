<template>
  <div v-if="socket" class="home flex-center">
    <div class="wrap flex">
      <SideBar></SideBar>
      <UserList :user-list="userList" @select="changeCurrentUser"></UserList>
      <ChatModel
        ref="chatModelRef"
        :class="{ 'right-border': notice }"
        :user="currentUser"
        @send="send"
      ></ChatModel>
      <NoticeBoard v-if="notice" class="notice-board"></NoticeBoard>
    </div>
  </div>
  <div v-else class="authority">
    <ElEmpty
      description="正在与服务端进行通信连接..."
      image="/image/loading.png"
      :image-size="300"
    ></ElEmpty>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElEmpty } from 'element-plus';
import { Socket } from 'socket.io-client';
// eslint-disable-next-line
import { DefaultEventsMap } from '@socket.io/component-emitter';
import SideBar from '@/views/layout/sidebar.vue';
import UserList from './user_list.vue';
import ChatModel from './chat_model.vue';
import NoticeBoard from './notice_board.vue';
import socketConnection from '@/utils/socket';
import sleep from '@/utils/sleep';
import request from '@/server';
import { Message, User, UserList as TUserList } from '@/typings/user';
import { MessageType } from '@/typings/socket';
import { useUserStore } from '@/store/user';
import mergeQuery from '@/utils/merge_query';
import { assistant } from './config';
import useMessage from './use/use_message';

const route = useRoute();
const router = useRouter();
// 记录初始时间戳，用户页面切换防止闪烁
const startTime = Date.now();
// socket对象
const socket: Ref<Socket<DefaultEventsMap, DefaultEventsMap> | null> = ref(null);
// 用户的状态信息
const userStore = useUserStore();

const currentUser = ref<User | undefined>(undefined);
const userList: Ref<TUserList> = ref([]);
const chatModelRef = ref<InstanceType<typeof ChatModel> | null>(null);

// 发送或接收消息的回调
const messageCallback = (data: Message) => {
  // 用户列表重新排序
  for (let i = 0; i < userList.value.length; i += 1) {
    const user = userList.value[i];
    if (user.id === data.send_user_id || user.id === data.receive_user_id) {
      user.messages.push(data as Message);
      chatModelRef.value?.scrollbarToBottom();
      // 新接受的消息放到第一位
      userList.value.splice(i, 1);
      userList.value.unshift(user);
      break;
    }
  }
};

const { privateChat } = useMessage(socket, userStore, messageCallback);

// 切换用户
const changeCurrentUser = (user: User) => {
  if (currentUser.value) {
    currentUser.value.input = chatModelRef.value?.message || '';
  }
  const query = mergeQuery(route.query, { uid: user.id || userStore.id });
  router.replace({ query });
  currentUser.value = user;
};

// 获取用户列表
const getUserList = async () => {
  const {
    data: { data: list },
  } = await request.get('/user/list');
  // TODO 获取机器人列表（await）
  // 插入文件传输助手
  list.splice(0, 0, { ...assistant.value, id: userStore.id });
  list.splice(1, 0, ...(await getRobotList()));
  // 插入机器人列表
  list.forEach((user: User) => {
    user.unread = 0;
    user.messages = [];
    if (route.query.uid === user.id) {
      currentUser.value = user;
    }
  });
  userList.value = list;
};

// 获取机器人列表
const getRobotList = async () => [
  {
    id: '111111',
    isRobot: true,
    username: '机器人1',
    avatar: 'icon-robot',
    privileges: 1,
    messages: [],
    input: '',
  },
  {
    id: '22222',
    isRobot: true,
    username: '机器人2',
    avatar: 'icon-robot2',
    privileges: 1,
    messages: [],
    input: '',
  },
];

// 注册socket监听器
const socketListener = () => {
  // 收到用户消息(私聊)
  socket.value?.on('message-private', (data: Message) => {
    privateChat(data);
  });
  // 多端同步消息(同一用户建立了多个连接)
  socket.value?.on('message-private-sync', (data: Message) => {
    privateChat(data, true);
  });
};

// 发送消息
const send = (message: string, receive_user_id: string, type: MessageType = 'text') => {
  chatModelRef.value?.clearMessage();
  privateChat({ message, receive_user_id, type });
};

// 监听用户id的变化获取用户列表和连接socket
watch(
  () => userStore.id,
  async (id) => {
    if (!id) return;
    getRobotList();
    getUserList();
    if (socket.value) return;
    const connect = (await socketConnection(id)) as Socket<DefaultEventsMap, DefaultEventsMap>;
    await sleep(200 - (Date.now() - startTime));
    socket.value = connect;
    socketListener();
  },
  {
    immediate: true,
  },
);

// TODO 用于记录公告信息
const notice = null;
</script>

<style lang="scss" scoped>
@import '$style/variable';
.home {
  width: 100%;
  min-width: $min-width;
  height: 100%;
  min-height: $min-height;
  .wrap {
    height: $wrap-height;
    border: 1px solid $border-color;
  }
  .chat-model.right-border {
    border-right: 1px solid $border-color;
  }
  .side-bar,
  .user-list,
  .chat-model,
  .notice-board {
    flex-shrink: 0;
  }
}
.authority {
  width: 100%;
  height: 100%;
  min-width: 400px;
  min-height: 400px;
  .el-empty {
    height: 100%;
    :deep(.el-empty__description) p {
      font-size: 18px;
    }
  }
}
</style>
