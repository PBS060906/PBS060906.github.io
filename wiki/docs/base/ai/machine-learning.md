# 机器学习

机器学习的本质：**从数据中归纳规律，用规律预测未知**。它不为每个问题手写规则，而是让算法从样本中自动拟合出映射关系。本页给出主线脉络与核心概念速览，为后续深度学习打底。

## 基本术语

- **特征（Feature）**：描述样本的输入变量，如房价预测中的面积、地段；
- **标签（Label）**：要预测的目标输出，如房价本身；
- **训练集 / 测试集**：前者用于拟合模型，后者只用于评估泛化能力；
- **模型**：带参数的函数 $f_\theta(\boldsymbol{x})$，训练就是寻找最优参数 $\theta$。

## 三大类范式

| 范式 | 数据形态 | 代表算法 | 典型任务 |
| ---- | -------- | -------- | -------- |
| 监督学习 | 有标签 | 线性回归、决策树、SVM | 分类、回归 |
| 无监督学习 | 无标签 | K-Means、PCA | 聚类、降维 |
| 强化学习 | 环境反馈 | Q-Learning、PPO | 游戏、机器人控制 |

## 经典工作流

```mermaid
flowchart LR
    A[数据采集] --> B[数据清洗]
    B --> C[特征工程]
    C --> D[模型训练]
    D --> E[模型评估]
    E --> F{达标?}
    F -- 否 --> C
    F -- 是 --> G[部署上线]
```

其中"数据清洗与特征工程"往往占据实际项目 70% 以上的工作量。

## 损失函数与优化

训练的目标是最小化损失函数，回归与分类的常用损失不同：

$$
L_{\mathrm{MSE}} = \frac{1}{n}\sum_{i=1}^{n}\left(y_i - \hat{y}_i\right)^2, \qquad
L_{\mathrm{CE}} = -\sum_{i} y_i \log \hat{y}_i
$$

梯度下降沿负梯度方向迭代更新参数：

$$
\theta_{t+1} = \theta_t - \eta \nabla L(\theta_t)
$$

其中学习率 $\eta$ 是最重要的超参数之一：太大震荡发散，太小收敛缓慢。

### 以线性回归与逻辑回归为例

线性回归的最小二乘解有解析形式（正规方程），也可以用梯度下降迭代求解：

$$
\boldsymbol{w} = (X^\top X)^{-1} X^\top \boldsymbol{y}
$$

逻辑回归在线性输出上套一层 Sigmoid，把分数压到 (0,1) 作为概率：

$$
P(y=1 \mid \boldsymbol{x}) = \sigma(\boldsymbol{w}^\top \boldsymbol{x}) = \frac{1}{1 + e^{-\boldsymbol{w}^\top \boldsymbol{x}}}
$$

## 常用算法速览

| 算法 | 类型 | 一句话直觉 |
| ---- | ---- | ---------- |
| 线性回归 | 监督 / 回归 | 拟合一条直线或超平面 |
| 逻辑回归 | 监督 / 分类 | 线性模型 + Sigmoid 输出概率 |
| 决策树 | 监督 | 一连串 if-else，可解释性强 |
| SVM | 监督 | 找间隔最大的分类边界 |
| K-Means | 无监督 | 迭代地把样本分给最近的簇中心 |
| PCA | 无监督 | 投影到方差最大的方向实现降维 |

## 关键概念

### 过拟合与欠拟合

- **欠拟合**：训练误差与测试误差都高 → 模型容量不足，增加特征或模型复杂度；
- **过拟合**：训练误差低而测试误差高 → 正则化、早停、数据增强、交叉验证。

### 偏差—方差权衡

$$
\mathrm{Error} = \mathrm{Bias}^2 + \mathrm{Variance} + \mathrm{Noise}
$$

模型复杂度上升时，偏差下降、方差上升，最优点在中间。

### 正则化：L1 与 L2

| 维度 | L1（Lasso） | L2（Ridge） |
| ---- | ----------- | ----------- |
| 惩罚项 | 权重绝对值之和 | 权重平方和 |
| 效果 | 倾向产生稀疏解，可做特征选择 | 权重整体变小，模型更平滑 |

## 评估指标

$$
\mathrm{Precision} = \frac{TP}{TP + FP}, \qquad
\mathrm{Recall} = \frac{TP}{TP + FN}, \qquad
F_1 = \frac{2PR}{P + R}
$$

- 分类问题看精确率 / 召回率 / F1，类别不平衡时准确率会"失真"；
- 回归问题常用 MSE、MAE、$R^2$；
- 排序与检索场景关注 ROC 曲线与 AUC。

## 模型选择：交叉验证

K 折交叉验证把训练集分成 K 份，轮流用其中 1 份做验证、其余 K-1 份做训练，取 K 次评估的平均值。它既充分利用了数据，又降低了单次划分带来的偶然性。

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(clf, X, y, cv=5)   # 5 折交叉验证
print(scores.mean().round(3))               # 各折准确率均值 ~0.96
```

!!! note "分层抽样"

    类别不平衡时使用分层 K 折（StratifiedKFold），保证每折的类别比例与整体一致，避免某一折几乎全是多数类。

## 最小工作示例

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)

clf = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
print(accuracy_score(y_te, clf.predict(X_te)))  # ~0.97
```

!!! warning "常见误区"

    评估指标要在**测试集**上看；把全量数据先归一化再划分会造成数据泄漏——测试集的统计信息"渗入"了训练过程。正确做法是只在训练集上 `fit`，再对测试集做同样的 `transform`。

## 实践要点

1. 先建立基线（如逻辑回归），再逐步换复杂模型，避免一上来就用大模型；
2. 任何预处理（归一化、缺失值填充）都只在训练集上学习参数；
3. 类别不平衡时看 F1 / AUC，别只看准确率；
4. 调参用交叉验证配合网格 / 随机搜索，避免在单一验证集上过拟合；
5. 记录每次实验的数据版本、超参数与指标，保证结果可复现。
