# LXGW Bright 字体子集化工作流程

## 概述

LXGW Bright 是一个优化的 Web 字体项目，旨在通过子集化技术减少字体文件大小，提高网页加载速度。本文档描述了字体子集化的工作流程、技术实现以及使用方法。

## 技术背景

Web 字体在网页加载时会消耗大量带宽，尤其是中文等 CJK 字体。为了优化加载性能，我们采用了以下技术：

1. **Unicode 范围分割**: 将字体按照 Unicode 范围分割成多个子集
2. **按需加载**: 浏览器只下载网页中实际使用的字符集
3. **优化的分割策略**: 参考 Google Fonts 的分割策略，确保子集划分合理高效

## 工作流程

整个字体子集化工作流程包含两个主要步骤：

1. **Unicode 范围获取**: 从 Google Fonts 获取优化的 Unicode 范围划分
2. **字体子集生成**: 使用这些 Unicode 范围生成字体子集文件

### 1. Unicode 范围获取

我们创建了一个脚本 `extract-unicode-ranges.js`，它能够：

- 从 Google Fonts 服务获取特定字体的 CSS 文件
- 解析 CSS 文件中的 unicode-range 声明
- 为每个范围添加有意义的名称（基于 Unicode 区块）
- 将结果保存为 JSON 文件供字体生成脚本使用

### 2. 字体子集生成

字体子集生成由 `build-fonts.js` 脚本完成，它：

- 读取 unicode-ranges.json 文件中的 Unicode 范围
- 使用 fonttools (pyftsubset) 工具根据这些范围创建字体子集
- 为每个子集生成 TTF、WOFF 和 WOFF2 格式的文件
- 生成包含所有子集的 CSS 文件

## 文件结构

```
/
├── scripts/
│   ├── build-fonts.js             # 字体子集生成脚本
│   ├── extract-unicode-ranges.js  # 从 Google Fonts 提取 Unicode 范围的脚本
│   └── unicode-ranges.json        # 存储 Unicode 范围数据
├── src-fonts/                     # 原始字体文件
├── fonts/                         # 生成的字体子集文件
├── temp/                          # 临时文件目录
└── index.css                      # 生成的 CSS 文件
```

## 使用方法

### 前提条件

1. 安装 Node.js (v14+)
2. 安装 fonttools：`pip install fonttools brotli zopfli`

### 更新 Unicode 范围

如果您想更新用于子集化的 Unicode 范围：

```bash
# 从 Google Fonts 提取最新的 Unicode 范围
node scripts/extract-unicode-ranges.js
```

这将创建/更新 `scripts/unicode-ranges.json` 文件。

### 生成字体子集

```bash
# 构建所有字体子集和 CSS 文件
node scripts/build-fonts.js
```

这将：

1. 读取 `scripts/unicode-ranges.json` 中的 Unicode 范围
2. 在 `fonts/` 目录中生成字体子集文件
3. 创建一个 `index.css` 文件，其中包含所有字体子集的 @font-face 声明

## 技术实现细节

### Unicode 范围提取

`extract-unicode-ranges.js` 脚本使用以下步骤提取 Unicode 范围：

1. 使用标准的 HTTPS 请求从 Google Fonts 获取 CSS 文件
2. 使用正则表达式解析所有 `@font-face` 块和它们的 `unicode-range` 属性
3. 通过查找 Unicode 区块定义为每个范围添加有意义的名称
4. 将结果保存为结构化的 JSON 文件

### 字体子集生成

`build-fonts.js` 脚本使用 fonttools (pyftsubset) 执行以下操作：

1. 读取 JSON 文件中的 Unicode 范围（如果文件不存在，则使用默认范围）
2. 为每个 Unicode 范围创建字体子集
3. 每个子集生成多种格式（TTF、WOFF、WOFF2）
4. 生成包含所有子集的 CSS 文件，使用 `unicode-range` 属性指定适用的字符范围

## 优势

此工作流程带来的主要优势：

1. **减少下载大小**: 浏览器只下载页面中使用的字符集
2. **加快加载速度**: 较小的文件更快下载，提高网页性能
3. **维护简便**: 范围更新与字体生成分离，使维护更容易
4. **与 Google Fonts 一致**: 遵循行业标准的字体分割策略

## 自定义配置

如需添加不同字重或样式的字体变体，可以在 `build-fonts.js` 中的 `fontConfigs` 数组中添加配置：

```javascript
const fontConfigs = [
  configureLXGWBright({ weight: '400', style: 'normal' }),
  configureLXGWBright({ weight: '700', style: 'normal' }),
  // 添加更多配置...
];
```

## 故障排除

### 找不到 Unicode 范围文件

如果 `unicode-ranges.json` 文件不存在或无法读取，脚本会自动使用内置的默认范围。要重新生成范围文件，请运行：

```bash
node scripts/extract-unicode-ranges.js
```

### fonttools 错误

如果遇到 fonttools 相关错误，请确保：

1. 已正确安装 fonttools：`pip install fonttools brotli zopfli`
2. Python 和 pip 已添加到系统 PATH 中
3. 字体文件存在于 `src-fonts` 目录中

## 参考资料

- [Google Fonts CSS API](https://developers.google.com/fonts/docs/css2)
- [fonttools 文档](https://fonttools.readthedocs.io/en/latest/)
- [MDN Web Docs: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [Unicode 区块](https://www.unicode.org/charts/)
