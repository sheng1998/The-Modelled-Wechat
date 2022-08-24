<template>
  <div class="home flex-center">
    <div class="wrap flex">
      <SideBar></SideBar>
      <UserList></UserList>
      <ChatModel :class="{ 'right-border': notice }"></ChatModel>
      <NoticeBoard v-if="notice" class="notice-board"></NoticeBoard>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/views/layout/sidebar.vue';
import UserList from './user_list.vue';
import ChatModel from './chat_model.vue';
import NoticeBoard from './notice_board.vue';

// TODO 用于记录公告信息
const notice = null;
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  min-width: 1300px;
  height: 100%;
  min-height: 700px;
  .wrap {
    height: 600px;
    border: 1px solid #d9d9d9;
  }
  .chat-model.right-border {
    border-right: 1px solid #d9d9d9;
  }
  .side-bar,
  .user-list,
  .chat-model,
  .notice-board {
    flex-shrink: 0;
  }
}
</style>
