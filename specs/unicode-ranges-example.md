# Unicode Ranges 示例配置

由于缺少原始的 TTF 字体文件，我们无法使用 `fonttools` 来生成子集文件。但是，我们可以手动创建一个使用 `unicode-range` 的 CSS 配置，展示如何应用从 Google Fonts 提取的 Unicode 范围。

## 配置示例

下面是如何使用从 Google Fonts 提取的 Unicode 范围来创建 CSS：

```css
/* 从 unicode-ranges.json 中提取的第一个范围 */
@font-face {
  font-family: 'LXGW Bright';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./fonts/LXGWBright-Regular.woff2') format('woff2'),
       url('./fonts/LXGWBright-Regular.woff') format('woff');
  unicode-range: U+1f921-1f930, U+1f932-1f935, U+1f937-1f939, U+1f940-1f944, U+1f947-1f94a;
}

/* 从 unicode-ranges.json 中提取的第二个范围 */
@font-face {
  font-family: 'LXGW Bright';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./fonts/LXGWBright-Regular.woff2') format('woff2'),
       url('./fonts/LXGWBright-Regular.woff') format('woff');
  unicode-range: U+1f950-1f95f, U+1f962-1f967, U+1f969-1f96a, U+1f980-1f981, U+1f984-1f98d;
}

/* 更多范围... */
```

## 使用指南

要正确实现基于 Unicode 范围的字体子集化，您需要：

1. 获取原始的 TTF 字体文件：

   ```
   LXGWBright-Regular.ttf
   LXGWBright-Light.ttf
   LXGWBright-Medium.ttf
   等
   ```

2. 安装所需的工具：

   ```bash
   pip install fonttools brotli zopfli
   ```

3. 使用 `scripts/build-fonts.js` 脚本来处理字体：

   ```bash
   node scripts/build-fonts.js
   ```

   该脚本会：
   - 读取 `scripts/unicode-ranges.json` 中的 Unicode 范围
   - 为每个范围创建字体子集
   - 生成包含所有子集的 CSS 文件

## 更新 Unicode 范围

如果您想更新 Unicode 范围，可以：

1. 运行 `extract-unicode-ranges.js` 脚本：

   ```bash
   node scripts/extract-unicode-ranges.js
   ```

2. 脚本会从 Google Fonts 提取最新的 Unicode 范围，并将其保存到 `scripts/unicode-ranges.json` 文件中。

## 创建 TTF 字体文件的建议

如果您没有原始的 TTF 字体文件，可以采取以下方法之一：

1. 从官方源下载 TTF 版本的字体
2. 使用专业的字体转换工具（如 FontForge）将 WOFF/WOFF2 转换为 TTF
3. 联系字体作者获取 TTF 版本

## 注意事项

- 虽然可以手动创建带有 `unicode-range` 的 CSS，但无法实现真正的子集化（即减小字体文件大小）
- 浏览器仍会下载完整的字体文件，但只会使用指定 Unicode 范围内的字符
- 真正的子集化需要使用像 `fonttools` 这样的工具，将字体文件分割成多个较小的文件
