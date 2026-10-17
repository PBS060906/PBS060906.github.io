/* GET /api/search?q= —— 契约见 contract/openapi.yaml
   多词 AND；标题命中 30 / 分区 10 / 正文频次封顶 10；按总分倒序，最多 20 条。 */
const express = require("express");
const { searchIndex } = require("../services/searchIndex");
const { parseQuery } = require("../lib/validate");

const router = express.Router();

router.get("/search", (req, res) => {
  const parsed = parseQuery(req.query.q);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });

  const { query, terms } = parsed;
  if (!terms.length) return res.json({ query, hits: [], total: 0 });

  const hits = searchIndex.search(query, terms);
  res.json({ query, hits, total: hits.length });
});

module.exports = router;
