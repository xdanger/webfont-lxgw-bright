# LXGW Bright Webfont

这是一个为网页使用优化的[霞鹜晰黑](https://github.com/lxgw/LxgwBright)字体包。字体文件已被拆分成多个较小的子集，使其更适合在网页中使用。

[![npm](https://img.shields.io/npm/v/webfont-lxgw-bright.svg)](https://www.npmjs.com/package/webfont-lxgw-bright)
[![license](https://img.shields.io/github/license/xdanger/webfont-lxgw-bright.svg)](LICENSE)

## 特点

- 将大型字体文件（>4MB）拆分成较小的子集（通常 <200KB)
- 按Unicode范围进行拆分，确保每个文件大小适合网页加载
- 支持不同的字重和样式变体
- 简洁的JavaScript API
- 浏览器会自动只加载需要的字体子集，提高页面加载性能
- 支持Next.js优化字体加载
- 支持多字重混合使用，满足更丰富的排版需求

## 安装

```bash
npm install xdanger/webfont-lxgw-bright
```

或者使用yarn:

```bash
yarn add xdanger/webfont-lxgw-bright
```

## 使用方法

### 选项1: 通过CSS导入

在大多数项目中（使用webpack、Parcel等构建工具）：

```css
/* 在使用webpack/Parcel等构建工具的项目中 */
@import '~webfont-lxgw-bright';

body {
  font-family: 'LXGW Bright', sans-serif;
}
```

在不支持`~`别名的环境中，使用相对路径：

```css
/* 指定完整相对路径 */
@import '../node_modules/webfont-lxgw-bright/index.css';

body {
  font-family: 'LXGW Bright', sans-serif;
}
```

在现代项目中可以使用更简洁的导入（无需~前缀）：

```css
/* 现代构建工具通常可以解析这种导入 */
@import 'webfont-lxgw-bright';

body {
  font-family: 'LXGW Bright', sans-serif;
}
```

### 选项2: 在JavaScript中导入

```javascript
// 导入字体CSS
import 'webfont-lxgw-bright';

// 可选：使用提供的常量
import { LXGWBright } from 'webfont-lxgw-bright';

// 在样式中使用
element.style.fontFamily = LXGWBright;
```

### 选项3: 使用CLI安装到项目中

```bash
npx xdanger/webfont-lxgw-bright
```

这将把字体文件和CSS复制到你项目中的`fonts`目录。

### 选项4: 在React项目中使用

在React项目中有多种方式使用这个字体：

#### 方法1: 在入口文件中导入CSS

在你的应用入口文件(如`src/index.js`或`src/App.jsx`)中:

```javascript
// 导入字体CSS
import 'webfont-lxgw-bright';

function App() {
  return (
    <div style={{ fontFamily: 'LXGW Bright, sans-serif' }}>
      你好，这是霞鹜晰黑字体！
    </div>
  );
}
```

#### 方法2: 使用提供的常量

```javascript
import { LXGWBright } from 'webfont-lxgw-bright';
import 'webfont-lxgw-bright';

function App() {
  return (
    <div style={{ fontFamily: LXGWBright }}>
      你好，这是霞鹜晰黑字体！
    </div>
  );
}
```

#### 方法3: 使用配置函数

```javascript
import { configureLXGWBright } from 'webfont-lxgw-bright';
import 'webfont-lxgw-bright';

function App() {
  // 获取Medium斜体配置
  const fontConfig = configureLXGWBright({
    weight: 500,
    style: 'italic'
  });

  return (
    <div style={{
      fontFamily: fontConfig.fontFamily,
      fontWeight: fontConfig.fontWeight,
      fontStyle: fontConfig.fontStyle
    }}>
      你好，这是霞鹜晰黑字体的Medium斜体！
    </div>
  );
}
```

#### 方法4: 全局样式

如果你使用Styled Components:

```javascript
import { createGlobalStyle } from 'styled-components';
import { LXGWBright } from 'webfont-lxgw-bright';
import 'webfont-lxgw-bright';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${LXGWBright}, sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <div>你好，这是霞鹜晰黑字体！</div>
    </>
  );
}
```

如果使用CSS/SCSS模块:

```css
/* styles.css */
@import '~webfont-lxgw-bright';

body {
  font-family: 'LXGW Bright', sans-serif;
}
```

### 选项5: 在其他前端框架中使用

#### Next.js

对于Next.js项目，本包提供了专门优化的集成方式，使用原生字体优化功能而无需复制字体文件。

##### 基本用法 (App Router)

1. 创建字体配置文件:

```javascript
// app/fonts.js
import localFont from 'next/font/local';

// 必须使用硬编码的字面量配置
export const lxgwBright = localFont({
  src: [
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
```

> 注意：Next.js 要求字体配置必须使用硬编码的字面量，不能使用导入的配置对象

2. 在根布局文件中使用字体和样式:

```javascript
// app/layout.js
import { lxgwBright } from './fonts';
import 'webfont-lxgw-bright/next/styles.css'; // 导入切片字体CSS

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={lxgwBright.variable}>
      <body>{children}</body>
    </html>
  );
}
```

3. 在全局CSS中使用:

```css
/* app/globals.css */
body {
  font-family: var(--font-lxgw-bright), sans-serif;
}
```

或在组件中直接使用:

```javascript
// app/page.js
import { lxgwBright } from './fonts';

export default function Page() {
  return (
    <div className={lxgwBright.className}>
      你好，这是使用霞鹜晰黑字体的文本！
    </div>
  );
}
```

##### 混用多个字重

如果需要在页面中混用多个字重（如Regular、Medium、Light等），可以按照以下步骤配置:

1. 为每个字重单独配置:

```javascript
// app/fonts.js
import localFont from 'next/font/local';

// 常规字重 Regular (400)
export const lxgwBrightRegular = localFont({
  src: [
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

// 中等字重 Medium (500) - LXGW Bright 的最粗字重
export const lxgwBrightMedium = localFont({
  src: [
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.0.woff2',
      weight: '500',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright-medium',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
```

2. 在布局中同时应用所有字重:

```javascript
// app/layout.js
import { lxgwBrightRegular, lxgwBrightMedium } from './fonts';
import 'webfont-lxgw-bright/next/styles.css';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={`${lxgwBrightRegular.variable} ${lxgwBrightMedium.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

3. 在组件中使用不同字重:

```javascript
import { lxgwBrightRegular, lxgwBrightMedium } from './fonts';

export default function Page() {
  return (
    <div>
      <p className={lxgwBrightRegular.className}>
        这是常规字重文本
      </p>

      <p className={lxgwBrightMedium.className}>
        这是中等字重文本
      </p>

      <p className={lxgwBrightRegular.className}>
        这是常规文本，但这里有
        <span className={lxgwBrightMedium.className}>中等字重强调</span>
        的内容。
      </p>
    </div>
  );
}
```

更多混用多个字重的详细示例，请参考 [next/examples.js](https://github.com/xdanger/webfont-lxgw-bright/blob/main/next/examples.js)。

##### 在Pages Router中使用

对于使用Pages Router的Next.js项目:

```javascript
// pages/_app.js
import localFont from 'next/font/local';
import 'webfont-lxgw-bright/next/styles.css';

// 必须使用硬编码的字面量配置
const lxgwBright = localFont({
  src: [
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

function MyApp({ Component, pageProps }) {
  return (
    <main className={lxgwBright.variable}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
```

##### 在Tailwind CSS中使用

配置Tailwind:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lxgw-bright)', 'system-ui', 'sans-serif'],
        lxgw: ['var(--font-lxgw-bright)', 'sans-serif'],
      },
    },
  },
}
```

然后在组件中使用:

```javascript
export default function Page() {
  return (
    <div className="font-lxgw">
      你好，这是使用霞鹜晰黑字体的文本！
    </div>
  );
}
```

##### 高级配置

可以自定义字体加载行为:

```javascript
// lib/fonts.js
import localFont from 'next/font/local';

// 使用自定义配置
export const lxgwBrightCustom = localFont({
  src: [
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw',     // 自定义CSS变量名
  preload: false,              // 禁用预加载（推荐用于CJK字体）
  display: 'optional',         // 使用可选字体显示策略
  fallback: ['system-ui', 'sans-serif']  // 设置后备字体
});
```

##### 为什么这样设计?

我们的Next.js集成具有以下优势:

1. **无需复制字体文件** - 所有字体文件保留在node_modules中
2. **自动处理所有字体子集** - 不需要手动引用大量切片字体文件
3. **完全兼容Next.js字体优化** - 严格遵循Next.js字体加载规则
4. **简化使用流程** - 只需硬编码配置即可完成设置

完整示例请查看 [next/examples.js](https://github.com/xdanger/webfont-lxgw-bright/blob/main/next/examples.js)

## 项目结构

```
webfont-lxgw-bright/
├── fonts/            - 生成的字体子集文件
├── scripts/          - 开发者工具脚本
│   └── build-fonts.js        - 字体处理脚本（使用fonttools）
├── src/              - 源代码
│   └── cli.js        - CLI工具
├── src-fonts/        - 原始字体文件目录
├── test/             - 测试工具和示例
│   ├── index.html            - 基本字体显示测试
│   ├── performance-test.html - 性能对比测试
│   ├── test-font-subsets.js  - 字体子集分析工具
│   └── README.md             - 测试工具说明
├── index.js          - 主入口文件
└── index.css         - 生成的CSS文件
```

## 面向开发者/维护者

此包使用两种不同的工作流：

1. **用户安装流程** - 当用户安装此包时，他们只会获得已经处理好的字体文件和CSS，不需要任何字体处理工具
2. **开发维护流程** - 作为此包的维护者，你需要使用处理脚本来生成字体子集

### 开发工作流程

1. 将原始字体文件放入`src-fonts`目录
2. 安装Python fonttools及其依赖：

   ```bash
   pip install fonttools brotli zopfli
   ```

3. 运行字体处理脚本：

   ```bash
   npm run dev:build-fonts
   ```

脚本会处理字体，生成子集文件到`fonts`目录以及CSS文件。

### 发布新版本

1. 更新版本号：`npm version patch|minor|major`
2. 发布到npm：`npm publish`

## 测试工具

项目提供了全面的测试工具，用于验证字体子集化效果和性能：

```bash
# 运行字体子集分析工具
node test/test-font-subsets.js

# 在浏览器中打开基本测试页面
open test/index.html

# 在浏览器中打开性能测试页面
open test/performance-test.html
```

更多测试工具的详细信息，请查看 [test/README.md](test/README.md)。

## 许可证

本项目基于[SIL Open Font License 1.1](OFL.txt)发布。

霞鹜晰黑(LXGW Bright)字体版权归属原作者[落霞孤鹜lxgw](https://github.com/lxgw)
