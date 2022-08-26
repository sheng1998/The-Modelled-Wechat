<template>
  <div class="chat-model">
    <template v-if="user">
      <div class="header flex-vertical-center">
        {{ user.username }}
      </div>
      <ElScrollbar></ElScrollbar>
      <div class="footer" @click="inputFocus">
        <ElScrollbar>
          <el-input
            ref="textareaRef"
            v-model="message"
            autosize
            resize="none"
            autofocus
            type="textarea"
            @keyup.ctrl.enter="send"
          />
        </ElScrollbar>
        <ElButton type="success" bg text @click="send">
          发送
        </ElButton>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import {
  ElScrollbar, ElInput, ElButton, ElMessage,
} from 'element-plus';
import { User } from '@/typings/user';

const props = defineProps({
  user: {
    type: Object as PropType<User>,
  },
});

const emits = defineEmits(['send']);

const message = ref('');
const send = () => {
  if (!message.value.trim()) {
    ElMessage.warning({
      message: '禁止发送空内容!',
      grouping: true,
    });
    return;
  }
  emits('send', message.value.trim(), props.user?.id || '');
};
const clearMessage = () => {
  message.value = '';
};

const textareaRef = ref<InstanceType<typeof ElInput> | null>(null);
const inputFocus = () => {
  textareaRef.value?.focus();
};

defineExpose({ clearMessage });
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
    & > .el-scrollbar {
      height: 110px;
    }
    .el-textarea {
      height: 110px;
      outline: none;
      border: none;
      :deep(.el-textarea__inner) {
        border: none;
        box-shadow: none;
        outline: none;
      }
    }
    .el-button {
      float: right;
      width: 100px;
      margin-right: 10px;
      color: #07c160;
      background-color: #e9e9e9 !important;
    }
  }
}
</style>
