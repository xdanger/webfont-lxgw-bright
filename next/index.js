/**
 * LXGW Bright Webfont - Next.js Integration
 *
 * This file provides an optimized font loading solution for Next.js projects
 * It directly uses font files from node_modules without copying them to the project
 */

// Export font name constant
export const LXGWBright = 'LXGW Bright';

/**
 * 获取 LXGW Bright 字体配置
 *
 * 此函数返回用于 next/font/local 的配置对象
 * 符合 Next.js 对字体加载器的严格要求
 *
 * @param {Object} options 字体配置选项
 * @param {string} options.variable CSS变量名 (默认: '--font-lxgw-bright')
 * @param {boolean} options.preload 是否预加载 (默认: false，推荐用于CJK字体)
 * @param {string} options.display 字体显示方式 (默认: 'swap')
 * @param {boolean} options.fallback 是否使用备用字体 (默认: true)
 * @returns {Object} 返回可直接传递给 localFont() 的配置对象
 *
 * @example
 * // 在 Next.js 项目的 fonts.js 文件中:
 * import { getLXGWBrightConfig } from 'webfont-lxgw-bright/next';
 * import localFont from 'next/font/local';
 *
 * // 正确用法: 直接将配置传递给 localFont
 * export const lxgwBright = localFont(getLXGWBrightConfig());
 */
export function getLXGWBrightConfig(options = {}) {
  const {
    variable = '--font-lxgw-bright',
    preload = false,
    display = 'swap',
    fallback = true
  } = options;

  // 返回字体配置对象
  return {
    src: [
      // 仅包含核心字体文件，其余通过CSS自动处理
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
  };
}

/**
 * 使用指南
 *
 * 完整设置LXGW Bright字体需要两步:
 * 1. 使用 localFont 创建字体加载器
 * 2. 导入切片字体CSS
 *
 * @example
 * // 1. 在fonts.js中创建字体加载器
 * import { getLXGWBrightConfig } from 'webfont-lxgw-bright/next';
 * import localFont from 'next/font/local';
 *
 * // 重要: 直接调用 localFont 并传入配置
 * export const lxgwBright = localFont(getLXGWBrightConfig());
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
 */
