# project-wide context

这是一个将 [LXGW Bright](https://github.com/lxgw/LxgwBright) 字体作为 Webfont 的项目。

目前 Google Fonts 上只有 [LXGW WenKai TC](https://fonts.google.com/specimen/LXGW+WenKai+TC) 和 [LXGW WenKai Mono TC](https://fonts.google.com/specimen/LXGW+WenKai+Mono+TC) 两款字体。

因为字体文件比较大，所以这个项目是用来实现类似 Google Fonts 的体验，将字体按 [Noto Serif SC](https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap) 里 unicode-range 的方式分包，并提供一个 CSS 文件，让用户可以方便地引用。

## 使用方式

npm 方式安装：

```bash
npm install @xdanger/webfont-lxgw-bright
```

直接引用 CSS：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/xdanger/webfont-lxgw-bright@latest/index.css">
```

或

```css
@import url('https://cdn.jsdelivr.net/gh/xdanger/webfont-lxgw-bright@latest/index.css');
```

### Next.js

项目还提供一个 Next.js 的组件，让用户可以方便地引用。

```tsx
import { LXGWBright } from '@xdanger/webfont-lxgw-bright/next';
```

## 测试

### /test/

`/test/index.html`

- 测试 CSS import 的方式是否正常工作
- 有性能测试的能力，测试在大量字符下字体的加载和渲染性能

### /test-next-app/

测试 Next.js 的框架下是否正常工作。
