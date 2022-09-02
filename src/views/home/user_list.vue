<template>
  <div class="user-list">
    <SearchBar :user-list="userList" @select="$emit('select', $event)"></SearchBar>
    <ElScrollbar>
      <UserItem class="assistant" :user="assistant" @select="$emit('select', assistant)">
        <template #avatar>
          <span class="iconfont icon-assistant"></span>
        </template>
      </UserItem>
      <UserItem
        v-for="robot in robotList"
        :key="robot.id"
        class="robot"
        :user="robot"
        @select="$emit('select', robot)"
      >
        <template #avatar>
          <span :class="['iconfont', robot.avatar]"></span>
        </template>
      </UserItem>
      <UserItem
        v-for="user in userList"
        :key="user.id"
        :user="user"
        @select="$emit('select', user)"
      >
      </UserItem>
    </ElScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus';
import { PropType } from 'vue';
import SearchBar from './search_bar.vue';
import UserItem from './user_item.vue';
import { UserList } from '@/typings/user';
import { assistant } from './config';

defineEmits(['select']);

defineProps({
  userList: {
    type: Array as PropType<UserList>,
    required: true,
  },
  robotList: {
    type: Array as PropType<UserList>,
    required: true,
  },
});
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
  .assistant {
    :deep(.avatar) {
      background-color: #2ba245;
      color: #fff;
      span {
        font-size: 22px;
      }
    }
  }
  .robot {
    :deep(.avatar) {
      background-color: #1677d2;
      color: #fff;
      span {
        font-size: 22px;
      }
    }
  }
}
</style>
