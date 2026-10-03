---
name: front-matter
description: >
  当用户在 VS Code 中编辑 Hugo/静态站点内容，需要可视化管理 YAML Front Matter、
  检查 SEO 合规性、批量修改文章属性、管理草稿状态、预览站点时使用。
  提供从安装扩展、初始化配置到日常内容管理的完整工作流。
---

# Front Matter — VS Code 站点内容管理插件

## 何时使用
- 使用 VS Code 编写 Hugo / Jekyll / Eleventy / Docusaurus 内容
- 不想手动编写和校对 YAML Front Matter（标题、日期、标签、分类等）
- 需要批量修改文章属性（如统一改分类、加标签）
- 希望实时预览草稿、检查 SEO 合规性
- 管理大量内容时降低出错率、提升效率

## 前置条件
- 已安装 VS Code（非 Web 版，需桌面端扩展市场）
- 站点为静态生成器项目（Hugo 等），内容使用 Markdown + YAML Front Matter

## 标准使用流程

### 1. 安装扩展
在 VS Code 扩展市场搜索 **"Front Matter"**（作者：Elio Struyf），点击安装。

### 2. 初始化项目配置
首次打开项目时，Front Matter 会自动检测站点类型。若未自动识别，按 `Ctrl+Shift+P`（或 `Cmd+Shift+P`）打开命令面板，执行：

```
Front Matter: Initialize project
```

这会在项目根目录创建 `.frontmatter/content.db` 和 `frontmatter.json` 配置文件。

### 3. 配置内容类型（Content Types）
编辑 `frontmatter.json`，定义站点使用的内容类型和字段：

```json
{
  "$schema": "https://frontmatter.codes/frontmatter.schema.json",
  "frontMatter.taxonomy.contentTypes": [
    {
      "name": "post",
      "fields": [
        { "title": "标题", "name": "title", "type": "string", "required": true },
        { "title": "日期", "name": "date", "type": "datetime", "default": "{{now}}" },
        { "title": "草稿", "name": "draft", "type": "boolean", "default": true },
        { "title": "标签", "name": "tags", "type": "tags" },
        { "title": "分类", "name": "categories", "type": "categories" },
        { "title": "作者", "name": "authors", "type": "list" },
        { "title": "摘要", "name": "summary", "type": "string" }
      ]
    }
  ],
  "frontMatter.content.pageFolders": [
    {
      "title": "文章",
      "path": "[[workspace]]/content/post"
    },
    {
      "title": "项目",
      "path": "[[workspace]]/content/project"
    }
  ]
}
```

### 4. 日常使用
#### 可视化编辑 Front Matter
打开任意 Markdown 文件，点击编辑器右上角的 **Front Matter 面板**（或按 `Ctrl+Alt+P`），即可在侧边栏通过表单编辑所有元数据，无需手写 YAML。

#### SEO 检查
Front Matter 内置 SEO 评分，会提示：
- 标题长度是否合适
- 是否缺少描述（description/summary）
- 图片是否包含 alt 文本
- 关键字密度建议

#### 草稿管理与预览
- 在面板中直接切换 `draft: true/false`
- 使用 `Front Matter: Start server` 启动本地预览，自动包含草稿文章

#### 批量操作
在 VS Code 资源管理器中选中多个 Markdown 文件，右键选择：
- **Front Matter: Bulk edit** — 批量修改属性
- **Front Matter: Move content** — 移动内容到其他目录
- **Front Matter: Create content** — 基于模板创建新文章

#### 媒体管理
使用命令 `Front Matter: Insert media` 插入图片，Front Matter 会自动：
- 复制图片到配置的静态资源目录
- 生成带 alt 文本的 Markdown 图片语法
- 支持图片压缩和 WebP 转换（需额外配置）

## 进阶技巧
| 需求 | 操作 |
|------|------|
| 自定义模板 | 在 `.frontmatter/templates/` 下创建 `.md` 模板文件，新建内容时选择模板 |
| 数据文件支持 | 配置 `frontMatter.content.placeholders` 自动填充作者信息、站点名称等 |
| 与 Git 集成 | 开启 `frontMatter.git.enabled`，提交前自动检查未发布草稿 |
| 多语言站点 | 为每种语言配置独立的 `pageFolders` 和 `contentTypes` |

## 常见问题排查
| 现象 | 排查步骤 |
|------|----------|
| 面板不显示 | 确认文件扩展名为 `.md`；检查 `frontmatter.json` 中 `pageFolders` 路径是否正确 |
| 字段类型不对 | 在 `contentTypes.fields` 中检查 `type` 是否支持（string / datetime / boolean / tags / categories / image / list 等） |
| SEO 检查不生效 | 确认 `frontmatter.json` 中启用了 `frontMatter.taxonomy.seo.enabled: true` |
| 标签/分类无法选择 | 首次使用需先创建一些带标签的文章，或手动在 `frontmatter.json` 中定义 `frontMatter.taxonomy.tags` / `categories` |

## 相关链接
- 官方仓库：https://github.com/estruyf/vscode-front-matter
- 文档：https://frontmatter.codes/
- 扩展市场：https://marketplace.visualstudio.com/items?itemName=eliostruy.vscode-front-matter
