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
- 自动化脚本生成Next.js字体配置，简化开发流程

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

### 选项5: 在Next.js中使用

对于Next.js项目，本包提供了专门优化的集成方式，使用原生字体优化功能而无需复制字体文件。

#### 方法1: 手动配置 (基础用法)

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

#### 方法2: 使用自动化脚本 (推荐)

为简化配置过程，本包提供了自动生成字体配置的脚本。这是推荐的方法，尤其是当需要使用多个字重和处理大量字体子集文件时。

1. 将脚本复制到项目中:

```javascript
// scripts/generate-fonts.js
/**
 * 自动生成 fonts.js 配置文件
 *
 * 此脚本会扫描 node_modules/webfont-lxgw-bright/fonts 目录下的所有字体文件，
 * 并为每种字重生成完整的 Next.js localFont 配置。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置项
const config = {
  fontDir: path.resolve(__dirname, '../node_modules/webfont-lxgw-bright/fonts'),
  outputFile: path.resolve(__dirname, '../app/fonts.js'),
  fontWeights: ['Regular', 'Light', 'Medium'],
  fontExportNames: {
    'Regular': 'lxgwBright',
    'Light': 'lxgwBrightLight',
    'Medium': 'lxgwBrightMedium'
  },
  fontWeightValues: {
    'Regular': '400',
    'Light': '300',
    'Medium': '500'
  },
  // 范围编号组，方便添加注释
  rangeGroups: {
    '0-3': '基本拉丁字符和扩展拉丁字符集',
    '4-5': 'CJK符号和标点',
    '20-29': '中日韩统一表意文字(CJK Unified Ideographs) 第一组',
    '30-39': '中日韩统一表意文字 第二组',
    '40-49': '中日韩统一表意文字 第三组',
    '50-57': '中日韩统一表意文字 第四组'
  }
};

/**
 * 获取指定字重的所有字体文件
 * @param {string} weight 字重名称 (Regular|Light|Medium)
 * @returns {string[]} 字体文件列表
 */
function getFontFiles(weight) {
  try {
    // 使用命令行查找所有匹配的.woff2文件并按数字排序
    const command = `find ${config.fontDir} -name "LXGWBright-${weight}.*.woff2" | sort -V`;
    const output = execSync(command).toString().trim();
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`无法获取${weight}字重的字体文件:`, error);
    return [];
  }
}

/**
 * 从文件路径中提取序号
 * @param {string} filePath 文件路径
 * @returns {string} 序号
 */
function extractNumberFromPath(filePath) {
  const fileName = path.basename(filePath);
  const match = fileName.match(/\.(\d+)\.woff2$/);
  return match ? match[1] : '';
}

/**
 * 将驼峰命名转换为连字符分隔的小写形式
 * @param {string} str 驼峰命名的字符串
 * @returns {string} 转换后的字符串
 */
function camelToKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 生成单个字体的配置代码
 * @param {string} weight 字重名称
 * @param {string[]} files 字体文件列表
 * @returns {string} 配置代码
 */
function generateFontConfig(weight, files) {
  const exportName = config.fontExportNames[weight];
  const fontWeight = config.fontWeightValues[weight];

  // 正确格式化CSS变量名: 变成 --font-lxgw-bright-light 这种格式
  const cssVarName = `--font-${camelToKebabCase(exportName)}`;

  let lastGroupComment = '';
  let srcItems = files.map(file => {
    const relativePath = `../node_modules/webfont-lxgw-bright/fonts/${path.basename(file)}`;
    const number = extractNumberFromPath(file);

    // 检查是否需要添加分组注释
    let commentLine = '';
    for (const [range, comment] of Object.entries(config.rangeGroups)) {
      const [start, end] = range.split('-').map(Number);
      const num = parseInt(number, 10);
      if (num >= start && num <= end) {
        const groupComment = `// ${comment}`;
        if (groupComment !== lastGroupComment) {
          lastGroupComment = groupComment;
          commentLine = groupComment;
        }
        break;
      }
    }

    return [
      commentLine ? `    ${commentLine}` : null,
      `    {`,
      `      path: '${relativePath}',`,
      `      weight: '${fontWeight}',`,
      `      style: 'normal',`,
      `    }`
    ].filter(Boolean).join('\n');
  });

  return `export const ${exportName} = localFont({
  src: [
${srcItems.join(',\n')}
  ],
  variable: '${cssVarName}',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});`;
}

