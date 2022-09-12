# 仿微信聊天室项目-前端

## 项目描述

这是一个基于 `vue3 + element-plus + vite3` 的仿微信聊天室项目。

## 开发环境

* node版本：16.14.2
* 浏览器：chrome 99.0.4844.51
* vscode版本：1.66.2

## 项目初始化和构建流程

> 需要注意的是在 `git commit` 的时候会默认检测代码的eslint规范、stylelint规范、commitlint规范, 其中任意一个规范不符合要求都将会 `commit` 失败。(如需关闭这一限制则需要删除 **.husky** 目录, 或者在执行 `npm install` 指令之前将 [package.json](package.json) 的 script 里面的 `"prepare": "husky install",` 和 `"lint-staged": "lint-staged"` 这两行删除。)

### 1、依赖包安装

```shell
npm install
```

### 2、运行开发服

```shell
npm run dev
```

### 3、项目构建

```shell
npm run build
```

### 4、文件 eslint 检测并修复文件 eslint 报错

```shell
npm run lint:fix
```

## 线上预览地址

[github-page](https://sheng1998.github.io/The-Modelled-Wechat/)
[临时IP](http://119.91.74.150:3000/#/)

## package.json 的部分 script 说明

### 源码

```json
{
  "scripts": {
    "eslint": "eslint . --ext .js,.jsx,.ts,.tsx,.vue",
    "eslint:fix": "eslint . --fix --ext .js,.jsx,.ts,.tsx,.vue",
    "lint": "npm run eslint & npm run stylelint",
    "lint:fix": "npm run eslint:fix & npm run stylelint:fix",
    "stylelint": "stylelint \"./**/*.{css,scss,sass,vue,html}\"",
    "stylelint:fix": "stylelint \"./**/*.{css,scss,sass,vue,html}\" --fix",
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "prepare": "husky install",
    "lint-staged": "lint-staged"
  }
}
```

### 说明

#### eslint

> 使用 `eslint` **校验**项目中以 `.js、.jsx、.ts、.tsx、.vue` 为后缀的文件

参考: [https://juejin.cn/post/7118294114734440455](https://juejin.cn/post/7118294114734440455)

* 在项目根目录的 **[.eslintignore](.eslintignore)** 文件中配置忽略校验的文件或目录
* 在项目根目录的 **[.eslintrc.json](.eslintrc.json)** 文件中配置校验的规则以及使用的插件
* 如果 `eslint` 规范和 `.prettierr` 规范冲突了, 以 **[.prettierrc](.prettierrc)** 为准

##### 配置过程

* 安装

```shell
npm install eslint -D
```

* 初始化

```shell
npx eslint --init
```

* 初始化的所有选择如下(加粗的为项目选择的):
  * Ok to proceed? (y) **y**
  * How would you like to use ESLint? **To check syntax and find problems**
  * What type of modules does your project use? **JavaScript modules (import/export)**
  * Which framework does your project use? **Vue.js**
  * Does your project use TypeScript? **Yes**
  * Where does your code run? **Browser**
  * What format do you want your config file to be in? **JavaScript**
  * Would you like to install them now with npm? **Yes**

* 依赖安装完成后，会生成 **.eslintrc.js** 配置文件(本项目修改了后缀, 对应文件为: **[.eslintrc.json](.eslintrc.json)**)

#### eslint:fix

> 使用 `eslint` **修复**项目中以 `.js、.jsx、.ts、.tsx、.vue` 为后缀的文件(只会修复部分不符合 eslint 规范的语法)

#### stylelint

> 使用 `stylelint` **校验**项目中以 `.css、.scss、.sass、.vue、.html` 为后缀的文件

参考: [https://juejin.cn/post/7118294114734440455](https://juejin.cn/post/7118294114734440455)

* 在项目根目录的 **[.stylelintignore](.stylelintignore)** 文件中配置忽略校验的文件或目录
* 在项目根目录的 **[.stylelintrc.js](.stylelintrc.js)** 文件中配置校验的规则以及使用的插件
  * rules[order/properties-order] 中配置样式书写的顺序

##### 配置过程

* 安装

```shell
npm install stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order -D
```

* 增加 [.stylelintrc.js](.stylelintrc.js) 配置文件

#### stylelint:fix

> 使用 `stylelint` **修复**项目中以 `.css、.scss、.sass、.vue、.html` 为后缀的文件(只会修复部分不符合 stylelint 规范的语法)

#### prepare

> 在执行 `npm install` 指令后立即执行 `husky install` 指令, 用于初始化 `husky` 脚本。改脚本作用于 `git commit` 时, 用于检测代码的**eslint规范**、**stylelint规范**、**commitlint规范**, 其中任意一个规范不符合要求都将会 `commit` 失败。(如需关闭这一限制则需要删除 **.husky** 目录, 或者在执行 `npm install` 指令之前将 [package.json](package.json) 的 script 里面的 `"prepare": "husky install",` 和 `"lint-staged": "lint-staged"` 这两行删除。)

* 执行该指令后会在根目录生成一个 **.husky** 目录，目录下面有两个文件 `.husky\_\.gitignore` 和 [.husky\_\husky.sh](.husky\_\husky.sh)
  * 其中文件 [.husky\_\husky.sh](.husky\_\husky.sh) 为 `husky` 执行脚本
* [.husky\commit-msg](.husky\commit-msg) 和 [.husky\pre-commit](.husky\pre-commit) 两个文件是与 `husky` 脚本相关的两个文件
  * [.husky\commit-msg](.husky\commit-msg) 是配置 `git commit` 时校验 `commit` 备注的脚本文件
  * [.husky\pre-commit](.husky\pre-commit) 是配置 `git commit` 前要执行的其他指令的脚本文件

##### commitlint 相关

* 安装相关包

```shell
npm install @commitlint/cli @commitlint/config-conventional -D
```

* 初始化配置文件

```shell
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

* 生成的配置文件为: [commitlint.config.js](commitlint.config.js), 有其他需求可在该文件修改配置。

* 添加 **commit-msg** hook

```shell
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

* 添加 **pre-commit** hook
  * [.lintstagedrc](.lintstagedrc) 为 `npm run lint-staged` 的配置文件

```shell
npx husky add .husky/pre-commit "npm run lint-staged"
```

#### lint-staged

> 作为 husky 的辅助工具, 配置文件为 `npm run lint-staged`, 用于在 `git commit` 之前执行某些指令
