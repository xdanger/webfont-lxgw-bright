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

```css
@import '~webfont-lxgw-bright';

body {
  font-family: 'LXGWBright', sans-serif;
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

## 高级配置

可以使用配置函数来自定义字体设置：

```javascript
import { configureLXGWBright } from 'webfont-lxgw-bright';

// 配置字体选项
configureLXGWBright({
  weight: 400, // 可选值: 300 (Light), 400 (Regular), 500 (Medium)
  style: 'normal' // 可选值: 'normal', 'italic'
});
```

## 支持的字体变体

- LXGWBright-Light (300)
- LXGWBright-LightItalic (300 italic)
- LXGWBright-Regular (400)
- LXGWBright-Italic (400 italic)
- LXGWBright-Medium (500)
- LXGWBright-MediumItalic (500 italic)

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
