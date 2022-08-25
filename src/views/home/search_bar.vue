<template>
  <div class="search-bar flex-vertical-center">
    <ElAutocomplete
      v-model="username"
      value-key="username"
      :fetch-suggestions="querySearch"
      placeholder="搜索用户名"
      @select="handleSelect"
    ></ElAutocomplete>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { ElAutocomplete } from 'element-plus';
import pinyin from 'js-pinyin';
import { User, UserList } from '@/typings/user';

const props = defineProps({
  userList: {
    type: Array as PropType<UserList>,
    default: () => [],
  },
});

const emits = defineEmits(['select']);

const username = ref('');

const querySearch = (keyword: string, cb: any) => {
  const results = keyword
    ? props.userList.filter(createFilter(keyword))
    : props.userList;
  cb(results);
};

// 搜索逻辑
const createFilter = (keyword: string) => (user: User) => {
  const name = user.username;
  const string = name + pinyin.getFullChars(name) + pinyin.getCamelChars(name);
  return string.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
};

// 选择用户
const handleSelect = (user: any) => {
  emits('select', user);
};

</script>

<style lang="scss" scoped>
@import '$style/variable';
.search-bar {
  height: $search-bar-height;
  padding: 0 10px;
  border-bottom: 1px solid $border-color;
  .el-autocomplete {
    flex-shrink: 0;
    width: 180px;
  }
}
</style>
