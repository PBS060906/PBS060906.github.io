# Python 编程专栏简介

Python 是人工智能领域的第一语言：语法接近伪代码、生态覆盖数据处理与建模全流程，从写脚本工具到训练模型都离不开它。本专栏从语法基础出发，逐步过渡到常用标准库与科学计算生态，帮助读者建立扎实的工程能力。

## 内容导航

<div class="grid cards" markdown>

- :material-code-braces:{ .lg .middle } **语法基础**

    ---

    变量与类型、控制流、函数、面向对象等核心语法，理解"一切皆对象"。

    [:octicons-arrow-right-24: 开始阅读](grammar.md)

- :material-package-variant-closed:{ .lg .middle } **常用标准库**

    ---

    `collections`、`itertools`、`pathlib`、`functools` 等开箱即用的工具。

    [:octicons-arrow-right-24: 开始阅读](std-lib.md)

</div>

## 学习路径

```mermaid
flowchart LR
    A[语法基础] --> B[常用标准库]
    B --> C[科学计算生态]
    C --> D[机器学习]
    D --> E[深度学习]
```

1. **语法基础**：能独立写出函数与类，绕开可变默认参数等常见陷阱；
2. **常用标准库**：熟练使用 `collections`、`pathlib`，少写重复轮子；
3. **科学计算生态**：`numpy` 做数组运算、`pandas` 处理表格数据、`matplotlib` 出图；
4. **进入算法**：基础扎实后，继续阅读 [机器学习](../machine-learning.md) 与 [深度学习](../deep-learning.md)。

!!! tip "Jupyter 适合探索，脚本适合工程"

    数据探索用 Jupyter Notebook 更直观；正式项目建议写成 `.py` 模块，便于版本管理与测试。

## 环境搭建

!!! example "推荐的环境管理方式"

    ```bash
    # 使用 uv 创建虚拟环境（推荐）
    uv venv .venv
    . .venv/bin/activate  # Windows: .venv\Scripts\activate

    # 安装依赖
    uv pip install numpy pandas matplotlib
    ```

## 版本选择

| 版本 | 状态 | 建议 |
| ---- | ---- | ---- |
| 3.10 | 维护期 | 可用，部分新特性缺失 |
| 3.12 | 稳定 | **推荐**，性能与生态兼容性好 |
| 3.13 | 最新 | 尝鲜可用，个别库可能未适配 |
