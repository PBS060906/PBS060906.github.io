/* 请求校验（contract-driven）：q 必须是 ≤100 字符的字符串。 */

const MAX_LEN = 100;

function parseQuery(raw) {
  if (raw === undefined || raw === null) return { ok: true, query: "", terms: [] };
  if (typeof raw !== "string") return { ok: false, error: "q 必须是字符串" };
  if (raw.length > MAX_LEN) return { ok: false, error: `q 最长 ${MAX_LEN} 字符` };

  const query = raw.trim();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return { ok: true, query, terms };
}

module.exports = { parseQuery, MAX_LEN };
