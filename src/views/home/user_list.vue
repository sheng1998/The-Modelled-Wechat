<template>
  <div class="user-list">
    <ElScrollbar>
      <div class="user assistant flex">
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
      <div v-for="item in 2" :key="item" class="user robot flex">
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
      <div v-for="item in 20" :key="item" class="user flex">
        <div class="avatar flex-center">
          <img :src="'/avatar/avatar_0'+ (item % 2 + 1) +'.png'" alt="用户名">
        </div>
        <div class="info">
          <div class="top flex">
            <div class="name ellipsis">
              {{ 'username' + item }}
            </div>
            <div class="time">
              {{ '时间' }}
            </div>
          </div>
          <div class="message ellipsis">
            {{ 'message' + item }}
          </div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus';
</script>

<style lang="scss" scoped>
@import '$style/variable';
.user-list {
  width: $user-list-width;
  height: 100%;
  background-color: #dfdede;
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
      width: 135px;
    }
    .time {
      color: #b9b9b9;
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
