# 常用标准库

Python 的"自带电池"哲学让标准库覆盖了绝大多数常见场景。本节挑选最高频的几个模块做速览：掌握它们之后，大部分日常任务都不需要引入第三方依赖。

## collections：高级容器

```python
from collections import Counter, defaultdict, deque, namedtuple

cnt = Counter("mississippi")
print(cnt.most_common(2))   # [('i', 4), ('s', 4)]，按频次从高到低

graph = defaultdict(list)   # 免去键不存在时的判断
graph["a"].append(1)        # 访问不存在的键会自动创建空列表

queue = deque([1, 2, 3])    # 双端队列，BFS 利器
queue.append(4)             # 右端入队
queue.popleft()             # 左端出队，O(1)（list.pop(0) 是 O(n)）

Point = namedtuple("Point", ["x", "y"])   # 具名元组：轻量只读记录
p = Point(1, 2)
print(p.x, p.y)             # 1 2
```

!!! note "Counter 的常用操作"

    `cnt["key"]` 对不存在的键返回 0 而不报错；`cnt.update("abc")` 累加计数；两个 Counter 可以直接做加减运算。

## itertools：迭代器 algebra

```python
from itertools import chain, product, combinations, islice, accumulate

list(chain([1, 2], [3, 4]))        # [1, 2, 3, 4]，拼接多个可迭代对象
list(product("AB", repeat=2))      # 笛卡尔积：AA AB BA BB
list(combinations([1, 2, 3], 2))   # [(1,2), (1,3), (2,3)]，组合
list(accumulate([1, 2, 3, 4]))     # [1, 3, 6, 10]，前缀和
list(islice(range(100), 5, 10))    # [5, 6, 7, 8, 9]，切片而不复制
```

itertools 的函数都返回**惰性迭代器**，处理大数据时不会一次性加载进内存。

## heapq：堆与 Top-K

```python
import heapq

nums = [5, 1, 8, 3]
heapq.heapify(nums)                     # 原地建小顶堆，O(n)
heapq.heappush(nums, 2)
print(heapq.heappop(nums))              # 1，弹出当前最小值
print(heapq.nlargest(2, [5, 1, 8, 3]))  # [8, 5]，Top-K 神器
```

堆适合"数据流中动态维护最大 / 最小的 K 个元素"，比每次全量排序高效得多。

## pathlib：面向对象的路径

```python
from pathlib import Path

root = Path("data") / "raw"        # 用 / 拼接路径，跨平台
for txt in root.glob("*.txt"):
    print(txt.name, txt.stat().st_size)

text = (root / "a.txt").read_text(encoding="utf-8")   # 读写一步到位
(root / "out").mkdir(parents=True, exist_ok=True)
```

!!! tip "优先 pathlib 而非 os.path"

    `pathlib` 面向对象、跨平台且可读性更好，新代码建议统一使用。

## functools：函数工具箱

```python
from functools import lru_cache, partial

@lru_cache(maxsize=None)
def slow_fib(n: int) -> int:
    return n if n < 2 else slow_fib(n - 1) + slow_fib(n - 2)

print(slow_fib(50))   # 12586269025，缓存后从指数级降为线性

int2 = partial(int, base=2)   # 固定部分参数，生成新函数
print(int2("1010"))           # 10
```

## json、re 与 logging

=== "json"

    ```python
    import json

    data = {"name": "斟知", "tags": ["wiki"]}
    s = json.dumps(data, ensure_ascii=False)   # dict → JSON 字符串
    obj = json.loads(s)                        # JSON 字符串 → dict

    with open("a.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)  # 直接写文件
    ```

=== "re"

    ```python
    import re

    m = re.search(r"(\d{4})-(\d{2})", "2026-10-17")
    print(m.group(0), m.group(1))        # 2026-10 2026
    print(re.sub(r"\s+", " ", "a  b"))   # 'a b'，空白归一化
    ```

=== "logging"

    ```python
    import logging

    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(message)s")
    logging.info("训练开始")   # 代替 print，可分级、可输出到文件
    ```

## 常用速查表

| 模块 | 典型场景 | 一句话记忆 |
| ---- | -------- | ---------- |
| `collections` | 计数、分组、队列 | 高级容器 |
| `itertools` | 组合迭代 | 迭代器 Algebra |
| `heapq` | 堆、Top-K | 小顶堆标配 |
| `pathlib` | 文件路径 | 面向对象版 os.path |
| `functools` | 缓存、偏函数 | 函数工具箱 |
| `json` | 序列化 | 与 dict 互转 |
| `re` | 正则匹配 | 文本清洗首选 |
| `logging` | 日志 | 别再 print 了 |

## 其他值得一查的模块

| 模块 | 用途 |
| ---- | ---- |
| `datetime` | 日期时间、时区与时间差计算 |
| `random` | 随机数与抽样（复现实验先设 `seed`） |
| `argparse` | 编写命令行工具 |
| `shutil` | 文件复制、移动与压缩打包 |
| `hashlib` | 加密哈希与校验和（缓存键、去重） |
| `sqlite3` | 内置的轻量 SQL 数据库 |
| `os.environ` | 读取环境变量（密钥不要写进代码） |

## 实践要点

1. 涉及计数、分组、队列时先想 `collections`，别手写循环；
2. 处理大规模数据保持"迭代器思维"：生成器与 `itertools` 组合可在常量内存下完成流水线处理；
3. Top-K 场景用 `heapq.nlargest` / `nsmallest`，而不是先排序再切片；
4. 路径操作一律 `pathlib`，序列化用 `json` 并注意 `ensure_ascii=False` 保留中文；
5. 递归函数加 `@lru_cache` 是最便宜的优化，但参数必须可哈希；
6. 正式项目用 `logging` 分级记录日志，`print` 只留给一次性脚本。
