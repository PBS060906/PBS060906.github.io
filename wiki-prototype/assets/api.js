/* 斟知原型 · 唯一后端接缝（api.js）
   shell.js 只认 MD_API.search(q, signal) → Promise<{query, hits, total}>；
   三后端可插拔（local / remote / supabase），远端失败自动回退 local，渲染层零感知。
   数据契约见 contract/openapi.yaml。 */
(function (global) {
  "use strict";
  var CFG = global.MD_CONFIG || {};
  var SEARCH = global.MD_SEARCH || [];

  function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  /* 评分与摘要：与 server/search.py（FastAPI 版）语义一致 */
  function excerpt(content, terms, radius) {
    radius = radius || 70;
    var low = (content || "").toLowerCase(), pos = -1;
    for (var i = 0; i < terms.length; i++) { pos = low.indexOf(terms[i]); if (pos >= 0) break; }
    if (pos < 0) return (content || "").slice(0, 140);
    var start = Math.max(0, pos - 40), end = Math.min(content.length, pos + radius);
    return (start > 0 ? "…" : "") + content.slice(start, end).trim() + (end < content.length ? "…" : "");
  }
  function scoreOf(d, terms) {
    var title = (d.title || "").toLowerCase(), sec = (d.section || "").toLowerCase(), c = (d.content_text || "").toLowerCase();
    var score = 0;
    terms.forEach(function (t) {
      if (title.indexOf(t) >= 0) score += 30;
      if (sec.indexOf(t) >= 0) score += 10;
      score += Math.min((c.match(new RegExp(escRe(t), "g")) || []).length, 10);
    });
    return score;
  }
  function toHits(rows, terms) {
    var hits = rows.map(function (d) {
      return { title: d.title, section: d.section, url: d.url, excerpt: excerpt(d.content_text, terms), _s: scoreOf(d, terms) };
    });
    hits.sort(function (a, b) { return b._s - a._s; });
    hits = hits.slice(0, 20);
    hits.forEach(function (h) { delete h._s; });
    return hits;
  }

  /* —— 后端一：local（mock.js 本地过滤） —— */
  function localSearch(q) {
    var hits = [];
    var terms = q.trim().toLowerCase().split(/\s+/);
    SEARCH.forEach(function (it) {
      var hay = (it.title + " " + it.section + " " + it.excerpt).toLowerCase();
      if (terms.every(function (t) { return hay.indexOf(t) >= 0; })) {
        hits.push({ title: it.title, section: it.section, url: it.url, excerpt: it.excerpt });
      }
    });
    return Promise.resolve({ query: q, hits: hits, total: hits.length });
  }

  /* —— 后端二：remote（自建 /api/search，FastAPI 或 server-node） —— */
  function remoteSearch(q, signal) {
    var base = (CFG.remoteBaseUrl || "").replace(/\/$/, "");
    return fetch(base + "/api/search?q=" + encodeURIComponent(q), { signal: signal })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }

  /* —— 后端三：supabase（PostgREST 直连，无需 SDK） ——
     等价 SQL: SELECT ... FROM pages WHERE title|section|content_text ILIKE term AND ... */
  function supabaseSearch(q, signal) {
    var base = (CFG.supabaseUrl || "").replace(/\/$/, "");
    var terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean).slice(0, 5);
    if (!terms.length) return Promise.resolve({ query: q, hits: [], total: 0 });
    var and = terms.map(function (t) {
      var v = encodeURIComponent("*" + t + "*");
      return "or=(" + ["title", "section", "content_text"]
        .map(function (c) { return c + ".ilike." + v; }).join(",") + ")";
    }).join(",");
    var url = base + "/rest/v1/pages?select=title,section,url,content_text&and=" + and;
    return fetch(url, {
      signal: signal,
      headers: { apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + CFG.supabaseAnonKey }
    })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (rows) {
        var hits = toHits(rows || [], terms);
        return { query: q, hits: hits, total: hits.length };
      });
  }

  function withFallback(fn, q, signal) {
    return fn(q, signal).catch(function (err) {
      if (err && err.name === "AbortError") throw err; // 用户关闭/换词，不回退
      return localSearch(q);
    });
  }

  function pickBackend() {
    var b = CFG.backend || "auto";
    if (b !== "auto") return b;
    var proto = (global.location && global.location.protocol) || "file:";
    if (proto === "file:") return "local";
    if (CFG.supabaseUrl && CFG.supabaseAnonKey) return "supabase";
    return "remote";
  }

  var impls = { local: localSearch, remote: remoteSearch, supabase: supabaseSearch };
  global.MD_API = {
    backend: pickBackend(),
    search: function (q, signal) {
      var b = impls[this.backend] ? this.backend : "local";
      return b === "local" ? localSearch(q) : withFallback(impls[b], q, signal);
    }
  };
})(typeof window !== "undefined" ? window : this);
