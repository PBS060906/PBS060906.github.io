#!/usr/bin/env python3
"""斟知 · seed.sql 生成器。

解析 wiki-prototype 全站 HTML（复用 server/search.py 的 SearchIndex），
重新生成 contract/supabase/seed.sql（幂等，含建表 DDL）。
用法：python gen-seed.py   （在 wiki-prototype 内容更新后运行）
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent          # contract/supabase/ 上两级 = wiki-prototype
sys.path.insert(0, str(ROOT / "server"))
from search import SearchIndex  # noqa: E402

# 与 mock.js MD_NAV 分区中文名对齐（含 index.html 的修正）
SECTION_FIX = {"index": "首页", "home": "首页"}


def sq(s: str) -> str:
    """SQL 字符串转义：单引号双写。"""
    return s.replace("'", "''")


def main() -> None:
    docs = SearchIndex(ROOT).docs
    assert docs, "未解析到任何 HTML 页面"

    blocks = []
    for d in sorted(docs, key=lambda x: x["url"]):
        section = SECTION_FIX.get(d["section"], d["section"])
        values = f"('{sq(d['url'])}', '{sq(d['title'])}', '{sq(section)}', '{sq(d['content'])}')"
        blocks.append(
            "insert into public.pages (url, title, section, content_text)\nvalues "
            + values
            + "\non conflict (url) do update set\n"
            "  title = excluded.title,\n"
            "  section = excluded.section,\n"
            "  content_text = excluded.content_text,\n"
            "  updated_at = now();"
        )

    header = f"""-- 斟知知识库 · Supabase 种子数据（seed.sql）
-- 由 gen-seed.py 自动生成（解析全站 {len(docs)} 页 HTML），勿手工编辑；内容变更后重跑：
--   cd contract/supabase && python gen-seed.py
-- 用法：Supabase Dashboard → SQL Editor → 整段粘贴 → Run（幂等，可重复执行）。

begin;

-- 建表脚本（对应 contract/data-model.md 的 Page 实体）

create table if not exists public.pages (
  url          text primary key,            -- 站点根相对路径，如 base/ai/python/grammar.html
  title        text not null,
  section      text not null,
  content_text text not null default '',    -- 去标签正文纯文本（供 ilike 检索与摘要）
  updated_at   timestamptz not null default now()
);

-- 匿名只读（前端用 anon key 直查 PostgREST）
alter table public.pages enable row level security;
drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read" on public.pages for select using (true);

-- 可选：全文索引列（当前前端走 ilike 即可；数据量大后可改用 rpc + websearch_to_tsquery）
alter table public.pages
  add column if not exists fts tsvector
  generated always as (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content_text, ''))) stored;
create index if not exists pages_fts_idx on public.pages using gin (fts);


-- 灌入/更新 {len(docs)} 页数据
"""
    out = HERE / "seed.sql"
    out.write_text(header + "\n\n".join(blocks) + "\n\ncommit;\n", encoding="utf-8")
    print(f"seed.sql regenerated: {len(docs)} pages -> {out}")


if __name__ == "__main__":
    main()