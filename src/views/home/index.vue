<template>
  <div class="home flex-center">
    <div class="wrap flex">
      <SideBar></SideBar>
      <UserList :user-list="userList" @select="currentUser = $event"></UserList>
      <ChatModel
        ref="chatModelRef"
        :class="{ 'right-border': notice }"
        :user="currentUser"
        @send="send"
      ></ChatModel>
      <NoticeBoard v-if="notice" class="notice-board"></NoticeBoard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Socket } from 'socket.io-client';
// eslint-disable-next-line
import { DefaultEventsMap } from '@socket.io/component-emitter';
import SideBar from '@/views/layout/sidebar.vue';
import UserList from './user_list.vue';
import ChatModel from './chat_model.vue';
import NoticeBoard from './notice_board.vue';
import socketConnection from '@/utils/socket';
import request from '@/server';
import { User, UserList as TUserList } from '@/typings/user';
import { SocketType } from '@/typings/socket';
import { useUserStore } from '@/store/user';

// socket对象
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
// 用户的状态信息
const userStore = useUserStore();

const currentUser = ref<User | undefined>(undefined);
const userList = ref<TUserList>([]);
const chatModelRef = ref<InstanceType<typeof ChatModel> | null>(null);

// 获取用户列表
const getUserList = async () => {
  const { data } = await request.get('/user/list');
  userList.value = data.data;
};

// 监听用户id的变化获取用户列表和连接socket
watch(() => userStore.id, (id) => {
  if (!id) return;
  getUserList();
  socket = socketConnection(id);
}, {
  immediate: true,
});

// 发送消息
const send = (message: string, uid: string, type: SocketType = 'text') => {
  console.log(message, uid);
  chatModelRef.value?.clearMessage();
  socket?.emit('message', { uid, message, type });
};

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
</style>
