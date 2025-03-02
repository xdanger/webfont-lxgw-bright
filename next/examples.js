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

//==============================================================================
// 示例 5: 混用多个字重
//==============================================================================

/**
 * 配置多个字重
 * @filename: app/fonts.js
 */
/*
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

// 细体字重 Light (300)
export const lxgwBrightLight = localFont({
  src: [
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.0.woff2',
      weight: '300',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright-light',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
*/

/**
 * 在布局中应用所有字重
 * @filename: app/layout.js
 */
/*
import { lxgwBrightRegular, lxgwBrightMedium, lxgwBrightLight } from './fonts';
import 'webfont-lxgw-bright/next/styles.css';

export default function RootLayout({ children }) {
  // 将所有字重变量组合应用到HTML元素
  return (
    <html lang="zh-CN" className={`
      ${lxgwBrightRegular.variable}
      ${lxgwBrightMedium.variable}
      ${lxgwBrightLight.variable}
    `}>
      <body>{children}</body>
    </html>
  );
}
*/

/**
 * 在组件中使用不同字重
 * @filename: app/page.js
 */
/*
import { lxgwBrightRegular, lxgwBrightMedium, lxgwBrightLight } from './fonts';

export default function Page() {
  return (
    <div style={{ padding: '2rem' }}>
      // 使用常规字重
      <p className={lxgwBrightRegular.className}>
        这是使用常规字重(Regular)的文本
      </p>

      // 使用中等字重
      <p className={lxgwBrightMedium.className}>
        这是使用中等字重(Medium)的文本
      </p>

      // 使用细体字重
      <p className={lxgwBrightLight.className}>
        这是使用细体字重(Light)的文本
      </p>

      // 在一个段落中混用不同字重
      <p className={lxgwBrightRegular.className}>
        这是常规字重文本，但这里有
        <span className={lxgwBrightLight.className}> 细体字重 </span>
        和
        <span className={lxgwBrightMedium.className}> 中等字重 </span>
        的强调内容。
      </p>
    </div>
  );
}
*/

/**
 * 结合Tailwind CSS使用多个字重
 * @filename: tailwind.config.js
 */
/*
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'lxgw': ['var(--font-lxgw-bright)'],
        'lxgw-medium': ['var(--font-lxgw-bright-medium)'],
        'lxgw-light': ['var(--font-lxgw-bright-light)'],
      },
    },
  },
}
*/