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
import { ref } from 'vue';
import SideBar from '@/views/layout/sidebar.vue';
import UserList from './user_list.vue';
import ChatModel from './chat_model.vue';
import NoticeBoard from './notice_board.vue';
import request from '@/server';
import { User, UserList as TUserList } from '@/typings/user';

const currentUser = ref<User | undefined>(undefined);
const userList = ref<TUserList>([]);
const chatModelRef = ref<InstanceType<typeof ChatModel> | null>(null);

// 获取用户列表
const getUserList = async () => {
  const { data } = await request.get('/user/list');
  userList.value = data.data;
};

getUserList();

// 发送消息
const send = (message: string, uid: string) => {
  console.log(message, uid);
  chatModelRef.value?.clearMessage();
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
