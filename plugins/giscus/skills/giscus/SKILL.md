---
name: giscus
description: >
  当用户需要为静态网站（Hugo、Jekyll、VitePress、Docusaurus 等）添加评论系统、
  集成 Giscus、替代 Disqus、配置 GitHub Discussions 评论，或排查评论不显示等问题时使用。
  提供从仓库准备、Discussion 分类设置、主题变量获取到前端嵌入的完整流程。
---

# Giscus — 基于 GitHub Discussions 的开源评论系统

## 何时使用
- 为个人博客、项目文档、学术主页添加评论区
- 替代 Disqus / LiveRe 等第三方评论，避免广告和追踪
- 需要支持深色模式、Markdown、回复、表情反应的轻量方案
- 评论数据完全保存在自己的 GitHub 仓库 Discussion 中

## 前置条件
1. 仓库必须是 **public**，否则访客无法读取 Discussion
2. 已安装 [Giscus GitHub App](https://github.com/apps/giscus) 并授权目标仓库
3. 仓库中已开启 **Discussions** 功能（Settings → General → Discussions）

## 标准集成流程

### 1. 创建 Discussion 分类
在目标仓库的 Discussions 页面新建一个分类（例如 "Comments"），类型选 **Announcements** 或 **General**。记录分类名称，后面配置要用。

### 2. 获取配置参数
访问 [giscus.app/zh-CN](https://giscus.app/zh-CN)，按向导填入：
- **仓库**：`用户名/仓库名`
- **Discussion 分类**：上一步创建的分类名
- **映射关系**：常用 `pathname`（按页面路径自动映射）或 `title`
- **主题**：`preferred_color_scheme`（跟随系统）或固定 `light` / `dark`

页面会实时生成对应的 `<script>` 标签和 `data-*` 属性值。

### 3. 嵌入到站点模板
将生成的 `<script>` 插入到每篇文章或页面的底部模板中。常见框架示例：

#### Hugo（单页模板 / layouts/_default/single.html）
```html
{{ if not .Params.disableComments }}
<div class="giscus"></div>
<script src="https://giscus.app/client.js"
        data-repo="用户名/仓库名"
        data-repo-id="..."
        data-category="Comments"
        data-category-id="..."
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
{{ end }}
```
在文章 Front Matter 中可添加 `disableComments: true` 来关闭单页评论。

#### Jekyll / VitePress / Docusaurus
同样将上述 `<script>` 插入到文章布局组件或插件配置中即可。VitePress 可在 `.vitepress/theme/Layout.vue` 的 `onMounted` 中动态插入脚本。

### 4. 样式与体验微调
- **懒加载**：已自带 `async`，无需额外处理
- **深色模式切换**：监听 `matchMedia('(prefers-color-scheme: dark)')` 变化，调用 `giscus.sendMessage({ setConfig: { theme: 'dark' } })`
- **宽度自适应**：外层容器使用 `max-width: 100%;`，Giscus iframe 会自动撑满

## 常见问题排查
| 现象 | 排查步骤 |
|------|----------|
| 评论区空白 | 检查仓库是否为 public；Giscus App 是否已授权；浏览器控制台有无 CORS 或 404 |
| 不显示中文 | 确认 `data-lang="zh-CN"`；giscus.app 支持多语言 |
| 只有部分页面有评论 | 检查 `data-mapping` 是否统一；不同映射会产生不同 Discussion 标题 |
| 评论无法发送 | 确认用户已登录 GitHub 且对仓库 Discussion 有发言权限 |

## 相关链接
- 官方文档：https://github.com/giscus/giscus
- 配置向导：https://giscus.app/zh-CN
