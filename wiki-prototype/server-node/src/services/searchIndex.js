/* 搜索索引服务：启动时扫描站点根目录全部 HTML 建索引（FastAPI server/search.py 的 JS 移植）。 */
const fs = require("fs");
const path = require("path");

const SECTION_FALLBACK = {
  home: "首页", base: "基础知识", "ds-and-algo": "数据结构与算法",
  develop: "软件开发", llm: "大模型", contributing: "参与贡献"
};

const ROOT = path.resolve(__dirname, "..", "..", ".."); // src/services/ 上三级 = 站点根（wiki-prototype）

const TAG_RE = /<[^>]+>/g;
const TITLE_RE = /<title>([\s\S]*?)<\/title>/;
const SECTION_RE = /md-tabs__item--active"><a[^>]*><span class="md-ellipsis">([^<]*)<\/span>/;
const ARTICLE_RE = /<article class="md-typeset[^"]*">([\s\S]*?)<\/article>/;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  sum: "Σ", int: "∫", radic: "√", top: "⊤", infin: "∞", le: "≤", ge: "≥",
  times: "×", minus: "−", larr: "←", rarr: "→", middot: "·", hellip: "…" };

function decodeEntities(s) {
  return s.replace(/&([a-z]+|#\d+);/gi, (m, name) => {
    if (name[0] === "#") return String.fromCodePoint(parseInt(name.slice(1), 10));
    return ENTITIES[name.toLowerCase()] !== undefined ? ENTITIES[name.toLowerCase()] : m;
  });
}
function textOf(fragment) {
  return decodeEntities(fragment.replace(TAG_RE, " ")).replace(/\s+/g, " ").trim();
}

function walkHtml(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "server-node" || entry.name === "contract" || entry.name === "server") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function buildDocs() {
  return walkHtml(ROOT, [])
    .sort()
    .map((f) => {
      const raw = fs.readFileSync(f, "utf8");
      const t = raw.match(TITLE_RE);
      const title = t ? decodeEntities(t[1]).replace(" - 斟知", "").trim() : path.basename(f, ".html");
      const s = raw.match(SECTION_RE);
      const rel = path.relative(ROOT, f).split(path.sep).join("/");
      const key = rel.split("/")[0].replace(".html", "");
      const section = s ? textOf(s[1]) : SECTION_FALLBACK[key] || key;
      const a = raw.match(ARTICLE_RE);
      return { title, section, url: rel, content: a ? textOf(a[1]) : "" };
    });
}

const docs = buildDocs();

const searchIndex = {
  count: () => docs.length,
  /* 返回命中数组（已排序、截断 20），total 由路由层取长度 */
  search(q, terms) {
    const scored = [];
    for (const d of docs) {
      const title = d.title.toLowerCase(), sec = d.section.toLowerCase(), content = d.content.toLowerCase();
      let score = 0, matched = true;
      for (const t of terms) {
        if (title.indexOf(t) < 0 && sec.indexOf(t) < 0 && content.indexOf(t) < 0) { matched = false; break; }
        if (title.indexOf(t) >= 0) score += 30;
        if (sec.indexOf(t) >= 0) score += 10;
        score += Math.min(content.split(t).length - 1, 10);
      }
      if (!matched) continue;
      scored.push({ title: d.title, section: d.section, url: d.url, excerpt: excerptOf(d.content, terms), _s: score });
    }
    scored.sort((a, b) => b._s - a._s);
    return scored.slice(0, 20).map(({ _s, ...h }) => h);
  }
};

function excerptOf(content, terms, radius = 70) {
  const low = content.toLowerCase();
  let pos = -1;
  for (const t of terms) { pos = low.indexOf(t); if (pos >= 0) break; }
  if (pos < 0) return content.slice(0, 140);
  const start = Math.max(0, pos - 40), end = Math.min(content.length, pos + radius);
  return (start > 0 ? "…" : "") + content.slice(start, end).trim() + (end < content.length ? "…" : "");
}

module.exports = { searchIndex, docs };
