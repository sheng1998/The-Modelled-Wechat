const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login_or_register/index.vue'),
  },
];

export default routes;
