/// <reference types="vite/client" />

declare module 'js-pinyin';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}
