// 生成正文的章节标题条：标题 + 标题下的绿色横线 + 延伸到右端的细线 + 右下角英文小标签。
// 贴左对齐（x=0），与 README 正文的左边缘一致；亮/暗各一套。
// 用法：node build/sections.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 88;

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

const TITLE_SIZE = 34;
const RULE_Y = 56.5;

function svg(t, { title, label, chars }) {
  // 中文全角字宽约等于字号，粗体略宽；这一段的长度要够绿线，不能让它压到后面的细线。
  const titleWidth = Math.round(chars * TITLE_SIZE * 1.04);
  const ruleStart = titleWidth + 22;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}">
  <text x="0" y="44" font-family="${SANS}" font-size="${TITLE_SIZE}" font-weight="700" letter-spacing="1" fill="${t.ink}">${title}</text>
  <rect x="0" y="54" width="${titleWidth}" height="5" rx="2.5" fill="${t.accent}"/>
  <line x1="${ruleStart}" y1="${RULE_Y}" x2="${W}" y2="${RULE_Y}" stroke="${t.line}" stroke-opacity="${t.lineOpacity}" stroke-width="1"/>
  <text x="${W}" y="82" text-anchor="end" font-family="${MONO}" font-size="12" letter-spacing="3.2" fill="${t.muted}">${label}</text>
</svg>
`;
}

mkdirSync(resolve(root, 'assets/marks'), { recursive: true });
for (const s of sections) {
  writeFileSync(resolve(root, `assets/marks/${s.file}.svg`), svg(themes.light, s), 'utf8');
  writeFileSync(resolve(root, `assets/marks/${s.file}-dark.svg`), svg(themes.dark, s), 'utf8');
}
console.log('written: section-01 / section-02 (light + dark)');
