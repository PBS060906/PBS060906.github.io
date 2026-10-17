# HTML

HTML 用标签描述文档的**结构与语义**。写好 HTML 的关键是"选对标签表达含义"——浏览器据此构建 DOM 树，CSS 与 JS 都挂在 DOM 上工作。

## 文档骨架

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">            <!-- 字符编码，放最前防止乱码 -->
  <meta name="viewport" content="width=device-width, initial-scale=1">  <!-- 移动端适配关键 -->
  <title>页面标题</title>
</head>
<body>
  <header>页头</header>
  <main>主体，全页唯一</main>
  <footer>页脚</footer>
</body>
</html>
```

- `lang` 帮助读屏器选择发音、搜索引擎判断语言；
- `viewport` 缺失时移动端按桌面宽度缩放显示，响应式布局无从谈起。

head 里的其他常用配置：

```html
<meta name="description" content="页面摘要，会显示在搜索结果里">
<link rel="icon" href="favicon.ico">
```

## 语义化标签

| 标签 | 语义 |
| ---- | ---- |
| `header` | 页头或区块头部 |
| `nav` | 导航区域 |
| `main` | 页面主体，全页唯一 |
| `article` | 独立成篇的内容 |
| `section` | 主题分组 |
| `aside` | 侧边关联内容 |
| `footer` | 页脚或区块尾部 |
| `time` | 机器可读的时间 |

一段典型的语义化结构：

```html
<body>
  <header>站点标题与搜索</header>
  <nav>主导航链接</nav>
  <main>
    <article>
      <h1>文章标题</h1>
      <section>第一章</section>
      <section>第二章</section>
    </article>
    <aside>相关阅读推荐</aside>
  </main>
  <footer>版权信息</footer>
</body>
```

!!! note "为什么强调语义化"

    利于 SEO、无障碍访问（读屏器）、可维护性，三者同源于"结构即含义"。

## 属性与全局规则

- **全局属性**：`id`（全页唯一）、`class`（样式与脚本钩子，可重复）、`data-*`（自定义数据）、`hidden`（隐藏元素）；
- **布尔属性**：`disabled`、`checked`、`required` 写属性名即生效；
- **空元素**：`<img>`、`<br>`、`<input>`、`<meta>` 无内容，无需闭合标签。

## 链接与多媒体

```html
<a href="https://example.com" target="_blank" rel="noopener">在新窗口打开外链</a>
<img src="photo.jpg" alt="西湖断桥雪景" width="600" loading="lazy">
```

- `alt` 必写：读屏器朗读它，图片加载失败时也靠它兜底；
- `loading="lazy"` 让视口外的图片滚动到附近才加载；
- 外链加 `rel="noopener"`，防止新页面通过 `window.opener` 操控原页面。

## 块级与行内

| 类别 | 特点 | 典型标签 |
| ---- | ---- | -------- |
| 块级 | 独占一行，可设宽高 | `div`、`p`、`h1`-`h6`、`ul` |
| 行内 | 排在一行内，宽高由内容决定 | `span`、`a`、`strong`、`em` |
| 行内块 | 一行排列且可设宽高 | `img`、`input`、`button` |

CSS 的 `display` 可以随意改写三者，理解默认行为有助于排查布局问题。

## 表格与列表

```html
<table>
  <caption>上半年销量</caption>
  <thead>
    <tr><th>季度</th><th>销售额</th></tr>
  </thead>
  <tbody>
    <tr><td>Q1</td><td>120 万</td></tr>
    <tr><td>Q2</td><td>150 万</td></tr>
  </tbody>
</table>
```

- `th` 是表头单元格，默认加粗居中，读屏器借此把列名和单元格关联起来；
- 无序列表 `ul/li`、有序列表 `ol/li`、描述列表 `dl/dt/dd` 各有语义，按含义选用。

## 表单要点

```html
<form action="/api/submit" method="post">
  <label for="email">邮箱</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">提交</button>
</form>
```

- `label` 的 `for` 与输入框 `id` 绑定，点击文字即可聚焦；
- 原生校验（`required`、`type=email`）优先于 JS 校验；
- 控件**必须有 `name`** 才会随表单提交到服务端；
- 常用输入类型：`text` / `email` / `number` / `password` / `checkbox` / `radio` / `file`，移动端会弹出对应键盘。

下拉与多行文本：

```html
<select name="city">
  <option value="hz">杭州</option>
  <option value="sh">上海</option>
</select>
<textarea name="msg" rows="4" placeholder="请留言"></textarea>
```

## 注释与字符转义

```html
<!-- 注释不会渲染，但源码里可见，不要在注释里放敏感信息 -->
<p>1 &lt; 2 &amp;&amp; 2 &lt; 3</p>
```

常用实体：`&lt;`（<）、`&gt;`（>）、`&amp;`（&）、`&quot;`（"）、`&copy;`（©）。正文里要展示 `<`、`&` 等保留字符时必须转义。

## 实践要点

- 用语义标签替代层层嵌套的 `<div>`（div soup），结构可读性天差地别；
- 图片必写 `alt`，表单控件必配 `label`；
- 结构与样式分离：不写内联 `style`，不用 `<center>`、`<font>` 等废弃标签；
- 标题只用一个 `h1`，层级递进不跳级；
- 自查方法：遮住视觉仅读标签，能否还原出页面的内容大纲。