# 语法基础

本节梳理 Python 最核心的语法要素：变量与类型、控制流、函数、面向对象与异常处理，帮助读者快速建立语言的"骨架"认知。语法是所有上层工具的地基，值得把每个示例亲手跑一遍。

## 变量与类型

Python 是动态类型语言，变量无需声明类型；类型标注（type hint）不参与运行时检查，但能显著提升可读性与 IDE 提示质量：

```python
x: int = 42              # 整数
y: float = 3.14          # 浮点数
s: str = "hello"         # 字符串
flag: bool = True        # 布尔值
items: list[int] = [1, 2, 3]     # 列表：有序、可变
point: tuple[int, int] = (1, 2)  # 元组：有序、不可变
cache: dict[str, int] = {"a": 1} # 字典：键值映射
tags: set[str] = {"ml", "dl"}    # 集合：去重、无序
```

!!! note "一切皆对象"

    Python 中数字、函数、类本身都是对象，变量只是对象的**名字绑定**，而非"盒子"。赋值 `b = a` 只是让两个名字指向同一个对象。

理解"绑定"之后，可变与不可变的行为差异就顺理成章：

```python
a = [1, 2, 3]
b = a            # b 与 a 指向同一个列表对象
b.append(4)
print(a)         # [1, 2, 3, 4] —— a 也"变"了

m = 1000
n = m            # 不可变对象：n += 1 会创建新对象，不影响 m
n += 1
print(m, n)      # 1000 1001
```

比较值用 `==`，比较身份（是否同一对象）用 `is`：

```python
print(1 == True)      # True，值相等
print([1] is [1])     # False，两个不同的列表对象
```

## 控制流

```python
for i in range(10):
    if i % 2 == 0:
        continue
    print(i, end=" ")

# 1 3 5 7 9
```

`enumerate` 与 `zip` 让循环更地道：

```python
for idx, name in enumerate(["a", "b"], start=1):
    print(idx, name)      # 1 a / 2 b，无需手动维护下标

for score, label in zip([0.9, 0.8], ["cat", "dog"]):
    print(label, score)   # 按位置一一配对
```

三元表达式与解包是高频用法：

```python
n = 7
parity = "even" if n % 2 == 0 else "odd"
a, b = 1, 2
a, b = b, a               # 交换，无需临时变量
first, *rest = [1, 2, 3]  # first=1, rest=[2, 3]
```

Python 3.10+ 的结构化模式匹配适合处理多分支的"形状"判断：

```python
def handle(cmd: str) -> str:
    match cmd.split():
        case ["quit"]:
            return "bye"
        case ["load", path]:
            return f"loading {path}"
        case _:
            return "unknown"
```

## 函数

```python
def fib(n: int) -> list[int]:
    """返回前 n 个斐波那契数。"""
    seq = [0, 1]
    for _ in range(n - 2):
        seq.append(seq[-1] + seq[-2])
    return seq[:n]

print(fib(8))  # [0, 1, 1, 2, 3, 5, 8, 13]
```

### 参数传递的要点

- 位置参数在前，关键字参数在后；
- 默认参数**避免使用可变对象**——默认值在函数定义时只求值一次，会在多次调用间共享；
- `*args` 收集多余位置参数，`**kwargs` 收集多余关键字参数。

```python
# 反例：默认列表会在多次调用间共享
def append_to(item, bucket=[]):     # 危险
    bucket.append(item)
    return bucket

append_to(1)   # [1]
append_to(2)   # [1, 2]，上一次调用的结果被"记住"了

# 正确写法
def append_to(item, bucket=None):
    bucket = [] if bucket is None else bucket
    bucket.append(item)
    return bucket
```

### 推导式与生成器

推导式是 Python 处理集合的惯用法，比等价的 for 循环更简洁：

```python
squares = [x * x for x in range(10) if x % 2 == 0]  # [0, 4, 16, 36, 64]
lengths = {s: len(s) for s in ["cat", "dog"]}        # {'cat': 3, 'dog': 3}

gen = (x * x for x in range(10))   # 生成器表达式：惰性求值，省内存
```

`yield` 把函数变成生成器，适合逐条产出大数据流：

```python
def read_lines(path: str):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n")   # 每次只在内存中保留一行
```

## 面向对象速览

```python
class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        raise NotImplementedError

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name}: 汪汪"

print(Dog("旺财").speak())  # 旺财: 汪汪
```

子类通过 `super()` 复用父类逻辑；`dataclass` 则帮我们省去样板代码：

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float = 0.0

p = Point(1.0)
print(p)                     # Point(x=1.0, y=0.0)，自动生成 __init__ 与 __repr__
print(p == Point(1.0, 0.0))  # True，自动生成 __eq__
```

## 异常处理

Python 社区推崇 **EAFP** 风格（Easier to Ask Forgiveness than Permission）：先尝试执行、出错再捕获，而不是提前层层判断。

```python
try:
    value = int("42")
except ValueError as e:      # 只捕获预期中的异常类型
    print(f"解析失败: {e}")
else:
    print(f"成功: {value}")   # 无异常时执行
finally:
    print("总会执行")         # 清理资源的场合
```

!!! warning "不要裸 except"

    `except:` 会吞掉所有异常（包括 `KeyboardInterrupt`），至少要指定异常类型，并保留日志或向上抛出。

## 小结

- 变量是对象的名字绑定；可变与不可变的行为差异、`==` 与 `is` 的区别都源于此；
- 默认参数避免可变对象，比较身份用 `is`，比较值用 `==`；
- 推导式与生成器是集合处理的惯用法，大数据场景保持惰性求值；
- 遵循 EAFP 风格，只捕获预期中的具体异常；
- 熟悉语法后，移步 [常用标准库](std-lib.md) 提升工程效率；想深入异步与并发，请阅读后端专栏的 [Python](../../../develop/backend/python.md) 页面。
