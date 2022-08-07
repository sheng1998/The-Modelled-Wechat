const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login_or_register/index.vue'),
  },
];

export default routes;
