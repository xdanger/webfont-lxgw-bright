# LXGW Bright Web 字体开发者指南

## 介绍

LXGW Bright Web 字体项目提供了优化的中文 Web 字体，通过字体子集化技术大幅减少字体文件体积，提升网页加载速度。本指南将帮助开发者了解如何在项目中使用 LXGW Bright Web 字体，以及如何参与项目开发。

## 目录

- [安装和使用](#安装和使用)
- [CSS 集成](#css-集成)
- [字体子集划分](#字体子集划分)
- [项目开发](#项目开发)
- [常见问题](#常见问题)

## 安装和使用

### 通过 NPM 安装

```bash
npm install webfont-lxgw-bright
```

### 直接使用 CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/webfont-lxgw-bright/index.css">
```

## CSS 集成

### 在 CSS 中引用

安装包后，您可以在 CSS 文件中直接导入：

```css
@import 'webfont-lxgw-bright';

body {
  font-family: 'LXGW Bright', sans-serif;
}
```

### 在 Webpack/Next.js 项目中

在应用入口文件中导入：

```javascript
// 在入口文件如 app.js 或 _app.js 中
import 'webfont-lxgw-bright';
```

然后在样式文件中使用：

```css
body {
  font-family: 'LXGW Bright', sans-serif;
}
```

### 在 Tailwind CSS 中

在 `tailwind.config.js` 中配置字体：

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'lxgw': ['"LXGW Bright"', 'sans-serif'],
      },
    },
  },
  // ...其他配置
}
```

然后在 HTML 中使用：

```html
<p class="font-lxgw">这是使用了 LXGW Bright 字体的文本</p>
```

## 字体子集划分

LXGW Bright Web 字体使用 Google Fonts 的子集划分策略，将字体分为多个子集。浏览器会根据网页中实际使用的字符，只下载所需的子集文件，大幅减少下载量。

### 子集化的优势

- **减少下载量**：用户只下载页面上实际使用的字符
- **加快页面加载**：小文件加载更快，并行下载更高效
- **优化缓存**：不同页面可能复用相同的子集文件

### 注意事项

- 子集划分基于 Unicode 区块，确保常用字符集分组合理
- 开发时不需要手动指定使用哪些子集，浏览器会自动管理
- 如需测试特定子集的加载，可查看 `unicode-ranges.json` 文件中的范围定义

## 项目开发

如果您想参与项目开发或自定义字体子集，请按照以下步骤操作：

### 环境设置

1. 克隆仓库：

   ```bash
   git clone https://github.com/username/webfont-lxgw-bright.git
   cd webfont-lxgw-bright
   ```

2. 安装依赖：

   ```bash
   npm install
   pip install fonttools brotli zopfli
   ```

### 更新 Unicode 范围

如需更新字体子集的 Unicode 范围划分：

1. 修改 `scripts/extract-unicode-ranges.js` 中的 `CSS_URL` 变量，指向所需的 Google Fonts CSS URL。

2. 运行脚本提取 Unicode 范围：

   ```bash
   node scripts/extract-unicode-ranges.js
   ```

3. 检查生成的 `scripts/unicode-ranges.json` 文件，确认范围正确。

### 构建字体子集

修改 `scripts/build-fonts.js` 中的配置（如需要），然后构建字体子集：

```bash
node scripts/build-fonts.js
```

构建完成后，检查 `fonts/` 目录和 `index.css` 文件是否生成正确。

### 添加新的字体变体

如需添加新的字体变体（如粗体、斜体等）：

1. 将原始字体文件（TTF 格式）添加到 `src-fonts/` 目录。

2. 修改 `scripts/build-fonts.js` 中的 `fontConfigs` 数组：

   ```javascript
   const fontConfigs = [
     configureLXGWBright({ weight: '400', style: 'normal' }),
     configureLXGWBright({ weight: '700', style: 'normal' }), // 添加粗体
     // 其他变体...
   ];
   ```

3. 重新构建字体子集。

## 常见问题

### 字体没有正确加载

可能的原因：

- CSS 文件未正确引入
- 字体名称拼写错误
- 服务器配置不允许字体文件的 CORS 访问

解决方案：

- 检查浏览器控制台是否有网络错误
- 确认 `font-family` 拼写正确
- 确保服务器配置了正确的 MIME 类型和 CORS 头

### 特定字符显示为方框

可能的原因：

- 该字符不在字体的 Unicode 范围内
- 子集文件下载失败

解决方案：

- 检查字符的 Unicode 编码是否在字体支持范围内
- 查看网络请求确认所有必要的子集文件都已下载

### 如何检查哪些子集文件被下载

1. 打开浏览器开发者工具
2. 切换到网络标签
3. 筛选字体文件（如 .woff2）
4. 刷新页面查看加载的文件

### 自定义字体子集

如果您需要使用自定义的 Unicode 范围划分：

1. 直接编辑 `scripts/unicode-ranges.json` 文件
2. 如需添加全新的范围，可参考 [Unicode 区块表](https://www.unicode.org/charts/)
3. 重新运行 `build-fonts.js` 生成字体文件

## 贡献指南

我们欢迎社区贡献，特别是以下方面：

- 改进字体子集划分策略
- 添加更多字体变体
- 优化构建脚本
- 更新文档和示例

如果您想贡献代码，请：

1. Fork 本项目
2. 创建特性分支
3. 提交更改
4. 创建 Pull Request

## 许可证

本项目使用 [SIL Open Font License](https://scripts.sil.org/OFL) 许可证。
