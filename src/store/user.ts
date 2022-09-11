import { defineStore } from 'pinia';
import { Router } from 'vue-router';
import request from '@/server';
import { User } from '@/typings/user';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: '',
    username: '',
    avatar: '',
    privileges: 1,
  }),
  actions: {
    // 设置用户信息
    setUserInfo(info: Partial<User>) {
      for (const key in info) {
        if (Object.prototype.hasOwnProperty.call(info, key)) {
          // @ts-ignore
          this[key] = info[key];
        }
      }
    },
    // 检查用户登录状态
    async checkLogin(router: Router) {
      try {
        const { data } = await request.get('/user/check');
        this.setUserInfo(data.data);
      } catch (error) {
        if ((error as any)?.code === 1) {
          router.replace({ name: 'Login' });
        }
      }
    },
  },
});
