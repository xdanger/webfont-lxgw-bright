/**
 * LXGW Bright Webfont - Next.js 使用示例
 *
 * 本文件提供在 Next.js 项目中使用 LXGW Bright 字体的完整示例代码
 */

//==============================================================================
// 示例 1: 基本用法 (App Router)
//==============================================================================

/**
 * 第1步: 创建字体配置文件
 * @filename: app/fonts.js
 */
import { getLXGWBrightConfig } from 'webfont-lxgw-bright/next';
import localFont from 'next/font/local';

// 创建字体加载器 - 注意：直接调用 localFont
export const lxgwBright = localFont(getLXGWBrightConfig());

/**
 * 第2步: 在根布局文件中使用
 * @filename: app/layout.js
 */
import { lxgwBright } from './fonts';
import 'webfont-lxgw-bright/next/styles.css'; // 导入切片字体CSS

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={lxgwBright.variable}>
      <body>{children}</body>
    </html>
  );
}

/**
 * 第3步: 在全局CSS或组件中使用
 * @filename: app/globals.css
 */
/*
body {
  font-family: var(--font-lxgw-bright), sans-serif;
}
*/

//==============================================================================
// 示例 2: Pages Router
//==============================================================================

/**
 * @filename: pages/_app.js
 */
/*
import { getLXGWBrightConfig } from 'webfont-lxgw-bright/next';
import localFont from 'next/font/local';
import 'webfont-lxgw-bright/next/styles.css';

// 创建字体加载器 - 必须在模块顶层直接调用 localFont
const lxgwBright = localFont(getLXGWBrightConfig());

function MyApp({ Component, pageProps }) {
  return (
    <main className={lxgwBright.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
*/

//==============================================================================
// 示例 3: Tailwind CSS
//==============================================================================

/**
 * @filename: tailwind.config.js
 */
/*
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
*/

//==============================================================================
// 示例 4: 高级配置
//==============================================================================

/**
 * 自定义字体配置选项
 * @filename: lib/fonts.js
 */
/*
import { getLXGWBrightConfig } from 'webfont-lxgw-bright/next';
import localFont from 'next/font/local';

// 使用自定义配置 - 注意：配置是传给 localFont 的
export const lxgwBright = localFont(getLXGWBrightConfig({
  variable: '--font-lxgw',     // 自定义CSS变量名
  preload: false,              // 禁用预加载（推荐用于CJK字体）
  display: 'optional',         // 使用可选字体显示策略
  fallback: true,              // 启用后备字体
}));
*/