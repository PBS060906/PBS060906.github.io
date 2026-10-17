/* 斟知知识库 · Node.js 后端入口（express）
   契约：contract/openapi.yaml —— GET /api/search、GET /api/healthz、静态托管站点根目录。
   启动：npm start（默认 http://127.0.0.1:8019，可用 PORT 环境变量覆盖）。 */
const path = require("path");
const express = require("express");

const searchRoute = require("./routes/search");
const healthRoute = require("./routes/health");

const app = express();
const ROOT = path.resolve(__dirname, "..", ".."); // src/ 上两级 = 站点根（wiki-prototype）

app.disable("x-powered-by");

/* API 路由先注册，静态托管兜底其余路径 */
app.use("/api", healthRoute);
app.use("/api", searchRoute);
app.use("/", express.static(ROOT, { extensions: ["html"], index: "index.html" }));

/* 兜底 404（保持 JSON 风格，便于前端排障） */
app.use((req, res) => res.status(404).json({ error: "not found", path: req.path }));

const port = Number(process.env.PORT) || 8019;
app.listen(port, "127.0.0.1", () => {
  console.log(`斟知知识库 Node 后端: http://127.0.0.1:${port}`);
});
