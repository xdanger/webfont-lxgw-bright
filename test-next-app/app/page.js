/**
 * 测试用 Next.js 应用的页面文件
 */
import { lxgwBright, lxgwBrightLight, lxgwBrightMedium } from './fonts';

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className={lxgwBright.className} style={{ fontSize: '2em', marginBottom: '1.5rem' }}>LXGW Bright 字体测试</h1>

      <section style={{ marginBottom: '3rem' }}>
        <h2 className={lxgwBright.className} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>常规字重 Regular (400)</h2>
        <div className={lxgwBright.className}>
          <p>这是使用霞鹜晰黑常规字重的文本。</p>
          <p>这是包含中文和英文的混合文本: Hello, 你好，世界!</p>
          <p>这是一些数字和符号: 1234567890 !@#$%^&*()</p>
          <p style={{ fontSize: '1.5rem' }}>更大尺寸的中英文混排: Typography 字体排印</p>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 className={lxgwBrightLight.className} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>细体字重 Light (300)</h2>
        <div className={lxgwBrightLight.className}>
          <p>这是使用霞鹜晰黑细体字重的文本。</p>
          <p>这是包含中文和英文的混合文本: Hello, 你好，世界!</p>
          <p>这是一些数字和符号: 1234567890 !@#$%^&*()</p>
          <p style={{ fontSize: '1.5rem' }}>更大尺寸的中英文混排: Typography 字体排印</p>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 className={lxgwBrightMedium.className} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>中等字重 Medium (500)</h2>
        <div className={lxgwBrightMedium.className}>
          <p>这是使用霞鹜晰黑中等字重的文本。</p>
          <p>这是包含中文和英文的混合文本: Hello, 你好，世界!</p>
          <p>这是一些数字和符号: 1234567890 !@#$%^&*()</p>
          <p style={{ fontSize: '1.5rem' }}>更大尺寸的中英文混排: Typography 字体排印</p>
        </div>
      </section>

      <section>
        <h2 className={lxgwBright.className} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>使用CSS变量</h2>
        <p style={{
          fontFamily: 'var(--font-lxgw-bright)',
          marginBottom: '1rem'
        }}>
          这段文本使用CSS变量 --font-lxgw-bright 设置常规字体
        </p>
        <p style={{
          fontFamily: 'var(--font-lxgw-bright-light)',
          marginBottom: '1rem'
        }}>
          这段文本使用CSS变量 --font-lxgw-bright-light 设置细体字体
        </p>
        <p style={{
          fontFamily: 'var(--font-lxgw-bright-medium)',
          marginBottom: '1rem'
        }}>
          这段文本使用CSS变量 --font-lxgw-bright-medium 设置中等字体
        </p>
      </section>
    </div>
  );
}