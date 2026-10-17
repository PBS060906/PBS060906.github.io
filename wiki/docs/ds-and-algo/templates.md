# 代码模板 (C++)

本页收录竞赛中最高频的 C++ 代码模板，均可在 OJ 上直接使用。每个模板标注**适用场景**与**时间复杂度**，关键行附实现注释。建议先理解推导再背诵——考场上默写比翻资料快得多，也可靠得多。

## 基础框架

!!! note "输入输出优化"

    算法题的输入量常达 $10^6$ 级别，默认的 `cin`/`cout` 可能超时，主函数开头固定加上：

    ```cpp
    #include <bits/stdc++.h>
    using namespace std;

    using ll = long long;
    using PII = pair<int, int>;
    const int INF = 0x3f3f3f3f;   // 两个 INF 相加仍不会溢出 int

    int main() {
        ios::sync_with_stdio(false);  // 解除与 C 标准流的同步
        cin.tie(nullptr);             // 解绑 cin 与 cout，避免每次读入前刷新
        // ... 解题逻辑
        return 0;
    }
    ```

## 快速排序

**适用场景**：通用排序、求第 k 大/小数（快速选择是其变形）。平均 $O(n \log n)$，最坏 $O(n^2)$，随机选取哨兵可规避最坏情况。

```cpp
void quickSort(int a[], int l, int r) {
    if (l >= r) return;
    int i = l - 1, j = r + 1, x = a[l + r >> 1];  // x 为哨兵，取区间中点元素
    while (i < j) {
        while (a[++i] < x);   // i 右移，停在第一个 >= x 的位置
        while (a[--j] > x);   // j 左移，停在第一个 <= x 的位置
        if (i < j) swap(a[i], a[j]);
    }
    quickSort(a, l, j), quickSort(a, j + 1, r);  // 以 j 为界划分为两半递归
}
```

!!! warning "边界陷阱"

    哨兵取 `a[l]` 时递归边界必须配合右端划分，否则在两元素区间上死循环。上例"取中点 + `j` 划分"是经过验证的安全组合，默写时不要随意混搭。

## 二分查找

**适用场景**：单调序列定位、"最大值最小 / 最小值最大"类判定问题。$O(\log n)$。核心是维护循环不变式：**答案始终落在 `[l, r]` 内**。

=== "找左边界"

    ```cpp
    // 找左边界：满足条件的最小位置
    int l = 0, r = n - 1;
    while (l < r) {
        int mid = l + r >> 1;    // 下取整，配合 r = mid 收缩
        if (check(mid)) r = mid; // mid 可行，答案在 [l, mid]
        else l = mid + 1;        // mid 不可行，答案在 [mid+1, r]
    }
    // 结束时 l == r，即答案
    ```

=== "找右边界"

    ```cpp
    // 找右边界：满足条件的最大位置
    int l = 0, r = n - 1;
    while (l < r) {
        int mid = l + r + 1 >> 1; // 上取整，防止 l = mid 时区间不缩死循环
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    ```

实数域二分：`while (r - l > 1e-6)` 或固定循环 100 次，精度取题目要求的两倍以上更稳妥。

## 前缀和与差分

**适用场景**：静态数组多次查询区间和；多次对区间整体加减后统一还原。预处理 $O(n)$，单次操作 $O(1)$。

```cpp
// 前缀和：s[i] = a[1] + a[2] + ... + a[i]，下标从 1 开始避免边界特判
for (int i = 1; i <= n; i++) s[i] = s[i - 1] + a[i];
int rangeSum = s[r] - s[l - 1];   // 区间 [l, r] 的和

// 差分：对区间 [l, r] 整体加 c，只改两个端点
d[l] += c, d[r + 1] -= c;
// 所有修改完成后，对 d 求前缀和即可还原出最终数组
```

前缀和与差分互为逆运算：**前缀和加速查询，差分加速修改**。二维版本同理，用容斥展开四个角。

## 单调栈

**适用场景**：求每个元素左/右侧第一个比它大（小）的元素、柱状图中最大矩形。每个元素至多入栈出栈一次，$O(n)$。

```cpp
// 每个元素左侧第一个比它小的元素
stack<int> stk;
for (int i = 0; i < n; i++) {
    while (!stk.empty() && a[stk.top()] >= a[i]) stk.pop();  // 弹出不可能再成为答案的元素
    left[i] = stk.empty() ? -1 : stk.top();                  // 栈顶即左侧最近小元素下标
    stk.push(i);
}
```

单调性：栈内下标对应的值始终保持递增。被弹出的元素之后不会再被任何询问用到——这正是均摊 $O(n)$ 的原因。

## 单调队列 {: #单调队列 }

**适用场景**：滑动窗口最大/最小值；DP 转移中的"区间取最值"优化（见 [动态规划](topic/dp.md)）。每个元素至多进出队一次，$O(n)$。

```cpp
// 长度为 k 的滑动窗口最大值：队列存下标，对应值单调递减
deque<int> dq;
for (int i = 0; i < n; i++) {
    if (!dq.empty() && dq.front() <= i - k) dq.pop_front();     // 队头已滑出窗口
    while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();  // 比新值小且更早的元素永无出头之日
    dq.push_back(i);
    if (i >= k - 1) ans.push_back(a[dq.front()]);               // 队头即当前窗口最大值
}
```

## Dijkstra 最短路 {: #dijkstra }

**适用场景**：**非负权**图的单源最短路，堆优化版 $O(E \log V)$，工程与竞赛的第一选择。存在负权边时改用 Bellman-Ford / SPFA（见 [图论](topic/graph.md)）。

```cpp
vector<int> dijkstra(int s) {
    priority_queue<PII, vector<PII>, greater<>> pq;  // 小根堆，元素为 (距离, 点)
    dist.assign(n, INF); dist[s] = 0;
    pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;   // 堆里的过期副本，直接跳过
        for (auto [v, w] : g[u])
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});  // 懒惰删除：不改堆，允许重复入堆
            }
    }
    return dist;
}
```

## 并查集 {: #并查集 }

**适用场景**：动态连通性判断、Kruskal 最小生成树、无向图判环。路径压缩 + 按秩合并时单次操作均摊 $O(\alpha(n))$，近似常数。

```cpp
int find(int x) {
    return fa[x] == x ? x : fa[x] = find(fa[x]);  // 路径压缩：查找途中把沿途节点直挂到根
}

void unite(int a, int b) { fa[find(a)] = find(b); }
```

初始化 `fa[i] = i`；判断连通即比较 `find(a) == find(b)`；统计连通块数即统计根的个数。

## 实践要点

- 大数据量务必开 `long long` 与快速 I/O（`ios::sync_with_stdio(false)`）；
- 递归 DFS 注意爆栈，可改显式栈；
- 多组测试数据记得清空邻接表、`fa` 数组与标记数组；
- 二分先手推循环不变式再写代码，`mid` 的取整方向必须与收缩方向配套；
- 默写完成后先用样例验证边界：空数组、单元素、全相同元素。
