# **开发文档**

> 程序员cc

---

# **001 - 集成工具 🚀**

> 工欲善其事，必先利其器

## 1. vite+vue3+TypeScript - 创建项目

**环境**：Node.js

**使用：**

1. 创建项目

```bash
npm create vite@latest
```

2. 这会提示你输入项目名称，接着选择模板

```bash
Project name: vue3-ts-vite-app
Select a framework: » vue
Select a variant: » TypeScript
```

3. 进入项目，安装依赖

```bash
npm install
```

4. 运行项目

```bash
npm dev
```

## 2. Docsify - 构建项目文档

**简介**：Docsify 是一个可以 **快速构建文档网站** 的开源工具。和传统静态网站生成器不同，Docsify **不需要预生成 HTML 文件**
，它是通过
**动态加载 Markdown 文件** 在客户端进行渲染的！这意味着，你的文档可以边写边看，更新非常方便。简直就是为我们这种爱折腾的程序员量身定制的工具！😎

**环境**：Node.js

**使用**

1. 安装依赖

```bash
npm install  docsify-cli
```

2. 创建目录 - 通过编辑README.md文件编写笔记

```bash
docsify init ./docs
```

3. 运行

```bash
docsify serve docs -p 9521 -o
```

## 3. Ant design Vue - UI组件库

**环境**：Node.js

**使用**

1. 安装依赖

```bash
npm install ant-design-vue@4.x --savenpm install unplugin-vue-components -D
```

2. 安装图标库

```bash
npm install @ant-design/icons-vue

```

3. 在项目`src/main.ts` 中引入 Ant Design Vue

```typescript
import {createApp} from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

app.use(Antd)

app.mount('#app')
```

### 4. ESLint - 规范化代码风格

**简介**：ESLint 是一款强大的 JavaScript 代码分析工具，它帮助开发者在编写代码时保持一致的代码风格和更高的代码质量。通过使用
ESLint，可以自动检测代码中的潜在问题，确保整个项目符合团队的代码标准。

**环境**：Node.js

**使用**

1. 安装依赖

```bash
npm init @eslint/config@latest
```

2. 配置 ESLint

根据项目的需求，选择不同的配置项。ESLint 提供了许多内置规则和插件，可以根据需要进行配置。

3. 在项目中使用

安装好 ESLint 后，可以通过以下命令来检查项目代码中的问题：

```bash
npx eslint <file_name_or_directory>
```

可以在 `package.json` 中添加自定义的命令脚本，方便项目的代码检查：

```json
{
  "scripts": {
    "lint": "eslint src/**/*.ts"
  }
}
```

---

### 5. UnoCSS - 原子化 CSS 库

**简介**：UnoCSS 是一款高效、灵活的原子化 CSS 引擎，它支持多种预设和配置，允许你在项目中快速开发自定义的 CSS
样式。它的核心理念是通过原子化的方式为项目中的每个元素提供最小的样式规则，从而提升项目的开发效率和性能。

**环境**：Node.js

**使用**

1. 安装依赖

```bash
npm install -D unocss
```

2. 配置 UnoCSS

在项目的 `vite.config.ts` 中进行 UnoCSS 的配置：

```typescript
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

export default defineConfig({
    plugins: [
        vue(),
        UnoCSS(),
    ],
});
```

3. 创建 UnoCSS 配置文件

在项目根目录下创建 `uno.config.ts` 文件，编写基本的预设配置：

```typescript
import {defineConfig} from 'unocss';

export default defineConfig({
    presets: [
        // 使用默认的 UnoCSS 预设
        require('unocss/preset-uno'),
    ],
});
```

4. 引入 UnoCSS 样式

在项目的 `src/main.ts` 中引入 UnoCSS：

```typescript
import 'uno.css';
```

---

### 6. OpenAPI - API 代码生成工具

**简介**：OpenAPI 是一种用于描述 RESTful API 的规范，它能够帮助开发者轻松生成客户端代码、服务端代码以及 API 文档。通过集成
OpenAPI，可以在项目中自动生成接口相关的代码，减少手动编写接口代码的工作量。

**环境**：Node.js

**使用**

1. 安装依赖

```bash
npm install @openapitools/openapi-generator-cli -g
```

2. 使用 OpenAPI 生成代码

```bash
openapi-generator-cli generate -i <OpenAPI文件路径> -g <生成器类型> -o <输出目录>
```

例如，生成 Vue 3 + TypeScript 客户端代码：

```bash
openapi-generator-cli generate -i <OpenAPI文件路径> -g typescript-axios -o src/api
```

3. 将生成的 API 代码集成到项目中

在项目中引入生成的 API 代码并进行调用：

```typescript
import {Configuration, UserApi} from './api';

// 初始化 API 配置
const apiConfig = new Configuration({
    basePath: 'http://localhost:8080',
});

// 使用 User API 进行用户相关操作
const userApi = new UserApi(apiConfig);

// 调用接口
userApi.getUserById(1).then((user) => {
    console.log('用户信息:', user);
});

```

---

# **002 - 项目实现🖥️**

## 一. 用户模块

### 1. 用户注册

- 验证用户是否被注册
- 验证两次输入密码是否相同
- 字段校验
- 密码的加密

### 2. 用户登录

- 验证加密密码
- 极验验证码
- 手机号登录
- 手机验证码
- token