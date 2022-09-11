<template>
  <div class="user-list">
    <SearchBar :user-list="userList" @select="$emit('select', $event)"></SearchBar>
    <ElScrollbar>
      <UserItem
        v-for="user in userList"
        :key="user.id"
        :user="user"
        :class="{
          assistant: user.isAssistant,
          robot: user.isRobot,
        }"
        @select="$emit('select', user)"
      >
        <template v-if="user.isAssistant || user.isRobot" #avatar>
          <span :class="['iconfont', user.avatar]"></span>
        </template>
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

defineEmits(['select']);

defineProps({
  userList: {
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
