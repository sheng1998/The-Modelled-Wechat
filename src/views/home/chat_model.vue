<template>
  <div class="chat-model">
    <template v-if="user">
      <div class="header flex-vertical-center">
        {{ user.username }}
      </div>
      <ElScrollbar ref="scrollbarRef" class="message-wrap">
        <!-- TODO 根据消息类型渲染 -->
        <div v-if="user.messages.length" id="message-wrap">
          <div
            v-for="message in user.messages"
            :key="message.id"
            class="message"
            :class="{ my: message.send_user_id === userStore.id }"
          >
            <div class="time">
              {{ formatTime(message.time) }}
            </div>
            <div class="body flex">
              <div class="avatar flex-center" :class="{ robot: user.isRobot }">
                <img
                  v-if="message.send_user_id === userStore.id"
                  :src="userStore.avatar || '/avatar/avatar_01.png'"
                  :alt="userStore.username"
                />
                <span v-else-if="user.isRobot" :class="['iconfont', user.avatar]"></span>
                <img v-else :src="user.avatar || '/avatar/avatar_01.png'" :alt="user.username" />
              </div>
              <div class="content">
                <!-- 处理换行事件 -->
                <div v-for="(item, index) in message.message.split('\n')" :key="index">
                  {{ item || ' ' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElScrollbar>
      <div :class="['footer', { 'has-toolbar': !user.isRobot }]" @click="inputFocus">
        <div v-if="!user.isRobot" class="toolbar flex-vertical-center">
          <span class="iconfont icon-emoji"></span>
          <span class="iconfont icon-image"></span>
          <span class="iconfont icon-file"></span>
        </div>
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
        <ElButton type="success" bg text @click="send"> 发送 </ElButton>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';
import { ElScrollbar, ElInput, ElButton, ElMessage } from 'element-plus';
import { formatTime } from '@/utils/time';
import { User } from '@/typings/user';
import { useUserStore } from '@/store/user';

const emits = defineEmits(['send']);

const props = defineProps({
  user: {
    type: Object as PropType<User>,
  },
});

// 用户的状态信息
const userStore = useUserStore();

const message = ref('');
// 发送消息
const send = () => {
  if (!message.value.trim()) {
    ElMessage.warning({
      message: '禁止发送空内容!',
      grouping: true,
    });
    return;
  }
  emits('send', message.value.trim(), props.user?.id || '', 'text');
};
// 清空消息
const clearMessage = () => {
  message.value = '';
};

// 输入框对象
const textareaRef = ref<InstanceType<typeof ElInput> | null>(null);
// 输入框聚焦
const inputFocus = () => {
  textareaRef.value?.focus();
};

const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null);
// 消息列表滚动到底部
const scrollbarToBottom = () => {
  setTimeout(() => {
    scrollbarRef.value?.setScrollTop(document.getElementById('message-wrap')?.clientHeight || 0);
    scrollbarRef.value?.update();
  }, 0);
};

defineExpose({ message, clearMessage, scrollbarToBottom });

watch(
  () => props.user,
  (user) => {
    clearMessage();
    scrollbarToBottom();
    inputFocus();
    message.value = user?.input || '';
  },
);
</script>

<style lang="scss" scoped>
@import '$style/variable';
$header-height: 48px;
$footer-height: 150px;
$footer-textarea-height: 110px;
$footer-toolbar-height: 28px;
$background-color: #f5f5f5;

@mixin triangle-style($direction: left, $color: #fff, $size: 8px) {
  position: absolute;
  top: 10px;
  width: 0;
  height: 0;
  border-top: $size solid transparent;
  border-bottom: $size solid transparent;
  content: '';

  @if $direction == left {
    left: calc(-1 * #{$size});
    border-right: $size solid $color;
  } @else {
    right: calc(-1 * #{$size});
    border-left: $size solid $color;
  }
}

.chat-model {
  width: $chat-model-width;
  height: 100%;
  background-color: $background-color;
  .header {
    height: $header-height;
    padding: 0 20px;
    border-bottom: 1px solid $border-color;
    font-size: 18px;
  }
  & > .el-scrollbar {
    height: calc(100% - #{$header-height} - #{$footer-height});
  }
  .message-wrap {
    padding: 20px;
    #message-wrap {
      display: inline-block;
      width: 100%;
    }
    .message {
      width: 100%;
      & + .message {
        margin-top: 30px;
      }
      .content {
        position: relative;
        padding: 10px;
        border-radius: 6px;
      }
      .time {
        margin-bottom: 5px;
        font-size: 14px;
        color: #b9b9b9;
      }
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
    }
    .message:not(.my) {
      padding-right: 30%;
      .content {
        background-color: #fff;
        &::before {
          @include triangle-style(left, #fff);
        }
      }
    }
    .message.my {
      float: right;
      padding-left: 30%;
      .body {
        flex-direction: row-reverse;
      }
      .content {
        background-color: #95ec69;
        &::before {
          @include triangle-style(right, #95ec69);
        }
      }
      .avatar {
        margin-right: 0;
        margin-left: 12px;
      }
      .time {
        text-align: right;
      }
    }
    .robot.avatar {
      color: #fff;
      background-color: #1677d2;
      span {
        font-size: 22px;
      }
    }
  }
  .footer {
    height: $footer-height;
    border-top: 1px solid $border-color;
    .toolbar {
      height: $footer-toolbar-height;
      padding: 0 10px;
      .iconfont {
        font-size: 20px;
        cursor: pointer;
      }
      .iconfont + .iconfont {
        margin-left: 15px;
      }
    }
    & > .el-scrollbar {
      height: $footer-textarea-height;
    }
    .el-textarea {
      height: $footer-textarea-height;
      border: none;
      outline: none;
      /* stylelint-disable-next-line selector-class-pattern */
      :deep(.el-textarea__inner) {
        border: none;
        outline: none;
        box-shadow: none;
      }
      :deep(textarea) {
        background-color: $background-color;
      }
    }
    &.has-toolbar > .el-scrollbar {
      height: calc(#{$footer-textarea-height} - #{$footer-toolbar-height});
      .el-textarea {
        height: calc(#{$footer-textarea-height} - #{$footer-toolbar-height});
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
