/* 斟知原型 · 前端配置（后端选择与密钥）
   backend: auto | local | remote | supabase
   - local    : mock.js 本地过滤（file:// 双击可用）
   - remote   : 自建后端 /api/search（FastAPI 或 server-node）
   - supabase : Supabase PostgREST（需先在 SQL Editor 执行 contract/supabase/schema.sql
                并运行 contract/supabase/seed.py 灌数据） */
window.MD_CONFIG = {
  backend: "supabase",  // auto = file://→local；配置了 supabase→supabase；否则 remote
  remoteBaseUrl: "",    // 自建后端地址，留空 = 同源（如 http://127.0.0.1:8018）
  supabaseUrl: "https://epxovfyvdpeacgtvcorq.supabase.co",
  supabaseAnonKey: "sb_publishable_g9_uRw1rTnKWf4F99CmZjg_zXV2Mivd"
};
