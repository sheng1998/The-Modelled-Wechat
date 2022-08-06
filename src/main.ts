import { createApp } from 'vue';
import { router } from '@/router';
import App from './App.vue';

import '$style/normalize.css';
import '$style/global.scss';

const app = createApp(App);
app.use(router);

// 路由器初始化后再挂载app（不然setup里可能获取不到route.query）
router.isReady().then(() => {
  app.mount('#app');
});
