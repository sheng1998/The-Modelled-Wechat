<template>
  <div class="user flex" @click="$emit('select', user)">
    <!-- TODO 未读消息条数 -->
    <div class="avatar flex-center">
      <slot name="avatar">
        <img :src="user.avatar || '/avatar/avatar_01.png'" :alt="user.username" />
      </slot>
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
      <div v-if="user.messages.length || user.input" class="message ellipsis">
        <template v-if="user.input">
          <span style="color: red">[草稿]</span>
          {{ user.input }}
        </template>
        <template v-else>
          {{ user.messages[user.messages.length - 1].message }}
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { formatTime, timeToSimpleness } from '@/utils/time';
import { User } from '@/typings/user';

defineEmits(['select']);

defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@import '$style/variable';
.user {
  width: 100%;
  height: 60px;
  padding: 10px;
  border-bottom: 1px solid $border-color;
  cursor: pointer;
  .avatar {
    flex-shrink: 0;
    overflow: hidden;
    width: 40px;
    height: 40px;
    margin-right: 12px;
    background-color: #d8d8d8;
    border-radius: 4px;
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
    font-size: 12px;
    text-align: right;
    color: #b9b9b9;
  }
  .message {
    width: 160px;
    margin-top: 5px;
    font-size: 14px;
    color: #b9b9b9;
  }
}
</style>
