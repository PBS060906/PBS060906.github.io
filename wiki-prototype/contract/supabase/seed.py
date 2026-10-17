"""斟知知识库 · Supabase 数据种子（路线 1）。

把站点全部 HTML 页面解析后 upsert 进 Supabase 的 public.pages 表。

前置：先在 Supabase SQL Editor 执行同目录 schema.sql。
用法：
    python seed.py <SUPABASE_URL> <SERVICE_ROLE_KEY> [站点根目录]
    例：python seed.py https://abcdefgh.supabase.co eyJhbGciOi...
SERVICE_ROLE_KEY 用于绕过 RLS 写入（仅本机使用，勿提交到前端/仓库）。
前端只需在 assets/config.js 填 supabaseUrl + supabaseAnonKey 即可切换后端。
"""
import json
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "server"))
from search import SearchIndex  # noqa: E402


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    base, key = sys.argv[1].rstrip("/"), sys.argv[2]
    root = Path(sys.argv[3]) if len(sys.argv) > 3 else Path(__file__).resolve().parents[2]

    rows = [
        {"title": d["title"], "section": d["section"], "url": d["url"], "content_text": d["content"]}
        for d in SearchIndex(root).docs
    ]
    req = urllib.request.Request(
        base + "/rest/v1/pages?on_conflict=url",
        data=json.dumps(rows, ensure_ascii=False).encode("utf-8"),
        headers={
            "apikey": key,
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(f"seeded {len(rows)} pages -> HTTP {resp.status}")


if __name__ == "__main__":
    main()
