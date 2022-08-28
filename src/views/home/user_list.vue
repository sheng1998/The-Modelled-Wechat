<template>
  <div class="user-list">
    <SearchBar :user-list="userList" @select="$emit('select', $event)"></SearchBar>
    <ElScrollbar>
      <div class="user assistant flex" @click="selectAssistant">
        <div class="avatar flex-center">
          <span class="iconfont icon-assistant"></span>
        </div>
        <div class="info">
          <div class="top flex">
            <div class="name ellipsis">
              文件传输助手
            </div>
            <div class="time">
              22:23
            </div>
          </div>
          <div class="message ellipsis">
            [文件]
          </div>
        </div>
      </div>
      <div
        v-for="item in 2"
        :key="item"
        class="user robot flex"
        @click="selectRobot(item.toString())"
      >
        <div class="avatar flex-center">
          <span v-if="item === 1" class="iconfont icon-robot"></span>
          <span v-else class="iconfont icon-robot2"></span>
        </div>
        <div class="info">
          <div class="top flex">
            <div class="name ellipsis">
              {{ '机器人' + item }}
            </div>
            <div class="time">
              22:29
            </div>
          </div>
          <div class="message ellipsis">
            {{ '我是智能聊天机器人, 我会陪你聊天哦!' }}
          </div>
        </div>
      </div>
      <div
        v-for="user in userList"
        :key="user.id"
        class="user flex"
        @click="$emit('select', user)"
      >
        <div class="avatar flex-center">
          <img :src="user.avatar || '/avatar/avatar_01.png'" :alt="user.username">
        </div>
        <div class="info">
          <div class="top flex">
            <div class="name ellipsis">
              {{ user.username }}
            </div>
            <div
              v-if="user.messages.length"
              class="time"
              :title="formatTime(user.messages[user.messages.length - 1].time)"
            >
              {{ timeToSimpleness(user.messages[user.messages.length - 1].time) }}
            </div>
          </div>
          <div v-if="user.messages.length" class="message ellipsis">
            {{ user.messages[user.messages.length - 1].message }}
          </div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus';
import { PropType } from 'vue';
import SearchBar from './search_bar.vue';
import { UserList } from '@/typings/user';
import { formatTime, timeToSimpleness } from '@/utils/time';

const props = defineProps({
  self: {
    type: String,
    default: '',
  },
  userList: {
    type: Array as PropType<UserList>,
    required: true,
  },
});

const emits = defineEmits(['select']);

const selectAssistant = () => {
  emits('select', { username: '文件传输助手', id: props.self });
};

const selectRobot = (id: string) => {
  emits('select', {
    username: `机器人${id}`,
    id: `jiqiren${id}`,
  });
};
</script>

<style lang="scss" scoped>
@import '$style/variable';
.user-list {
  width: $user-list-width;
  height: 100%;
  background-color: #dfdede;
  & > .el-scrollbar {
    height: calc(100% - #{$search-bar-height});
  }
  .user {
    width: 100%;
    height: 60px;
    padding: 10px;
    border-bottom: 1px solid $border-color;
    cursor: pointer;
    .avatar {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-right: 12px;
      border-radius: 4px;
      background-color: #d8d8d8;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .name {
      flex-shrink: 0;
      width: 130px;
    }
    .time {
      flex-shrink: 0;
      width: 53px;
      text-align: right;
      color: #b9b9b9;
      font-size: 12px;
    }
    .message {
      width: 160px;
      margin-top: 5px;
      font-size: 14px;
      color: #b9b9b9;
    }
  }
  .assistant {
    .avatar {
      background-color: #2ba245;
      color: #fff;
      span {
        font-size: 22px;
      }
    }
  }
  .robot {
    .avatar {
      background-color: #1677d2;
      color: #fff;
      span {
        font-size: 22px;
      }
    }
  }
}
</style>
