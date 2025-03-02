/**
 * LXGW Bright Webfont - Next.js Integration
 *
 * This file provides an optimized font loading solution for Next.js projects
 * It directly uses font files from node_modules without copying them to the project
 */

// Export font name constant
export const LXGWBright = 'LXGW Bright';

/**
 * Provides LXGW Bright font for Next.js projects
 *
 * This module provides two ways to use:
 * 1. createLXGWBrightFont(): Create font loader function
 * 2. CSS rules for slice fonts: Import 'webfont-lxgw-bright/next/styles.css' to get
 */

/**
 * Create LXGW Bright font loader
 *
 * This function creates a font loader compatible with next/font/local
 * Only import a few core font files, and the rest of the slice fonts will be handled automatically via CSS
 *
 * @param {Function} localFont next/font/local函数
 * @param {Object} options 字体配置选项
 * @param {string} options.variable CSS变量名 (默认: '--font-lxgw-bright')
 * @param {boolean} options.preload 是否预加载 (默认: false，推荐用于CJK字体)
 * @param {string} options.display 字体显示方式 (默认: 'swap')
 * @param {boolean} options.fallback 是否使用备用字体 (默认: true)
 * @returns {Object} 返回字体配置对象
 *
 * @example
 * // In the fonts.js file of Next.js project:
 * import { createLXGWBrightFont } from 'webfont-lxgw-bright/next';
 * import localFont from 'next/font/local';
 *
 * export const lxgwBright = createLXGWBrightFont(localFont);
 */
export function createLXGWBrightFont(localFont, options = {}) {
  // Validate arguments
  if (typeof localFont !== 'function') {
    throw new Error('createLXGWBrightFont必须传入next/font/local函数');
  }

  const {
    variable = '--font-lxgw-bright',
    preload = false,
    display = 'swap',
    fallback = true
  } = options;

  // Create font configuration
  return localFont({
    src: [
      // Only include core font files, the rest will be handled automatically via CSS
      {
        path: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2'),
        weight: '400',
        style: 'normal',
      }
    ],
    variable,
    preload,
    display,
    fallback: fallback ? ['system-ui', 'sans-serif'] : undefined,
  });
}

/**
 * 使用指南
 *
 * 完整设置LXGW Bright字体需要两步:
 * 1. 创建字体加载器
 * 2. 导入切片字体CSS
 *
 * @example
 * // 1. 在fonts.js中创建字体加载器
 * import { createLXGWBrightFont } from 'webfont-lxgw-bright/next';
 * import localFont from 'next/font/local';
 *
 * export const lxgwBright = createLXGWBrightFont(localFont);
 *
 * // 2. 在layout.js中使用
 * import { lxgwBright } from './fonts';
 * import 'webfont-lxgw-bright/next/styles.css';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="zh-CN" className={lxgwBright.variable}>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 *
 * // 3. 在CSS或组件中使用
 * // 使用CSS变量
 * body {
 *   font-family: var(--font-lxgw-bright), sans-serif;
 * }
 * // 或者使用className
 * <div className={lxgwBright.className}>使用霞鹜晰黑字体</div>
 */
