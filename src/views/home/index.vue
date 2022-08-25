<template>
  <div class="home flex-center">
    <div class="wrap flex">
      <SideBar></SideBar>
      <UserList @select="currentUser = $event"></UserList>
      <ChatModel :class="{ 'right-border': notice }" :user="currentUser"></ChatModel>
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
import { User } from '@/typings/user';

const currentUser = ref<User | undefined>(undefined);

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
