---
name: pagefind
description: >
  当用户需要为静态网站添加站内搜索、集成 Pagefind、替代 Lunr.js/Algolia、
  配置 Hugo 全文搜索、排查搜索结果为空或中文分词问题时使用。
  提供从安装、构建索引、嵌入 UI 到自定义权重的完整流程。
---

# Pagefind — 纯静态高性能站内搜索

## 何时使用
- 静态站点（Hugo、Jekyll、Eleventy、Astro、VitePress 等）需要全文搜索
- 希望完全无后端服务、索引在构建时生成
- 需要中文分词、代码片段搜索、结果权重排序
- 替代 Lunr.js（体积大、构建慢）或 Algolia（需外部服务）

## 前置条件
- 站点为静态生成（SSG），构建后输出 HTML 文件
- 有命令行访问权限（npm / npx）

## 标准集成流程

### 1. 安装 Pagefind
```bash
npm install --save-dev pagefind
# 或本地零安装：npx pagefind
```

### 2. 构建时生成索引
在站点构建完成后运行 `pagefind`：

```bash
# Hugo 示例
hugo --minify
npx pagefind --site public

# Jekyll 示例
bundle exec jekyll build
npx pagefind --site _site
```

Pagefind 会自动扫描所有 HTML，在 `public/pagefind/` 下生成索引。

### 3. 在页面中嵌入搜索 UI
在需要搜索框的页面（通常是首页或独立搜索页）引入默认 UI：

```html
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js" type="text/javascript"></script>

<div id="search"></div>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({ element: '#search', showSubResults: true });
  });
</script>
```

### 4. 自动化构建流程
在 `package.json` 的 scripts 中合并构建与索引步骤：

```json
{
  "scripts": {
    "build": "hugo --minify && pagefind --site public"
  }
}
```

或在 CI（GitHub Actions）中加入：

```yaml
- run: hugo --minify
- run: npx pagefind --site public
```

## 进阶配置

### 自定义索引范围
创建 `pagefind.yml` 控制索引行为：

```yaml
site: public
exclude_selectors:
  - "nav"
  - "footer"
  - ".toc"
force_language: zh
```

### 中文分词
Pagefind 从 HTML `lang` 属性自动识别语言。确保页面或文章有：

```html
<html lang="zh-CN">
```

或在 Hugo 模板中：
```html
<html lang="{{ .Site.Language.Lang }}">
```

### 权重与筛选
给特定元素增加权重：

```html
<h1 data-pagefind-weight="10">文章标题</h1>
```

添加自定义元数据用于筛选：

```html
<span data-pagefind-meta="category:教程"></span>
```

然后在搜索 UI 中暴露筛选器（需自定义 JavaScript 调用底层 `pagefind.search()` API）。

## 常见问题排查
| 现象 | 排查步骤 |
|------|----------|
| 搜索无结果 | 确认 `pagefind` 在构建后运行；检查 `--site` 指向的目录是否正确；查看 `pagefind/` 目录是否生成 |
| 中文搜索效果差 | 确认 HTML 标签含 `lang="zh-CN"`；尝试在 `pagefind.yml` 中设置 `force_language: zh` |
| 样式冲突 | 检查 `.pagefind-ui` 的 CSS 被主题覆盖；可自定义 CSS 变量覆盖默认样式 |
| 索引体积过大 | 使用 `exclude_selectors` 排除导航、页脚等重复内容；对长代码块加 `data-pagefind-ignore` |

## 相关链接
- 官方文档：https://pagefind.app/
- GitHub：https://github.com/CloudCannon/pagefind
