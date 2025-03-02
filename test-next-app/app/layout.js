/**
 * 测试用 Next.js 应用的布局文件
 */
import { lxgwBright } from './fonts';
import '../../next/styles.css';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={lxgwBright.variable}>
      <body>{children}</body>
    </html>
  );
}