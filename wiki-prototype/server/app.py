"""斟知知识库 · 真实后端（FastAPI）。

- 托管原型静态站点（wiki-prototype 根目录）
- GET /api/search   真实全文搜索（契约：contract/openapi.yaml）
- GET /api/healthz  健康检查

启动：python app.py        （默认 http://127.0.0.1:8018）
     或 uvicorn app:app --port 8018
"""
from pathlib import Path

import uvicorn
from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles

from search import SearchIndex

ROOT = Path(__file__).resolve().parent.parent  # wiki-prototype/

app = FastAPI(title="斟知知识库 API", version="1.0.0")
index = SearchIndex(ROOT)


@app.get("/api/healthz")
def healthz():
    return {"status": "ok", "pages": index.count()}


@app.get("/api/search")
def api_search(q: str = Query("", max_length=100)):
    return index.search(q)


# 静态托管挂在最后：API 路由优先匹配
app.mount("/", StaticFiles(directory=ROOT, html=True), name="site")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8018)
