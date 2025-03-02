/**
 * 测试用 Next.js 应用的布局文件
 */
import './globals.css'
import { lxgwBright, lxgwBrightLight, lxgwBrightMedium } from './fonts'

export const metadata = {
  title: 'LXGW Bright Test',
  description: 'Test app for LXGW Bright webfont',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={`${lxgwBright.variable} ${lxgwBrightLight.variable} ${lxgwBrightMedium.variable}`}>
      <body>{children}</body>
    </html>
  )
}