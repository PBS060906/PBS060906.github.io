# 参与贡献

本知识库采用开源协作模式，欢迎任何形式的贡献。哪怕修复一个错别字、补充一条参考链接，都是对站点最直接的帮助。

## 贡献方式

1. **纠错**：发现笔误、错误结论，直接提 Issue 或 PR；
2. **补充**：为现有页面补充示例、参考链接；
3. **新增**：撰写新页面，与现有风格保持一致。

## 环境准备

| 依赖 | 要求 |
| ---- | ---- |
| Python | 3.10+ |
| MkDocs Material | `pip install mkdocs-material` |

全部页面为纯 Markdown，存放在 `docs/` 目录，站点导航与主题配置在根目录 `mkdocs.yml`。

## 工作流

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/PBS060906/personal-wiki.git

# 2. 本地预览
pip install mkdocs-material
mkdocs serve

# 3. 提交修改
git checkout -b docs/fix-typo
git commit -m "docs: 修复 xx 页面笔误"
git push origin docs/fix-typo
# 4. 在 GitHub 上发起 Pull Request
```

`mkdocs serve` 启动本地热更新预览，默认地址 `http://127.0.0.1:8000`；构建产物由 `mkdocs build` 输出到 `site/`，不要手动提交该目录。

## 提交与 PR 约定

- 提交信息遵循 Conventional Commits，如 `docs: 修复 xx 页面笔误`；
- 一个 PR 只做一件事，便于评审与回滚；
- 分支命名建议：`docs/<主题>`、`fix/<主题>`；
- 新增页面需在 `mkdocs.yml` 的 nav 中同步登记，才会出现在导航里。

!!! success "PR 发起前自查"

    - [ ] 本地 `mkdocs serve` 预览无误，页面可在导航中到达；
    - [ ] 代码示例可运行且标注语言；
    - [ ] 未改动与本次贡献无关的文件；
    - [ ] 遵循下方写作规范。

## 写作规范

!!! abstract "内容约定"

    - 每个页面有明确的 `h1` 标题与导航位置；
    - 概念解释 + 示例代码 + 参考链接 三段式结构；
    - 代码块标注语言，能运行的示例优先；
    - 数学公式使用 `$...$` / `$$...$$` 定界符。

补充说明：

- 使用简体中文，技术术语首次出现可附英文原文；
- 善用 Material 扩展：`!!!` 提示块、`===` 分栏标签、Mermaid 图表、表格对比；
- 图片等静态资源统一放在 `docs/assets/` 下，按主题建子目录命名。

## 致谢

感谢每一位提出建议与修改的伙伴，你们的反馈让这个知识库变得更好。
