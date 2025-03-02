/**
 * LXGW Bright Webfont - Next.js 使用示例
 *
 * 本文件提供在 Next.js 项目中使用 LXGW Bright 字体的完整示例代码
 *
 * 注意: Next.js 要求字体配置必须使用硬编码的字面量，不能使用导入的配置对象
 */

//==============================================================================
// 示例 1: 基本用法 (App Router)
//==============================================================================

/**
 * 第1步: 创建字体配置文件
 * @filename: app/fonts.js
 */
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
// 示例 4: 其他字体配置
//==============================================================================

/**
 * 自定义字体配置
 * @filename: lib/fonts.js
 */
/*
import localFont from 'next/font/local';

// 使用自定义变量名配置
export const lxgwBrightCustom = localFont({
  src: [
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw',
  preload: false,
  display: 'optional',
  fallback: ['system-ui', 'sans-serif'],
});

// 使用无后备字体配置
export const lxgwBrightNoFallback = localFont({
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
});
*/