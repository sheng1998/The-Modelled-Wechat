<template>
  <div class="home flex-center">
    <div class="wrap flex">
      <SideBar class="side-bar"></SideBar>
      <UserList class="user-list"></UserList>
      <ChatModel></ChatModel>
      <NoticeBoard class="notice-board"></NoticeBoard>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/views/layout/sidebar.vue';
import UserList from './user_list.vue';
import ChatModel from './chat_model.vue';
import NoticeBoard from './notice_board.vue';
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  min-width: 1260px;
  height: 100%;
  min-height: 700px;
  .wrap {
    width: 1160px;
    height: 600px;
    border: 1px solid #d9d9d9;
  }
  .chat-model {
    width: 100%;
  }
  .side-bar,
  .user-list,
  .notice-board {
    flex-shrink: 0;
  }
}
</style>
