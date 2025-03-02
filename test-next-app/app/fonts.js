/**
 * 测试用 Next.js 应用的字体配置
 *
 * 注意：在实际项目中，请使用相对于项目的正确路径
 */
import localFont from 'next/font/local';

// 使用完全硬编码的字面量配置
export const lxgwBright = localFont({
  src: [
    {
      path: '../../fonts/LXGWBright-Regular.0.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright',
  preload: false,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});