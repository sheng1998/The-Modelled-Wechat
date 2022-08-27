<template>
  <div v-if="socket" class="home flex-center">
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
  <div v-else class="authority">
    <ElEmpty
      description="正在与服务端进行通信连接..."
      image="/image/loading.png"
      :image-size="300"
    ></ElEmpty>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
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
import { User, UserList as TUserList } from '@/typings/user';
import { SocketType } from '@/typings/socket';
import { useUserStore } from '@/store/user';

// 记录初始时间戳，用户页面切换防止闪烁
const startTime = Date.now();
// socket对象
const socket = ref<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
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
watch(() => userStore.id, async (id) => {
  if (!id) return;
  getUserList();
  if (socket.value) return;
  const connect = await socketConnection(id) as Socket<DefaultEventsMap, DefaultEventsMap>;
  await sleep(500 - (Date.now() - startTime));
  socket.value = connect;
}, {
  immediate: true,
});

// 发送消息
const send = (message: string, uid: string, type: SocketType = 'text') => {
  console.log(message, uid, type);
  chatModelRef.value?.clearMessage();
  socket.value?.emit('message', { uid, message, type });
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
