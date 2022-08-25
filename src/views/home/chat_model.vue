<template>
  <div class="chat-model">
    <template v-if="user">
      <div class="header flex-vertical-center">
        {{ user.username }}
      </div>
      <ElScrollbar></ElScrollbar>
      <div class="footer"></div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ElScrollbar } from 'element-plus';
import { User } from '@/typings/user';

defineProps({
  user: {
    type: Object as PropType<User>,
  },
});
</script>

<style lang="scss" scoped>
@import '$style/variable';
$header-height: 48px;
$footer-height: 150px;
.chat-model {
  width: $chat-model-width;
  height: 100%;
  background-color: #fff;
  .header {
    height: $header-height;
    padding: 0 20px;
    border-bottom: 1px solid $border-color;
    font-size: 18px;
  }
  & > .el-scrollbar {
    height: calc(100% - #{$header-height} - #{$footer-height});
  }
  .footer {
    height: $footer-height;
    border-top: 1px solid $border-color;
  }
}
</style>
