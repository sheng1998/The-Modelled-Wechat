const path = require('path');
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html'
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createHtmlPlugin({ minify: true }),
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
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name: string) => {
            if (/^el-.+$/.test(name)) {
              name = name.replace('el-', '');
            } else if (name === 'v-loading') {
              name = 'loading';
            }
            return `element-plus/es/components/${name}/style/index`;
          },
        },
      ],
    }),
  ],
  server: {
    // 自动打开浏览器
    open: true,
    // 将 host 设置为 0.0.0.0 支持通过 ip 访问启动的项目
    host: '0.0.0.0',
    port: 8888,
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:3002/',
        // target: 'http://119.91.74.150:3002/',
        changeOrigin: true,
      },
    },
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
