# JavaScript

JavaScript 是浏览器的编程语言，也是全栈通用语言（Node.js）。它单线程、动态类型、函数是一等公民。本页聚焦语言核心。

## 变量与类型

```javascript
let count = 0;          // 可变绑定
const PI = 3.14;        // 不可变绑定，默认用它
```

七种原始类型：`number` / `string` / `boolean` / `undefined` / `null` / `symbol` / `bigint`，其余皆对象。

```javascript
typeof 42;        // "number"
typeof "hi";      // "string"
typeof null;      // "object"——历史遗留的误报，判断 null 要用 === null

1 == "1";         // true：隐式类型转换后比较，避免使用
1 === "1";        // false：类型与值都要相等，一律用 ===
```

## 对象与引用

```javascript
const a = { x: 1 };
const b = a;                      // 复制的是引用，b 与 a 是同一个对象
b.x = 2;
console.log(a.x);                 // 2

const shallow = { ...a };         // 浅拷贝：嵌套对象仍然共享
const deep = structuredClone(a);  // 深拷贝，现代浏览器内置
```

原始类型按值复制，对象按引用复制——大多数"它怎么自己变了"的 bug 都源于此。

## 函数与作用域

```javascript
function makeCounter() {
  let count = 0;        // 被闭包捕获，外部无法直接访问
  return () => ++count; // 箭头函数没有自己的 this，继承外层作用域
}
const next = makeCounter();
next(); // 1
next(); // 2 —— count 一直活着，这就是闭包
```

闭包 = 函数 + 它定义时所处的作用域。回调、防抖节流、模块私有变量都依赖它；但被捕获的变量无法回收，滥用会导致内存泄漏。

解构与展开让对象、数组的操作更顺手：

```javascript
const { name, ...rest } = user;    // 解构取字段，剩余归 rest
const merged = [...arr1, ...arr2]; // 数组合并
const copy = { ...user, age: 18 }; // 浅拷贝并覆盖字段
```

## 异步模型

JS 单线程，耗时操作交给事件循环：同步代码执行完 → 清空微任务（`Promise.then`）→ 取一个宏任务（`setTimeout`）→ 循环往复。

```javascript
console.log(1);
setTimeout(() => console.log(2));              // 宏任务
Promise.resolve().then(() => console.log(3));  // 微任务
console.log(4);
// 输出顺序：1 4 3 2 —— 微任务先于宏任务
```

```javascript
// Promise 链
fetch("/api/data")
  .then(res => res.json())
  .then(data => render(data))
  .catch(console.error);

// async/await（等价、更易读）
async function load() {
  try {
    const res = await fetch("/api/data");
    render(await res.json());
  } catch (err) {
    console.error(err);
  }
}
```

`await` 只暂停当前 async 函数，不阻塞主线程；相互独立的请求用 `Promise.all` 并行，连续 `await` 会白白串行。

## 数组高频方法

```javascript
const nums = [1, 2, 3, 4];
nums.map(x => x * 2);         // [2, 4, 6, 8] —— 一一变换
nums.filter(x => x % 2);      // [1, 3] —— 条件筛选
nums.reduce((a, b) => a + b); // 10 —— 归约成单值
nums.find(x => x > 2);        // 3 —— 第一个满足的元素
nums.some(x => x > 3);        // true —— 存在即真
```

`sort` 会**修改原数组**，且默认按字符串比较——`[9, 10].sort()` 会得到 `[10, 9]`。数字排序必须传比较器：

```javascript
const sorted = [...nums].sort((a, b) => a - b);  // 先复制再排，比较器保证数值序
```

## 类与原型

```javascript
class Stack {
  #items = [];                              // # 开头是私有字段，外部访问不到
  push(x) { this.#items.push(x); }
  pop() { return this.#items.pop(); }
  get size() { return this.#items.length; }
}
const s = new Stack();
s.push(1);
```

`class` 本质是原型的语法糖：方法挂在原型上，实例通过原型链共享，省内存。

## DOM 操作速览

```javascript
const el = document.querySelector("#app");
el.addEventListener("click", (e) => {
  e.target.classList.toggle("active");
});

const li = document.createElement("li");  // 创建节点
li.textContent = "新条目";
document.querySelector("ul").append(li);  // 挂到页面上
```

事件先从外向内**捕获**，再从内向外**冒泡**，监听器默认在冒泡阶段触发。利用冒泡可以做**事件委托**——监听器只挂在父元素上：

```javascript
// 子元素再多也只有一个监听器，动态新增的列表项也自动生效
list.addEventListener("click", (e) => {
  if (e.target.matches("li")) e.target.classList.toggle("done");
});
```

!!! warning "性能注意"

    频繁重排重绘会卡顿：批量修改用 `DocumentFragment`，列表渲染用事件委托。

## 实践要点

- 默认 `const`，需要重新赋值才用 `let`，不用 `var`；
- 比较一律 `===`，别依赖隐式类型转换；
- 相互独立的请求用 `Promise.all` 并行，别把 `await` 写成串行；
- 优先用 `map` / `filter` / `reduce` 表达意图，少写命令式 for 循环；
- DOM 批量操作先离屏（Fragment）再一次性挂载，动态列表用事件委托。