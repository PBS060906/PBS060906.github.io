/* GET /api/healthz —— 契约见 contract/openapi.yaml */
const express = require("express");
const { searchIndex } = require("../services/searchIndex");

const router = express.Router();

router.get("/healthz", (req, res) => {
  res.json({ status: "ok", pages: searchIndex.count() });
});

module.exports = router;