// 主函数
function main() {
  console.log('开始生成fonts.js文件...');

  // 收集所有字重的文件
  const fontsByWeight = {};
  for (const weight of config.fontWeights) {
    const files = getFontFiles(weight);
    if (files.length === 0) {
      console.warn(`警告: 未找到${weight}字重的字体文件`);
      continue;
    }
    fontsByWeight[weight] = files;
    console.log(`找到${weight}字重的字体文件: ${files.length}个`);
  }

  // 生成配置代码
  let configCode = `/**
 * 自动生成的 Next.js 字体配置文件
 * 由 scripts/generate-fonts.js 脚本生成
 * 生成时间: ${new Date().toISOString()}
 *
 * 包含以下字重:
 * ${config.fontWeights.map(w => `- ${w} (${config.fontWeightValues[w]})`).join('\n * ')}
 */
import localFont from 'next/font/local';

`;

  // 为每个字重生成配置
  for (const weight of config.fontWeights) {
    if (fontsByWeight[weight]) {
      configCode += generateFontConfig(weight, fontsByWeight[weight]) + '\n\n';
    }
  }

  // 写入文件
  fs.writeFileSync(config.outputFile, configCode);
  console.log(`字体配置已成功写入: ${config.outputFile}`);
}

// 执行主函数
main();
```

2. 将脚本添加到package.json中:

```json
{
  "scripts": {
    "generate-fonts": "node scripts/generate-fonts.js"
  }
}
```

3. 运行脚本生成配置:

```bash
npm run generate-fonts
```

4. 在布局中使用生成的字体配置:

```javascript
// app/layout.js
import { lxgwBright, lxgwBrightLight, lxgwBrightMedium } from './fonts';
import 'webfont-lxgw-bright/next/styles.css';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={`${lxgwBright.variable} ${lxgwBrightLight.variable} ${lxgwBrightMedium.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

自动生成脚本的优势:

- **自动扫描所有字体文件** - 无需手动列出数十个字体文件路径
- **自动分类字体子集** - 根据Unicode范围组织字体文件，提供注释说明
- **标准化变量命名** - 使用一致的kebab-case格式，如 `--font-lxgw-bright-light`
- **灵活配置** - 可以轻松添加或移除字重，修改导出名称
- **提高开发效率** - 减少手动编写配置的时间和错误

#### 多字重混合使用

使用自动生成的字体配置后，可以轻松地在页面中混用多个字重:

```javascript
import { lxgwBright, lxgwBrightLight, lxgwBrightMedium } from './fonts';

export default function Page() {
  return (
    <div>
      {/* 方法1: 使用className（推荐） */}
      <div className={lxgwBright.className}>
        <p>这是使用霞鹜晰黑常规字重(400)的文本</p>
      </div>

      <div className={lxgwBrightLight.className}>
        <p>这是使用霞鹜晰黑轻量字重(300)的文本</p>
      </div>

      <div className={lxgwBrightMedium.className}>
        <p>这是使用霞鹜晰黑中等字重(500)的文本</p>
      </div>

      {/* 方法2: 使用CSS变量 */}
      <p style={{ fontFamily: 'var(--font-lxgw-bright)' }}>
        这段文本使用CSS变量设置常规字体
      </p>

      <p style={{ fontFamily: 'var(--font-lxgw-bright-light)' }}>
        这段文本使用CSS变量设置轻量字体
      </p>

      <p style={{ fontFamily: 'var(--font-lxgw-bright-medium)' }}>
        这段文本使用CSS变量设置中等字体
      </p>
    </div>
  );
}
```

#### 在Tailwind CSS中使用

配置Tailwind:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lxgw-bright)', 'system-ui', 'sans-serif'],
        lxgw: ['var(--font-lxgw-bright)', 'sans-serif'],
        'lxgw-light': ['var(--font-lxgw-bright-light)', 'sans-serif'],
        'lxgw-medium': ['var(--font-lxgw-bright-medium)', 'sans-serif'],
      },
    },
  },
}
```

然后在组件中使用:

```javascript
export default function Page() {
  return (
    <div>
      <p className="font-lxgw">这是常规字重文本</p>
      <p className="font-lxgw-light">这是轻量字重文本</p>
      <p className="font-lxgw-medium">这是中等字重文本</p>
    </div>
  );
}
```

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
