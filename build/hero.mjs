// 生成 README 顶部主视觉：同一套版式，亮/暗两种色板。
// 用法：node build/hero.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 420;
const M = 76; // 左右留白

const SANS = "'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans SC','Source Han Sans SC',sans-serif";
const MONO = "'JetBrains Mono','Cascadia Mono','Consolas','SFMono-Regular',ui-monospace,monospace";

const themes = {
  light: {
    bg: '#f3f4ed', ink: '#111311', muted: '#5c5f55', card: '#fbfbf6',
    accent: '#c8f663', accentInk: '#111311', line: '#111311', lineOpacity: 0.12,
    grid: '#111311', gridOpacity: 0.045,
  },
  dark: {
    bg: '#111311', ink: '#f3f4ed', muted: '#a2a69a', card: '#171a16',
    accent: '#c8f663', accentInk: '#111311', line: '#f3f4ed', lineOpacity: 0.15,
    grid: '#f3f4ed', gridOpacity: 0.05,
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function gridLines(t) {
  const out = [];
  for (let x = 60; x < W; x += 60) {
    out.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${t.grid}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>`);
  }
  for (let y = 60; y < H; y += 60) {
    out.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${t.grid}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>`);
  }
  return out.join('\n    ');
}

function ledger(t, rows) {
  const cardX = 712;
  const cardY = 88;
  const cardW = 412;
  const cardH = 248;
  const labelX = cardX + 30;
  const valueX = cardX + cardW - 28;
  const firstRowY = 176;
  const step = 46;

  const rowsSvg = rows.map((r, i) => {
    const y = firstRowY + i * step;
    const sep = i === 0
      ? `<line x1="${labelX}" y1="148" x2="${valueX}" y2="148" stroke="${t.line}" stroke-opacity="${t.lineOpacity}" stroke-width="1"/>`
      : `<line x1="${labelX}" y1="${y - 30}" x2="${valueX}" y2="${y - 30}" stroke="${t.line}" stroke-opacity="${t.lineOpacity}" stroke-width="1"/>`;
    return `${sep}
    <text x="${labelX}" y="${y}" font-family="${SANS}" font-size="16" fill="${t.muted}">${esc(r.label)}</text>
    <text x="${valueX}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="30" font-weight="700" fill="${t.ink}">${esc(r.value)}</text>`;
  }).join('\n    ');

  return `<g>
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="22" fill="${t.card}" stroke="${t.line}" stroke-opacity="${t.lineOpacity}" stroke-width="1.2"/>
    <circle cx="${labelX + 4}" cy="120" r="4" fill="${t.accent}"/>
    <text x="${labelX + 18}" y="125" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${t.muted}">SNAPSHOT</text>
    ${rowsSvg}
  </g>`;
}

function hero(t) {
  const rows = [
    { label: '公开仓库', value: '14' },
    { label: '原创仓库', value: '8' },
    { label: '累计星标', value: '10' },
    { label: '上游已合入 PR', value: '4' },
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="记得开心一点 · 把想法做成有用的东西">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <g>
    ${gridLines(t)}
  </g>

  <!-- 品牌标识 -->
  <rect x="${M}" y="72" width="76" height="76" rx="18" fill="${t.accent}"/>
  <text x="${M + 38}" y="126" text-anchor="middle" font-family="${SANS}" font-size="38" font-weight="700" fill="${t.accentInk}">jk.</text>

  <!-- 定位说明 -->
  <text x="${M + 104}" y="100" font-family="${MONO}" font-size="15" letter-spacing="2.4" fill="${t.ink}">WINDOWS / AI AGENT / OPEN SOURCE</text>
  <text x="${M + 104}" y="130" font-family="${MONO}" font-size="13" letter-spacing="1.4" fill="${t.muted}">github.com/jidekaixin2dian</text>

  <!-- 主标题 -->
  <text x="${M}" y="218" font-family="${SANS}" font-size="60" font-weight="700" letter-spacing="1" fill="${t.ink}">记得开心一点</text>
  <text x="${M}" y="266" font-family="${SANS}" font-size="26" fill="${t.muted}">把想法做成有用的东西。</text>

  <!-- 签名带 -->
  <rect x="${M}" y="292" width="48" height="4" rx="2" fill="${t.accent}"/>
  <text x="${M + 64}" y="300" font-family="${MONO}" font-size="13.5" letter-spacing="2.2" fill="${t.muted}">MAKE IT REAL. KEEP CURIOUS.</text>

  ${ledger(t, rows)}

  <!-- 底边色带 -->
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${t.accent}"/>
</svg>
`;
}

mkdirSync(resolve(root, 'assets/poster'), { recursive: true });
writeFileSync(resolve(root, 'assets/poster/hero-light.svg'), hero(themes.light), 'utf8');
writeFileSync(resolve(root, 'assets/poster/hero-dark.svg'), hero(themes.dark), 'utf8');
console.log('written: assets/poster/hero-light.svg, assets/poster/hero-dark.svg');
