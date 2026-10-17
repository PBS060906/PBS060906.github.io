# CSS

CSS 负责"怎么摆、长什么样"。现代布局问题的标准答案只有两个：**Flexbox 与 Grid**——掌握盒模型与这两者，就能解决绝大多数布局需求。

## 盒模型

每个元素都是 内容 + 内边距 + 边框 + 外边距 的矩形盒子：

```css
* { box-sizing: border-box; }  /* 统一按边框盒计算，强烈推荐 */
```

默认的 `content-box` 下，`width` 只含内容区，加了 padding 元素反而变宽；`border-box` 让 `width` 直接等于最终宽度，心算成本最低，已是业界默认。

## 选择器优先级

从低到高：元素 < 类 < ID < 行内样式；`!important` 强制登顶但应避免滥用。

浏览器用三元组 `(ID数, 类数, 元素数)` 比较：`(1,0,0)` 永远大于 `(0,99,99)`；优先级相同则后写的胜出。后代选择器 `nav a`、并集 `a, .btn` 只是组合用法，不产生新的优先级等级。

## 层叠与继承

- **继承**：`color`、`font`、`line-height` 等文本属性默认沿 DOM 树向下传递；`width`、`margin`、`border` 等盒模型属性不继承；
- **层叠**：多个规则命中同一元素时，先比优先级，再比源码顺序——这就是"层叠样式表"名字的由来。

## 常用单位

| 单位 | 含义 | 典型场景 |
| ---- | ---- | -------- |
| `px` | 固定像素 | 边框、阴影等不随缩放的细节 |
| `rem` | 根元素字号 | 字号与间距，改根字号全局缩放 |
| `%` | 相对父元素 | 宽度、高度 |
| `vw` / `vh` | 视口宽 / 高的 1% | 全屏区块、大标题 |

## Flexbox 速成

```css
.container {
  display: flex;
  justify-content: space-between;  /* 主轴对齐 */
  align-items: center;             /* 交叉轴对齐 */
  gap: 1rem;                       /* 子项间距，替代 margin 技巧 */
}
```

适用**一维**布局：导航栏、工具条、卡片行。主轴方向由 `flex-direction` 决定（默认水平）；子项设 `flex: 1` 平分剩余空间，`flex: none` 保持内容宽。

## Grid 速成

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));  /* 列宽不小于 240px，能塞几列塞几列 */
  gap: 1rem;
}
```

适用**二维**布局：整页框架、瀑布卡片。上面一行 CSS 就实现了自适应卡片网格。

## 水平垂直居中

=== "Flex"

    ```css
    .parent { display: flex; justify-content: center; align-items: center; }
    ```

=== "Grid"

    ```css
    .parent { display: grid; place-items: center; }  /* 最短写法 */
    ```

=== "绝对定位"

    ```css
    .parent { position: relative; }
    .child {
      position: absolute;
      inset: 0;             /* 上下左右全部贴到父元素 */
      margin: auto;         /* 配合确定宽高实现居中 */
      width: max-content;
      height: max-content;
    }
    ```

## 定位 position

| 取值 | 参照物 | 说明 |
| ---- | ------ | ---- |
| `static` | 无 | 默认值，正常文档流 |
| `relative` | 自身原位置 | 偏移后原占位保留 |
| `absolute` | 最近的非 static 祖先 | 脱离文档流，常配合 relative 父元素 |
| `fixed` | 视口 | 滚动不动，如悬浮按钮 |
| `sticky` | 滚动容器 | 到阈值前正常，之后吸住，如表头 |

## 伪类与伪元素

```css
a:hover { color: var(--primary); }                   /* 悬停反馈 */
input:focus { outline: 2px solid var(--primary); }   /* 焦点环，别随意去掉 */
li:first-child { font-weight: bold; }                /* 结构伪类 */
.quote::before { content: "\201C"; }                 /* 伪元素：插入装饰内容 */
```

`::before` / `::after` 常用来画徽标、分隔线等纯装饰，让装饰性内容不进 HTML 结构。

## CSS 变量

```css
:root {
  --primary: #4051b5;          /* 全局主题色 */
  --radius: 8px;
}
.button {
  background: var(--primary);
  border-radius: var(--radius);
}
```

换主题只改一处；JS 还能用 `element.style.setProperty()` 动态修改变量。

## 响应式三件套

1. 流式单位：`%`、`rem`、`vw`；
2. 媒体查询：`@media (max-width: 768px) { ... }`；
3. 自适应图片：`max-width: 100%; height: auto;`

```css
/* 移动端优先：默认样式即小屏样式 */
.cards { grid-template-columns: 1fr; }
@media (min-width: 768px) {      /* 平板及以上 */
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1200px) {     /* 桌面 */
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```

!!! tip "移动端优先"

    基础样式面向小屏写，用 `min-width` 媒体查询逐级增强，比反过来省事得多。

## 实践要点

- 全局 `border-box`，从根源上消除宽度计算烦恼；
- 动手前先判断：一维用 Flex，二维用 Grid；
- 主题色、圆角、间距收敛为 CSS 变量，避免魔法数字满天飞；
- 选择器保持两三层以内，靠优先级而非 `!important` 解决冲突；
- 调试布局用 DevTools 的盒模型面板，直接看 content/padding/border/margin 的实际值。