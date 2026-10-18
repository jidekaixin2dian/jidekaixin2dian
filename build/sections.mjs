// 生成正文的章节标题条：左侧绿色记号 + 中文标题 + 细线 + 右端英文小标签。
// 亮/暗各一套，因为细线和文字颜色要跟着页面主题走。
// 用法：node build/sections.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 80;
const M = 76; // 左留白，与 hero 对齐
const RIGHT = W - M;

const SANS = "'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans SC','Source Han Sans SC',sans-serif";
const MONO = "'JetBrains Mono','Cascadia Mono','Consolas','SFMono-Regular',ui-monospace,monospace";

const themes = {
  light: { ink: '#111311', muted: '#5c5f55', line: '#111311', lineOpacity: 0.16, accent: '#c8f663' },
  dark: { ink: '#f3f4ed', muted: '#a2a69a', line: '#f3f4ed', lineOpacity: 0.18, accent: '#c8f663' },
};

const sections = [
  { file: 'section-01', title: '正在做', label: 'BUILDING', chars: 3 },
  { file: 'section-02', title: '做事的方式', label: 'METHOD', chars: 5 },
];

// 中文全角字宽约等于字号，粗体略宽，留足余量后细线才不会压到标题。
const TITLE_SIZE = 34;
const TITLE_X = 104;
const RULE_GAP = 30;

function svg(t, { title, label, chars }) {
  const titleWidth = chars * TITLE_SIZE * 1.04;
  const ruleStart = Math.round(TITLE_X + titleWidth + RULE_GAP);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}">
  <rect x="${M}" y="20" width="6" height="44" rx="3" fill="${t.accent}"/>
  <text x="${TITLE_X}" y="56" font-family="${SANS}" font-size="${TITLE_SIZE}" font-weight="700" letter-spacing="1" fill="${t.ink}">${title}</text>
  <line x1="${ruleStart}" y1="45" x2="${RIGHT - 108}" y2="45" stroke="${t.line}" stroke-opacity="${t.lineOpacity}" stroke-width="1"/>
  <text x="${RIGHT}" y="50" text-anchor="end" font-family="${MONO}" font-size="12" letter-spacing="3.2" fill="${t.muted}">${label}</text>
</svg>
`;
}

mkdirSync(resolve(root, 'assets'), { recursive: true });
for (const s of sections) {
  writeFileSync(resolve(root, `assets/${s.file}.svg`), svg(themes.light, s), 'utf8');
  writeFileSync(resolve(root, `assets/${s.file}-dark.svg`), svg(themes.dark, s), 'utf8');
}
console.log('written: section-01 / section-02 (light + dark)');
