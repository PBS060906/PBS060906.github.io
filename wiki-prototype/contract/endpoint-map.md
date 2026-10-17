# Endpoint Map（页面 → 前端接缝函数 → 后端接口）

| 页面/组件 | 前端调用点（唯一接缝） | 接口 | 触发时机 |
| --------- | ---------------------- | ---- | -------- |
| 搜索浮层（全部 35 页共用） | assets/api.js `MD_API.search`（shell.js 调用） | local / remote / supabase 三选一 | 输入防抖 150ms；Esc 关闭；↑↓ 选择；Enter 跳转 |
| 运维探活 | （前端不调用，部署探针用） | GET /api/healthz（remote 后端） | 部署监控 |
| header / tabs / 侧栏树 / TOC / 页脚 | 无 API（mock.js 单源静态渲染） | — | 页面加载 |

## 三后端接缝（api.js 内部，视图层零感知）

| backend | 实现 | 数据源 | 切换方式（assets/config.js） |
| ------- | ---- | ------ | ---------------------------- |
| local | mock.js 多词过滤 | MD_SEARCH 内置索引 | `backend:"local"`（file:// 下 auto 默认即此） |
| remote | GET /api/search | FastAPI（server/）或 Node.js（server-node/） | `backend:"remote"`，同源或 `remoteBaseUrl` |
| supabase | PostgREST ilike 直查（无需 SDK） | Supabase `public.pages` 表 | `backend:"supabase"` + `supabaseUrl/anonKey`；建表 schema.sql、灌数据 seed.sql（由 gen-seed.py 解析全站 HTML 自动生成）见 contract/supabase/ |

- auto 规则：file:// → local；配置了 supabase 密钥 → supabase；否则 remote。
- 远端失败自动回退 local（AbortError 除外）；local 永不失败。
- 三后端产出统一的 `{query, hits:[{title,section,url,excerpt}], total}`，渲染层零改动。

## 部署注意
- remote 模式：站点与 API 必须同源（后端 StaticFiles 直接托管原型根目录即为默认满足）；
- supabase 模式：前端为纯静态站，可托管在任何静态服务上（同源限制解除）；
- supabase 写入种子需 SERVICE_ROLE_KEY（仅本机 seed.py 使用），前端只用 anon key（RLS 限只读）。
