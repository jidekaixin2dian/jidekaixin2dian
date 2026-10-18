// 生成正文收尾的页脚带：一条细线 + 居中的品牌口号。
// 亮/暗各一套。用法：node build/footer.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 96;
const M = 76;
const RIGHT = W - M;
const CENTER = W / 2;

const MONO = "'JetBrains Mono','Cascadia Mono','Consolas','SFMono-Regular',ui-monospace,monospace";

const themes = {
  light: { muted: '#5c5f55', line: '#111311', lineOpacity: 0.16, accent: '#c8f663' },
  dark: { muted: '#a2a69a', line: '#f3f4ed', lineOpacity: 0.18, accent: '#c8f663' },
};

const MOTTO = 'KEEP CURIOUS. KEEP BUILDING.';

function svg(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${MOTTO}">
  <line x1="${M}" y1="28" x2="${RIGHT}" y2="28" stroke="${t.line}" stroke-opacity="${t.lineOpacity}" stroke-width="1"/>
  <rect x="${M}" y="25" width="26" height="6" rx="3" fill="${t.accent}"/>
  <text x="${CENTER}" y="77" text-anchor="middle" font-family="${MONO}" font-size="15" letter-spacing="6" fill="${t.muted}">${MOTTO}</text>
</svg>
`;
}

mkdirSync(resolve(root, 'assets'), { recursive: true });
writeFileSync(resolve(root, 'assets/footer.svg'), svg(themes.light), 'utf8');
writeFileSync(resolve(root, 'assets/footer-dark.svg'), svg(themes.dark), 'utf8');
console.log('written: assets/footer.svg, assets/footer-dark.svg');
