// 把 GitHub 渲染好的 README HTML 套上一层近似 github-markdown 的样式，用于本地视觉检查。
// 用法：node build/preview.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const body = readFileSync(resolve(root, 'build/body.json'), 'utf8');

const baseCss = `
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 24px 64px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "Microsoft YaHei", Helvetica, Arial, sans-serif;
    font-size: 16px; line-height: 1.6; -webkit-font-smoothing: antialiased;
    background: var(--bg); color: var(--fg);
  }
  .wrap { max-width: 880px; margin: 0 auto; }
  .hint { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
  img { max-width: 100%; height: auto; vertical-align: middle; }
  h3 {
    font-size: 1.5em; font-weight: 600; line-height: 1.25;
    margin: 28px 0 16px;
  }
  p { margin: 0 0 16px; }
  strong { font-weight: 600; }
  a { color: var(--link); text-decoration: none; }
  a:hover { text-decoration: underline; }
  table { border-collapse: collapse; display: block; width: 100%; margin: 0 0 16px; overflow: auto; }
  table th, table td { border: 1px solid var(--border); padding: 6px 13px; }
  table th { font-weight: 600; background: var(--bg-subtle); }
  table tr:nth-child(2n) td { background: var(--bg-subtle); }
  sub { font-size: .75em; line-height: 0; color: var(--muted); }
  ul { margin: 0 0 16px; padding-left: 2em; }
  li + li { margin-top: .35em; }
  blockquote {
    margin: 0 0 16px; padding: 0 1em; color: var(--fg);
    border-left: .25em solid var(--border);
  }
  blockquote p { margin: 0 0 12px; }
  blockquote p:last-child { margin-bottom: 0; }
  .center { text-align: center; }
  code { font-family: ui-monospace, Consolas, monospace; font-size: 85%; background: var(--bg-subtle); padding: .2em .4em; border-radius: 6px; }
`;

const themes = {
  light: {
    bg: '#ffffff', fg: '#1f2328', muted: '#59636e', border: '#d1d9e0',
    bgSubtle: '#f6f8fa', link: '#0969da',
  },
  dark: {
    bg: '#0d1117', fg: '#e6edf3', muted: '#9198a1', border: '#3d444d',
    bgSubtle: '#151b23', link: '#4493f8',
  },
};

function page(theme, html) {
  const t = themes[theme];
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>README preview · ${theme}</title>
<style>
  :root {
    --bg: ${t.bg}; --fg: ${t.fg}; --muted: ${t.muted};
    --border: ${t.border}; --bg-subtle: ${t.bgSubtle}; --link: ${t.link};
  }
  ${baseCss}
</style></head>
<body>
<div class="wrap">
  ${html}
</div>
</body></html>`;
}

// GitHub 的 <picture> 依赖深色偏好；本地预览直接按主题改写图片源。
// hero-light -> hero-dark，xxx -> xxx-dark，已经是 -dark 的原样保留。
const toDarkPath = (p) => {
  if (p.endsWith('-dark')) return p;
  return p.includes('-light') ? p.replace('-light', '-dark') : `${p}-dark`;
};

for (const theme of ['light', 'dark']) {
  // v2 的三块色场自带底色，没有暗色变体；只有确实存在 *-dark.svg 时才改写。
  const html = theme === 'dark'
    ? body.replace(/assets\/((?:[a-z0-9]+\/)*[a-z0-9-]+)\.svg/g, (m, p) => {
        const dark = `assets/${toDarkPath(p)}.svg`;
        return existsSync(resolve(root, dark)) ? dark : m;
      })
    : body;
  // 预览页放在仓库根目录，这样 assets/ 相对路径与 GitHub 上完全一致。
  writeFileSync(resolve(root, `preview-${theme}.html`), page(theme, html), 'utf8');
}
console.log('written: preview-light.html, preview-dark.html');
