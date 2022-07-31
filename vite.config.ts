const path = require('path');
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html'

// 自动按需引入相关第三方库
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createHtmlPlugin({ minify: true }),
    AutoImport({
      // 这里除了引入 vue 以外还可以引入pinia、vue-router、vueuse等，
      // 甚至你还可以使用自定义的配置规则，见 https://github.com/antfu/unplugin-auto-import#configuration
      imports: ['vue'],
      // 第三方组件库的解析器
      resolvers: [ElementPlusResolver()],
      // 配置文件生成目录，默认生成在根目录，为了避免ts报错，所以放到src目录下
      // 需要将生成的配置文件加到 .eslintignore 中
      dts: './src/auto-imports.d.ts',
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      // 自动引入后为了防止 tslint 和 eslint 报错，需要生成 eslintrc 规则，并在 .eslintrc.json 中声明
      // ! 注意 这里 ./.eslintrc-auto-import.json 这个文件必需先有了才能在 .eslintrc.json 中声明
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
    Components({
      // dirs 指定组件所在位置，默认为 src/components
      // 可以让我们使用自己定义组件的时候免去 import 的麻烦
      dirs: [],
      // 配置需要将哪些后缀类型的文件进行自动按需引入
      extensions: ['vue'],
      // 解析的 UI 组件库(Element-Plus)
      resolvers: [ElementPlusResolver()],
      // 配置文件生成目录，默认生成在根目录，为了避免ts报错，所以放到src目录下
      // 需要将生成的配置文件加到 .eslintignore 中
      dts: './src/components.d.ts'
    }),
    legacy({
      targets: ['Firefox 54', 'chrome 48', 'ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ],
      modernPolyfills: ['es.string.replace-all'],
    }),
  ],
  server: {
    // 自动打开浏览器
    open: true,
    // 将 host 设置为 0.0.0.0 支持通过 ip 访问启动的项目
    host: '0.0.0.0',
    port: 8888,
  },
  build: {
    minify: 'terser',
    target: 'chrome63',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name.endsWith('.ttf') || name.endsWith('.woff') || name.endsWith('.woff2')) {
            return 'assets/font/[name]-[hash].[ext]';
          } else if (
            name.endsWith('.png') ||
            name.endsWith('.jpg') ||
            name.endsWith('.jpeg') ||
            name.endsWith('.webp') ||
            name.endsWith('.svg') ||
            name.endsWith('.gif')
          ) {
            return 'assets/image/[ext]/[name]-[hash].[ext]';
          }
          return 'assets/[ext]/[name]-[hash].[ext]';
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      '$style': path.resolve(__dirname, './src/assets/css'),
    },
  },
  base: './',
});
