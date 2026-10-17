# 模型服务简介

模型服务把训练好的权重变成**稳定、低延迟、高吞吐**的在线 API。它是模型能力与用户之间的最后一公里：训练侧千辛万苦换来的能力提升，若没有服务侧的支撑，就到不了产品里。

## 内容导航

- [推理优化](inference-optimization.md) —— Prefill/Decode、KV Cache、PagedAttention、量化与投机解码

## 服务质量的四把尺子

| 指标 | 含义 | 优化方向 |
| ---- | ---- | -------- |
| TTFT | 首 Token 延迟 | Prefill 加速、Prefix Caching |
| TPOT | 每 Token 延迟 | Decode 优化、投机采样 |
| Throughput | 整机吞吐 | Continuous Batching |
| Cost | 单位请求成本 | 量化、弹性伸缩 |

## 一次请求的生命周期

```mermaid
flowchart LR
    R[请求到达] --> Q[排队调度] --> P[Prefill<br>处理提示词] --> D[Decode<br>逐 Token 生成] --> S[流式返回]
```

TTFT 与 TPOT 分别由 Prefill、Decode 主导，优化策略要分阶段对症下药——这也是[推理优化](inference-optimization.md)全篇的编排主线。

## 推理与训练的本质区别

!!! abstract "推理侧的独特约束"

    - 训练求"一次前向的并行"，推理是"逐 Token 的串行生成"；
    - 显存瓶颈从权重转移到 **KV Cache**；
    - 关键指标从"算得多快"变成"单位显存塞下多少并发请求"；
    - 调度粒度从"批"细化到"Decode 迭代步"。

!!! tip "三种部署形态"

    - **云 API**：托管服务开箱即用，成本与定制受限；
    - **自建推理**：vLLM / SGLang 等框架 + GPU，可控可优化，是技术团队的主流选择；
    - **端侧部署**：llama.cpp / Ollama，隐私友好，算力受限。
