"""斟知知识库 · 真实搜索索引。

启动时扫描站点根目录下全部 HTML 页面建立索引；运行时多词 AND 匹配 + 评分排序。
契约见 contract/openapi.yaml（GET /api/search / GET /api/healthz）。
"""
import html as htmlmod
import re
from pathlib import Path

# 与 mock.js MD_NAV.sections 对齐的回退字典（正常情况下直接从页面 tabs 解析，用不到）
SECTION_FALLBACK = {
    "home": "首页", "base": "基础知识", "ds-and-algo": "数据结构与算法",
    "develop": "软件开发", "llm": "大模型", "contributing": "参与贡献",
}

_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")
_TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S)
_SECTION_RE = re.compile(r'md-tabs__item--active"><a[^>]*><span class="md-ellipsis">([^<]*)</span>')
_ARTICLE_RE = re.compile(r'<article class="md-typeset[^"]*">(.*?)</article>', re.S)


def _text(fragment: str) -> str:
    return _WS_RE.sub(" ", htmlmod.unescape(_TAG_RE.sub(" ", fragment))).strip()


class SearchIndex:
    def __init__(self, root: Path):
        self.docs = []
        for f in sorted(root.rglob("*.html")):
            raw = f.read_text(encoding="utf-8")
            m = _TITLE_RE.search(raw)
            title = htmlmod.unescape(m.group(1)).replace(" - 斟知", "").strip() if m else f.stem
            s = _SECTION_RE.search(raw)
            key = f.relative_to(root).as_posix().split("/")[0].replace(".html", "")
            section = _text(s.group(1)) if s else SECTION_FALLBACK.get(key, key)
            art = _ARTICLE_RE.search(raw)
            self.docs.append({
                "title": title,
                "section": section,
                "url": f.relative_to(root).as_posix(),
                "content": _text(art.group(1)) if art else "",
            })

    def count(self) -> int:
        return len(self.docs)

    def search(self, q: str, limit: int = 20) -> dict:
        terms = [t for t in re.split(r"\s+", (q or "").strip().lower()) if t]
        if not terms:
            return {"query": q, "hits": [], "total": 0}
        hits = []
        for d in self.docs:
            title, sec, content = d["title"].lower(), d["section"].lower(), d["content"].lower()
            score, matched = 0, True
            for t in terms:
                if t not in title and t not in sec and t not in content:
                    matched = False
                    break
                if t in title:
                    score += 30
                if t in sec:
                    score += 10
                score += min(content.count(t), 10)
            if not matched:
                continue
            hits.append({
                "title": d["title"], "section": d["section"], "url": d["url"],
                "excerpt": self._excerpt(d["content"], terms), "_score": score,
            })
        hits.sort(key=lambda x: -x["_score"])
        for h in hits:
            h.pop("_score")
        return {"query": q, "hits": hits[:limit], "total": len(hits)}

    @staticmethod
    def _excerpt(content: str, terms: list, radius: int = 70) -> str:
        low = content.lower()
        pos = next((low.find(t) for t in terms if low.find(t) >= 0), -1)
        if pos < 0:
            return content[:140]
        start, end = max(0, pos - 40), min(len(content), pos + radius)
        return ("…" if start > 0 else "") + content[start:end].strip() + ("…" if end < len(content) else "")
