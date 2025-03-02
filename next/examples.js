/**
 * LXGW Bright Webfont - Next.js使用示例
 *
 * 本文件提供在Next.js项目中使用LXGW Bright字体的完整示例代码
 */

//==============================================================================
// 示例 1: 基本用法 (App Router)
//==============================================================================

/**
 * 第1步: 创建fonts.js
 *
 * @filename: app/fonts.js 或 lib/fonts.js
 */
import { createLXGWBrightFont } from 'webfont-lxgw-bright/next';
import localFont from 'next/font/local';

// 创建字体加载器
export const lxgwBright = createLXGWBrightFont()(localFont);

/**
 * 第2步: 在根布局文件中使用
 *
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
 * 第3步: 在组件或全局CSS中使用
 *
 * @filename: app/globals.css
 */
/*
body {
  font-family: var(--font-lxgw-bright), sans-serif;
}
*/

/**
 * 或在组件中直接使用
 *
 * @filename: app/page.js
 */
/*
import { lxgwBright } from './fonts';

export default function Page() {
  return (
    <div className={lxgwBright.className}>
      你好，这是使用霞鹜晰黑字体的文本！
    </div>
  );
}
*/

//==============================================================================
// 示例 2: 在Pages Router中使用
//==============================================================================

/**
 * @filename: lib/fonts.js
 */
/*
import { createLXGWBrightFont } from 'webfont-lxgw-bright/next';
import localFont from 'next/font/local';

export const lxgwBright = createLXGWBrightFont()(localFont);
*/

/**
 * @filename: pages/_app.js
 */
/*
import { lxgwBright } from '../lib/fonts';
import 'webfont-lxgw-bright/next/styles.css';

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
// 示例 3: 在Tailwind CSS中使用
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

/**
 * 然后在组件中使用Tailwind类
 *
 * @filename: app/page.js
 */
/*
export default function Page() {
  return (
    <div className="font-lxgw">
      你好，这是使用霞鹜晰黑字体的文本！
    </div>
  );
}
*/

//==============================================================================
// 示例 4: 高级配置
//==============================================================================

/**
 * 自定义字体配置选项
 *
 * @filename: lib/fonts.js
 */
/*
import { createLXGWBrightFont } from 'webfont-lxgw-bright/next';
import localFont from 'next/font/local';

// 使用自定义配置
export const lxgwBright = createLXGWBrightFont({
  variable: '--font-lxgw', // 自定义CSS变量名
  preload: false, // 禁用预加载（推荐用于CJK字体）
  display: 'optional', // 使用可选字体显示策略
  fallback: true, // 启用后备字体
})(localFont);
*/