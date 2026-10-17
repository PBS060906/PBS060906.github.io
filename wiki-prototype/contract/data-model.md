# 数据模型（由 mock.js 单源提炼，作为任何后端建表的 neutral 源）

## Hit（搜索结果条目）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| ---- | ---- | ---- | ---- | ---- |
| title | string | ✓ | 页面标题（`<title>` 去 “ - 斟知” 后缀） | 语法基础 |
| section | string | ✓ | 所属分区中文名（取自页面 tabs active 项） | 基础知识 |
| url | string | ✓ | 站点根相对路径 | base/ai/python/grammar.html |
| excerpt | string | ✓ | 命中窗口摘要（约 ≤140 字符，带省略号） | ……函数默认参数避免使用可变对象…… |

## Page（索引实体，对应站点 35 个 HTML 页面，与 MkDocs 源站 wiki/docs 1:1 对齐）
| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| title | string | 见 Hit.title |
| section | string | 见 Hit.section |
| url | string | 根相对路径，如 llm/development/transformer.html |
| content | string | 去标签后的正文纯文本（仅服务端索引用，不出参） |

## SectionLabel（分区字典，前端 mock.js `MD_NAV.sections` 为单源）
home→首页，base→基础知识，ds-and-algo→数据结构与算法，develop→软件开发，llm→大模型，contributing→参与贡献。
服务端优先从页面 tabs active 项解析，解析失败时回退到该字典。

## 关系
Page 1..1 Hit（Page 经查询产出 Hit）；无跨实体外键。若未来接入数据库：
`pages(id, title, section, url, content_text)` 单表即可满足当前契约。
