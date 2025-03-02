/**
 * 测试用 Next.js 应用的页面文件
 */
import { lxgwBright } from './fonts';

export default function Home() {
  return (
    <div className={lxgwBright.className} style={{ padding: '2rem' }}>
      <h1>LXGW Bright 字体测试</h1>
      <p>这是使用霞鹜晰黑字体的文本。</p>
      <p>这是包含中文和英文的混合文本: Hello, 你好，世界!</p>
      <p>这是一些数字和符号: 1234567890 !@#$%^&*()</p>
    </div>
  );
}