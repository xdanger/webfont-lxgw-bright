/**
 * LXGW Bright Webfont - Next.js Integration
 *
 * 为 Next.js 提供 LXGW Bright 字体的路径和使用指南
 */

// Export font name constant
export const LXGWBright = 'LXGW Bright';

/**
 * 字体文件路径
 *
 * 导出字体文件的路径，供 Next.js 字体加载器使用
 */
export const fontPath = {
  // Regular weight (400)
  regular: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2'),
  // Light weight (300)
  light: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-Light.0.woff2'),
  // Medium weight (500)
  medium: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-Medium.0.woff2'),
  // Regular italic
  italic: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-Italic.0.woff2'),
  // Light italic
  lightItalic: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-LightItalic.0.woff2'),
  // Medium italic
  mediumItalic: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-MediumItalic.0.woff2'),
};

/**
 * Next.js Font 加载指南
 *
 * Next.js 要求字体配置必须是硬编码的字面量，不能使用导入的配置对象。
 *
 * 正确用法:
 *
 * ```javascript
 * // app/fonts.js
 * import localFont from 'next/font/local';
 *
 * // 必须使用硬编码的字面量配置
 * export const lxgwBright = localFont({
 *   src: [
 *     {
 *       path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2',
 *       weight: '400',
 *       style: 'normal',
 *     },
 *     // 添加其他字重和风格
 *     {
 *       path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.0.woff2',
 *       weight: '300',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.0.woff2',
 *       weight: '500',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Italic.0.woff2',
 *       weight: '400',
 *       style: 'italic',
 *     },
 *     {
 *       path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-LightItalic.0.woff2',
 *       weight: '300',
 *       style: 'italic',
 *     },
 *     {
 *       path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-MediumItalic.0.woff2',
 *       weight: '500',
 *       style: 'italic',
 *     }
 *   ],
 *   variable: '--font-lxgw-bright',
 *   preload: false,
 *   display: 'swap',
 *   fallback: ['system-ui', 'sans-serif'],
 * });
 * ```
 *
 * 推荐配置:
 * - variable: '--font-lxgw-bright' (用于 CSS 变量)
 * - preload: false (CJK 字体推荐)
 * - display: 'swap' 或 'optional'
 * - fallback: ['system-ui', 'sans-serif']
 *
 * 同时导入切片字体CSS:
 *
 * ```javascript
 * // app/layout.js
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
 * ```
 */
