/* 斟知原型 · App Shell（JS 注入共享层：header/tabs/侧栏树/TOC/页脚/主题/搜索/代码高亮）
   约定：页面 <body data-section data-page data-root>；数据源 mock.js（单源，勿在页面内写导航）。 */
(function () {
  if (window.__MD_SHELL__) return; // 幂等
  window.__MD_SHELL__ = true;

  var body = document.body;
  var ROOT = body.getAttribute("data-root") || ".";
  var SECTION = body.getAttribute("data-section") || "home";
  var PAGE = body.getAttribute("data-page") || "index";
  var NAV = window.MD_NAV, ORDER = window.MD_ORDER, SEARCH = window.MD_SEARCH;

  /* ---------- 公共工具 ---------- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function url(u) { return ROOT.replace(/\/+$/, "") + "/" + u; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var I = { // 内联 SVG（lucide 风格，stroke 2）
    menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    auto: '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" stroke="none"/><path d="M12 2a10 10 0 0 0 0 20"/>',
    left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'
  };
  function svg(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[name] + "</svg>"; }

  /* ---------- 主题 ---------- */
  var MODES = ["auto", "light", "dark"];
  var mqDark = window.matchMedia("(prefers-color-scheme: dark)");
  function theme() { try { return localStorage.getItem("md-theme") || "auto"; } catch (e) { return "auto"; } }
  function applyTheme() {
    var mode = theme();
    var scheme = mode === "auto" ? (mqDark.matches ? "dark" : "light") : mode;
    document.documentElement.setAttribute("data-scheme", scheme === "dark" ? "dark" : "light");
    var btn = document.querySelector(".md-header__button--theme");
    if (btn) btn.innerHTML = svg(mode === "auto" ? "auto" : mode === "light" ? "sun" : "moon");
    var title = { auto: "切换到亮色模式", light: "切换到暗色模式", dark: "切换到自动模式" };
    if (btn) btn.setAttribute("aria-label", title[mode]);
  }
  mqDark.addEventListener && mqDark.addEventListener("change", function () { if (theme() === "auto") applyTheme(); });

  /* ---------- Header ---------- */
  var header = el("header", "md-header");
  header.innerHTML =
    '<div class="md-header__inner">' +
      '<button class="md-header__button md-header__button--menu" aria-label="打开导航">' + svg("menu") + "</button>" +
      '<a class="md-header__link--logo" href="' + url("index.html") + '" aria-label="首页"><img alt="logo" src="' + url("assets/logo.svg") + '"></a>' +
      '<div class="md-header__title"><a href="' + url("index.html") + '">' + esc(NAV.site) + "</a></div>" +
      '<div class="md-search"><button class="md-search__button" aria-label="搜索">' + svg("search") + "搜索<span class=\"kbd\">/</span></button></div>" +
      '<button class="md-header__button md-search-fab" aria-label="搜索">' + svg("search") + "</button>" +
      '<div class="md-header__option">' +
        '<a class="md-header__button" href="' + NAV.repo + '" target="_blank" aria-label="GitHub 仓库">' + svg("github") + "</a>" +
        '<button class="md-header__button md-header__button--theme" aria-label="切换主题"></button>' +
      "</div>" +
    "</div>";
  document.body.insertBefore(header, body.firstChild);

  header.querySelector(".md-header__button--theme").addEventListener("click", function () {
    var next = MODES[(MODES.indexOf(theme()) + 1) % 3];
    try { localStorage.setItem("md-theme", next); } catch (e) {}
    applyTheme();
  });

  /* ---------- Tabs ---------- */
  var tabs = el("nav", "md-tabs");
  var list = '<div class="md-tabs__inner"><ul class="md-tabs__list">';
  NAV.sections.forEach(function (s) {
    list += '<li class="md-tabs__item' + (s.key === SECTION ? " md-tabs__item--active" : "") + '"><a class="md-tabs__link" href="' + url(s.url) + '"><span class="md-ellipsis">' + esc(s.label) + "</span></a></li>";
  });
  list += "</ul></div>";
  tabs.innerHTML = list;
  header.insertAdjacentElement("afterend", tabs);

  /* ---------- 侧栏树（当前分区） ---------- */
  function curPage(urlStr) { return urlStr && urlStr.replace(/^\.\//, "") === PAGE; }
  function nodeUrl(n) { return n.url ? url(n.url) : null; }

  function renderNode(n) {
    var li = el("li", "md-nav__item");
    if (n.children && n.children.length) { // 组节点：可展开
      li.classList.add("md-nav__group");
      var head = el("div", "md-nav__link");
      head.innerHTML = '<span class="md-nav__icon">' + svg("chev") + "</span>" + (n.url
        ? '<span class="md-ellipsis"><a href="' + nodeUrl(n) + '" style="color:inherit">' + esc(n.label) + "</a></span>"
        : '<span class="md-ellipsis">' + esc(n.label) + "</span>");
      var sub = el("nav", "md-nav");
      var ul = el("ul", "md-nav__list");
      n.children.forEach(function (c) { ul.appendChild(renderNode(c)); });
      sub.appendChild(ul); li.appendChild(head); li.appendChild(sub);
      if (curPage(n.url)) head.classList.add("md-nav__link--active");
      head.addEventListener("click", function (ev) {
        if (ev.target.closest("a")) return; // 点击链接仅导航
        li.classList.toggle("open");
      });
      return li;
    }
    var a = el("a", "md-nav__link");
    a.href = nodeUrl(n) || "#";
    a.innerHTML = '<span class="md-ellipsis">' + esc(n.label) + "</span>";
    if (curPage(n.url)) a.classList.add("md-nav__link--active");
    li.appendChild(a);
    return li;
  }

  function openToActive(rootLi) { // 展开含当前页的祖先组
    var active = rootLi.querySelector(".md-nav__link--active"), node = active && active.closest(".md-nav__group");
    while (node) { node.classList.add("open"); node = node.parentElement ? node.parentElement.closest(".md-nav__group") : null; }
  }

  var section = NAV.sections.filter(function (s) { return s.key === SECTION; })[0];
  var hasPre = false;
  if (SECTION !== "home" && section && section.tree) {
    var aside = el("aside", "md-sidebar md-sidebar--primary");
    var navWrap = el("nav", "md-nav md-nav--primary");
    var rootUl = el("ul", "md-nav__list");
    var rootNode = renderNode(section.tree);
    rootUl.appendChild(rootNode);
    navWrap.appendChild(rootUl);
    aside.appendChild(navWrap);
    var contentEl = document.querySelector(".md-content");
    contentEl.parentNode.insertBefore(aside, contentEl);
    contentEl.classList.add("has-pre");
    hasPre = true;
    openToActive(rootUl);
  }

  /* ---------- TOC（右侧） ---------- */
  var article = document.querySelector("article");
  var heads = article ? [].slice.call(article.querySelectorAll("h2, h3")) : [];
  if (heads.length) {
    var post = el("aside", "md-sidebar md-sidebar--secondary");
    var toc = el("nav", "md-nav md-nav__toc");
    var html = '<p class="toc-title">本页目录</p><ul>';
    var openH2 = false;
    heads.forEach(function (h) {
      if (!h.id) h.id = "h-" + h.textContent.trim().replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fa5-]/g, "");
      if (h.tagName === "H2") {
        if (openH2) html += "</ul></li>";
        html += '<li><a href="#' + h.id + '">' + esc(h.textContent) + "</a>";
        html += "<ul>"; openH2 = true;
      } else {
        html += '<li><a href="#' + h.id + '">' + esc(h.textContent) + "</a></li>";
      }
    });
    if (openH2) html += "</ul></li>";
    html += "</ul>";
    toc.innerHTML = html;
    post.appendChild(toc);
    var contentEl2 = document.querySelector(".md-content");
    contentEl2.insertAdjacentElement("afterend", post);
    contentEl2.classList.add("has-post");
    // 滚动监听高亮
    var links = [].slice.call(post.querySelectorAll("a"));
    var byId = {}; links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    function spy() {
      var cur = null;
      for (var i = 0; i < heads.length; i++) { if (heads[i].getBoundingClientRect().top <= 90) cur = heads[i].id; }
      links.forEach(function (a) { a.classList.remove("active"); });
      if (cur && byId[cur]) byId[cur].classList.add("active");
    }
    var tick = false;
    window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; spy(); }); } }, { passive: true });
    spy();
  }

  /* ---------- Footer ---------- */
  var idx = -1;
  ORDER.forEach(function (o, i) { if (o.page === PAGE) idx = i; });
  var prev = idx > 0 ? ORDER[idx - 1] : null;
  var next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;
  var footer = el("footer", "md-footer");
  footer.innerHTML =
    '<div class="md-footer__inner">' +
      (prev ? '<a class="md-footer__link md-footer__link--prev" href="' + url(prev.url) + '">' + svg("left") + '<span><span class="md-footer__direction">上一页</span><span class="md-footer__title">' + esc(prev.label) + "</span></span></a>" : "<span></span>") +
      (next ? '<a class="md-footer__link md-footer__link--next" href="' + url(next.url) + '"><span><span class="md-footer__direction">下一页</span><span class="md-footer__title">' + esc(next.label) + "</span></span>" + svg("right") + "</a>" : "") +
    "</div>" +
    '<div class="md-footer-meta"><div class="md-footer-meta__inner">' +
      '<div class="md-copyright">' + esc(NAV.copyright) + '</div>' +
      '<div class="md-social">' +
        '<a class="md-social__link" href="' + NAV.repo + '" target="_blank" aria-label="GitHub">' + svg("github") + "</a>" +
        '<a class="md-social__link" href="mailto:example@example.com" aria-label="邮箱">' + svg("mail") + "</a>" +
      "</div>" +
    "</div></div>";
  document.body.appendChild(footer);

  /* ---------- 回到顶部 + 头部阴影 ---------- */
  var top = el("button", "md-top");
  top.innerHTML = svg("up") + "回到顶部";
  top.setAttribute("aria-label", "回到顶部");
  document.body.appendChild(top);
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  var onScroll = function () {
    header.classList.toggle("md-header--shadow", window.scrollY > 0);
    top.classList.toggle("active", window.scrollY > 300);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 代码高亮 + 复制 ---------- */
  var KW = {
    python: "def class return if elif else for while import from as with try except finally raise lambda yield pass break continue global nonlocal assert in is not and or None True False async await del match case",
    cpp: "int void char bool float double long short unsigned signed struct class public private protected virtual override const static constexpr auto template typename using namespace new delete return if else for while do switch case break continue default sizeof nullptr true false this throw try catch explicit inline friend enum union mutable noexcept",
    js: "let const var function return if else for while do switch case break continue new class extends super this typeof instanceof in of try catch finally throw async await yield import export from default null undefined true false",
    bash: "if then elif else fi for while until do done case esac function echo export return local in set source alias",
    json: "true false null"
  };
  function langRe(name) {
    var kw = (KW[name] || "").split(/\s+/).filter(Boolean).join("|");
    var comment = name === "python" || name === "bash" || name === "yaml" ? "#[^\\n]*" : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/";
    var pre = name === "cpp" ? "#\\s*\\w+" : null;
    var parts = [
      "(" + comment + ")",
      "(\"\"\"[\\s\\S]*?\"\"\"|'''[\\s\\S]*?'''|\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'|`(?:\\\\.|[^`\\\\])*`)",
      "(\\b\\d+(?:\\.\\d+)?(?:e[+-]?\\d+)?\\b)",
      pre ? "(" + pre + "|\\b(?:" + kw + ")\\b)" : "(\\b(?:" + kw + ")\\b)",
      "([A-Za-z_]\\w*(?=\\s*\\())"
    ];
    return new RegExp(parts.join("|"), "g");
  }
  var RE = {};
  function hl(src, lang) {
    var re = RE[lang] || (RE[lang] = langRe(lang));
    var out = "", last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      var cls = m[1] ? "tok-m" : m[2] ? "tok-s" : m[3] ? "tok-n" : m[4] ? "tok-k" : m[5] ? "tok-f" : "";
      out += cls ? '<span class="' + cls + '">' + esc(m[0]) + "</span>" : esc(m[0]);
      last = m.index + m[0].length;
      if (!m[0].length) re.lastIndex++;
    }
    return out + esc(src.slice(last));
  }
  function initCode() {
    [].slice.call(document.querySelectorAll("article pre > code")).forEach(function (code) {
      var cls = (code.className.match(/language-([\w-]+)/) || [])[1];
      if (cls && KW[cls]) code.innerHTML = hl(code.textContent, cls);
      var pre = code.parentElement;
      if (pre.querySelector(".md-clipboard")) return;
      var btn = el("button", "md-clipboard");
      btn.innerHTML = svg("copy");
      btn.setAttribute("aria-label", "复制代码");
      btn.addEventListener("click", function () {
        var text = code.textContent;
        function done() {
          btn.classList.add("copied"); btn.innerHTML = svg("check");
          setTimeout(function () { btn.classList.remove("copied"); btn.innerHTML = svg("copy"); }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
        else fallback();
        function fallback() {
          var ta = el("textarea"); ta.value = text; document.body.appendChild(ta);
          ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done();
        }
      });
      pre.appendChild(btn);
    });
  }
  initCode();

  /* ---------- 搜索 ---------- */
  var overlay = el("div", "md-search-overlay");
  overlay.innerHTML =
    '<div class="md-search-panel" role="dialog" aria-label="搜索">' +
      '<div class="md-search-panel__bar">' + svg("search") +
        '<input class="md-search-input" type="text" placeholder="输入关键词搜索" aria-label="搜索关键词">' +
        '<span class="md-search-hint">Esc 关闭</span>' +
      "</div>" +
      '<div class="md-search-results"></div>' +
    "</div>";
  document.body.appendChild(overlay);
  var input = overlay.querySelector(".md-search-input");
  var results = overlay.querySelector(".md-search-results");
  var sel = -1, hits = [];

  function mark(text, q) {
    if (!q) return esc(text);
    var terms = q.trim().split(/\s+/).filter(Boolean).map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    if (!terms.length) return esc(text);
    var re = new RegExp("(" + terms.join("|") + ")", "gi");
    return esc(text).replace(re, "<mark>$1</mark>");
  }
  /* —— 搜索调用唯一入口：MD_API.search 由 assets/api.js 提供
        （local / remote / supabase 三后端可插拔，回退逻辑在 api.js 内部） —— */
  var debT = null, abortC = null;
  function renderHits(q) {
    if (!hits.length) { results.innerHTML = '<div class="md-search-empty">没有找到结果</div>'; return; }
    results.innerHTML = hits.map(function (it, i) {
      return '<a class="hit" href="' + url(it.url) + '" data-i="' + i + '">' +
        '<span class="hit-section">' + esc(it.section) + "</span>" +
        '<span class="hit-title">' + mark(it.title, q) + "</span>" +
        '<span class="hit-excerpt">' + mark(it.excerpt, q) + "</span></a>";
    }).join("");
  }
  function doSearch(q) {
    sel = -1;
    if (!q.trim()) {
      if (abortC) abortC.abort();
      hits = [];
      results.innerHTML = '<div class="md-search-empty">输入关键词开始搜索</div>';
      return;
    }
    clearTimeout(debT);
    debT = setTimeout(function () {
      if (abortC) abortC.abort();
      abortC = new AbortController();
      window.MD_API.search(q, abortC.signal)
        .then(function (data) { hits = data.hits || []; renderHits(q); })
        .catch(function (err) {
          if (err && err.name !== "AbortError") {
            hits = [];
            results.innerHTML = '<div class="md-search-empty">没有找到结果</div>';
          }
        });
    }, 150);
  }
  function openSearch() { overlay.classList.add("open"); input.value = ""; doSearch(""); setTimeout(function () { input.focus(); }, 30); }
  function closeSearch() { overlay.classList.remove("open"); }
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeSearch(); });
  header.querySelector(".md-search__button").addEventListener("click", openSearch);
  var fab = header.querySelector(".md-search-fab");
  if (fab) fab.addEventListener("click", openSearch);
  input.addEventListener("input", function () { doSearch(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!hits.length) return;
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length;
      var as = results.querySelectorAll(".hit");
      [].forEach.call(as, function (a, i) { a.classList.toggle("sel", i === sel); });
      if (as[sel]) as[sel].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (hits.length) { location.href = url(hits[sel >= 0 ? sel : 0].url); }
    }
  });
  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault(); openSearch();
    } else if (e.key === "Escape") closeSearch();
  });

  /* ---------- 抽屉（移动端导航） ---------- */
  var drawerMask = el("div", "md-drawer-overlay");
  var drawer = el("aside", "md-drawer");
  var dhtml = '<div class="md-drawer__head"><strong>' + esc(NAV.site) + '</strong><button class="md-header__button md-drawer__close" aria-label="关闭导航">' + svg("close") + "</button></div>";
  NAV.sections.forEach(function (s) {
    dhtml += '<div class="drawer-section-label">' + esc(s.label) + "</div>";
    var ul = el("ul", "md-nav__list");
    if (s.tree) {
      var clone = renderNode(s.tree);
      // 抽屉内默认全展开
      [].forEach.call(clone.querySelectorAll(".md-nav__group"), function (g) { g.classList.add("open"); });
      ul.appendChild(clone);
    } else {
      var li = el("li", "md-nav__item"), a = el("a", "md-nav__link");
      a.href = url(s.url); a.innerHTML = '<span class="md-ellipsis">' + esc(s.label) + "</span>";
      if (curPage(s.url)) a.classList.add("md-nav__link--active");
      li.appendChild(a); ul.appendChild(li);
    }
    var wrap = document.createElement("div"); wrap.appendChild(ul);
    dhtml += wrap.innerHTML;
  });
  drawer.innerHTML = dhtml;
  document.body.appendChild(drawerMask);
  document.body.appendChild(drawer);
  function openDrawer() { drawerMask.classList.add("open"); drawer.classList.add("open"); }
  function closeDrawer() { drawerMask.classList.remove("open"); drawer.classList.remove("open"); }
  header.querySelector(".md-header__button--menu").addEventListener("click", openDrawer);
  drawerMask.addEventListener("click", closeDrawer);
  drawer.querySelector(".md-drawer__close").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", function (e) {
    if (e.target.closest("a")) { closeDrawer(); return; }
    var head = e.target.closest(".md-nav__group > .md-nav__link"); // innerHTML 序列化后补挂折叠监听
    if (head) head.parentElement.classList.toggle("open");
  });

  applyTheme();
})();
