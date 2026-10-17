-- 斟知知识库 · Supabase 建表脚本（路线 1，对应 contract/data-model.md 的 Page 实体）
-- 在 Supabase 控制台 SQL Editor 中整段执行一次即可。

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
