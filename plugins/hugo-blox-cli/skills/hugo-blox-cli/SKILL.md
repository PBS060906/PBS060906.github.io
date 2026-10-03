---
name: hugo-blox-cli
description: >
  当用户使用 Hugo Academic / Hugo Blox 主题，需要批量导入 BibTeX 参考文献、
  生成 publications 页面、快速创建文章/项目/教程模板、管理学术内容元数据时使用。
  提供从安装 CLI 到批量导入、模板生成的完整命令流程。
---

# Hugo Blox CLI — 学术内容批量导入工具

## 何时使用
- 使用 Hugo Academic（现 Hugo Blox）主题搭建学术个人主页
- 需要把大量 BibTeX 论文一键导入为站点 publications
- 想快速生成标准格式的文章、项目、教程 Markdown 模板
- 避免手动编写每篇论文的 YAML Front Matter

## 前置条件
- 已安装 Hugo 并基于 Hugo Blox / Academic 主题初始化站点
- 已安装 Node.js（CLI 通过 npm 分发）
- 准备好 `.bib` 文件（从 Zotero、EndNote、Google Scholar 导出均可）

## 标准使用流程

### 1. 安装 CLI
在项目根目录或全局安装：

```bash
npm install --save-dev @hugoblox/hugoblox
# 或全局安装
npm install -g @hugoblox/hugoblox
```

旧版名称为 `wowchemy-cli`，新项目请使用 `@hugoblox/hugoblox`。

### 2. 从 BibTeX 批量导入论文
```bash
npx hugoblox import --file ./references.bib --publication-dir content/publication
```

参数说明：
- `--file`：BibTeX 文件路径
- `--publication-dir`：Hugo 站点中 publications 的内容目录

导入后会自动生成每篇论文的独立目录，包含：
- `index.md`：标准 YAML 头信息 + 摘要
- `cite.bib`：原始 BibTeX 引用
- 可选的 `featured.jpg`：若 BibTeX 包含 `file` 字段且可访问

### 3. 快速创建内容模板
```bash
# 创建文章
npx hugoblox new --kind post --path content/post/my-article

# 创建项目
npx hugoblox new --kind project --path content/project/my-project

# 创建教程
npx hugoblox new --kind docs --path content/docs/my-tutorial
```

生成的模板已包含 Academic 主题要求的标准 YAML 字段（title, date, authors, tags, categories 等）。

### 4. 元数据补全与检查
导入后建议批量检查以下字段：
- `featured: true`：设为 true 可在首页展示
- `doi`：确保 DOI 链接正确
- `url_pdf` / `url_code` / `url_dataset`：补充额外链接
- `projects`：关联到相关项目页面

示例手动修正（`content/publication/my-paper/index.md`）：

```yaml
---
title: "论文标题"
authors:
  - "张三"
  - "李四"
date: "2024-01-01"
doi: "10.1000/xyz123"
featured: true
publication: "某学术期刊"
url_pdf: "https://arxiv.org/pdf/2401.00001"
url_code: "https://github.com/example/repo"
---
```

## 常见问题排查
| 现象 | 排查步骤 |
|------|----------|
| 导入后格式错乱 | 检查 BibTeX 是否有特殊字符未转义；尝试先用 Zotero 清理后重新导出 |
| 中文作者名显示异常 | 确认 BibTeX 编码为 UTF-8；在 YAML 中保留中文，无需转义 |
| 论文未显示在首页 | 检查 `featured: true`；确认 `content/publication` 目录被主题正确加载 |
| CLI 命令不存在 | 检查是否安装 `@hugoblox/hugoblox`；旧版 `wowchemy` 命令在新包中已更名 |

## 相关链接
- 官方仓库：https://github.com/HugoBlox/hugo-blox-builder
- 文档：https://docs.hugoblox.com/
- 主题演示：https://hugoblox.com/templates/
