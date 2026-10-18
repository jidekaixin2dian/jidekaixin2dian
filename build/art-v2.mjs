// v2 视觉层：三块纯色场（纸白报头 / 荧光绿方法条 / 墨色收尾），不画网格、不用等宽、不做细线。
// 用法：node build/art-v2.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const M = 72; // 左右边距

const SANS = "'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans SC','Source Han Sans SC',sans-serif";

const PAPER = '#f3f4ed';
const INK = '#111311';
const MUTED = '#5c5f55';
const LIME = '#c8f663';
const PAPER_MUTED = '#a2a69a';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svg({ w, h, label, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
${body}
</svg>
`;
}

// 报头：名字放到最大，一句话跟在下面；右上一枚 jk. 印章是唯一的强调色。
const masthead = () => svg({
  w: W,
  h: 480,
  label: '记得开心一点 · 把想法做成有用的东西',
  body: `  <rect width="${W}" height="480" fill="${PAPER}"/>
  <rect x="1054" y="334" width="74" height="74" rx="16" fill="${LIME}"/>
  <text x="1091" y="383" text-anchor="middle" font-family="${SANS}" font-size="36" font-weight="700" fill="${INK}">jk.</text>
  <text x="${M}" y="246" font-family="${SANS}" font-size="168" font-weight="700" letter-spacing="-3" fill="${INK}">记得开心一点</text>
  <text x="${M}" y="392" font-family="${SANS}" font-size="34" fill="${MUTED}">把想法做成有用的东西。</text>`,
});

// 方法条：整块荧光绿场地，三条原则直接用墨色排在色块上。
const method = () => {
  const lines = [
    '先量，再说。优化有没有用，让实测结果回答。',
    '写清边界。哪些是我做的、哪些来自上游，都写下来。',
    '做完才算数。从检测、解释、确认，到执行和还原。',
  ];
  const rows = lines
    .map((line, i) => `  <text x="${M}" y="${180 + i * 62}" font-family="${SANS}" font-size="30" fill="${INK}">${esc(line)}</text>`)
    .join('\n');
  return svg({
    w: W,
    h: 360,
    label: '做事的方式：先量再说；写清边界；做完才算数',
    body: `  <rect width="${W}" height="360" fill="${LIME}"/>
  <text x="${M}" y="104" font-family="${SANS}" font-size="46" font-weight="700" fill="${INK}">做事的方式</text>
${rows}`,
  });
};

// 收尾：墨色场地里名字再出现一次，作为落款。
const close = () => svg({
  w: W,
  h: 300,
  label: '记得开心一点 · Keep curious. Keep building.',
  body: `  <rect width="${W}" height="300" fill="${INK}"/>
  <text x="${M}" y="168" font-family="${SANS}" font-size="100" font-weight="700" letter-spacing="-2" fill="${PAPER}">记得开心一点</text>
  <text x="${M}" y="222" font-family="${SANS}" font-size="24" fill="${PAPER_MUTED}">Keep curious. Keep building.</text>`,
});

mkdirSync(resolve(root, 'assets/v2'), { recursive: true });
writeFileSync(resolve(root, 'assets/v2/masthead.svg'), masthead(), 'utf8');
writeFileSync(resolve(root, 'assets/v2/method.svg'), method(), 'utf8');
writeFileSync(resolve(root, 'assets/v2/close.svg'), close(), 'utf8');
console.log('written: assets/v2/{masthead,method,close}.svg');
