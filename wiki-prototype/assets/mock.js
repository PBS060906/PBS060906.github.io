/* 斟知原型 · 数据单源（导航树 + 搜索索引 + 页序）
   与 MkDocs 源站（wiki/docs）结构 1:1 对齐，共 35 页。
   搜索说明：local 模式纯前端过滤；remote / supabase 模式见 assets/api.js 与 contract/。 */

window.MD_NAV = {
  site: "斟知",
  repo: "https://github.com/PBS060906",
  copyright: "© 2026 斟知 · 个人知识库",
  sections: [
    { key: "home", label: "首页", url: "index.html", tree: null },
    {
      key: "base", label: "基础知识", url: "base/index.html",
      tree: {
        label: "基础知识", url: "base/index.html", children: [
          { label: "人工智能基础", url: null, children: [
            { label: "Python 编程", url: null, children: [
              { label: "Python 编程专栏简介", url: "base/ai/python/index.html", children: null },
              { label: "语法基础", url: "base/ai/python/grammar.html", children: null },
              { label: "常用标准库", url: "base/ai/python/std-lib.html", children: null }
            ]},
            { label: "机器学习", url: "base/ai/machine-learning.html", children: null },
            { label: "深度学习", url: "base/ai/deep-learning.html", children: null }
          ]},
          { label: "计算机科学基础", url: null, children: [
            { label: "操作系统", url: "base/cs/operating-system.html", children: null },
            { label: "计算机网络", url: "base/cs/computer-network.html", children: null }
          ]},
          { label: "数学基础", url: null, children: [
            { label: "高等数学", url: "base/math/advanced-math.html", children: null },
            { label: "线性代数", url: "base/math/linear-algebra.html", children: null }
          ]}
        ]
      }
    },
    {
      key: "ds-and-algo", label: "数据结构与算法", url: "ds-and-algo/index.html",
      tree: {
        label: "数据结构与算法", url: "ds-and-algo/index.html", children: [
          { label: "代码模板 (C++)", url: "ds-and-algo/templates.html", children: null },
          { label: "专题解析", url: null, children: [
            { label: "动态规划", url: "ds-and-algo/topic/dp.html", children: null },
            { label: "图论", url: "ds-and-algo/topic/graph.html", children: null }
          ]}
        ]
      }
    },
    {
      key: "develop", label: "软件开发", url: "develop/index.html",
      tree: {
        label: "软件开发", url: "develop/index.html", children: [
          { label: "前端", url: null, children: [
            { label: "前端专栏简介", url: "develop/frontend/index.html", children: null },
            { label: "HTML", url: "develop/frontend/html.html", children: null },
            { label: "CSS", url: "develop/frontend/css.html", children: null },
            { label: "JavaScript", url: "develop/frontend/javascript.html", children: null }
          ]},
          { label: "后端", url: null, children: [
            { label: "后端专栏简介", url: "develop/backend/index.html", children: null },
            { label: "Python 后端实践", url: "develop/backend/python.html", children: null }
          ]},
          { label: "运维", url: null, children: [
            { label: "运维专栏简介", url: "develop/operation/index.html", children: null },
            { label: "Git", url: "develop/operation/git.html", children: null },
            { label: "Docker", url: "develop/operation/docker.html", children: null }
          ]}
        ]
      }
    },
    {
      key: "llm", label: "大模型", url: "llm/index.html",
      tree: {
        label: "大模型", url: "llm/index.html", children: [
          { label: "模型开发", url: null, children: [
            { label: "模型开发简介", url: "llm/development/index.html", children: null },
            { label: "Transformer", url: "llm/development/transformer.html", children: null },
            { label: "训练阶段", url: "llm/development/training-stages.html", children: null }
          ]},
          { label: "模型服务", url: null, children: [
            { label: "模型服务简介", url: "llm/serving/index.html", children: null },
            { label: "推理优化", url: "llm/serving/inference-optimization.html", children: null }
          ]},
          { label: "模型应用", url: null, children: [
            { label: "模型应用简介", url: "llm/application/index.html", children: null },
            { label: "RAG", url: "llm/application/rag.html", children: null },
            { label: "Agent", url: "llm/application/agent.html", children: null }
          ]}
        ]
      }
    },
    { key: "contributing", label: "参与贡献", url: "contributing/index.html", tree: null }
  ]
};

/* 线性页序（prev/next 与搜索结果排序用），共 35 页 */
window.MD_ORDER = [
  { page: "index", label: "首页", section: "首页", url: "index.html" },
  { page: "base/index", label: "基础知识专栏简介", section: "基础知识", url: "base/index.html" },
  { page: "base/ai/python/index", label: "Python 编程专栏简介", section: "基础知识", url: "base/ai/python/index.html" },
  { page: "base/ai/python/grammar", label: "语法基础", section: "基础知识", url: "base/ai/python/grammar.html" },
  { page: "base/ai/python/std-lib", label: "常用标准库", section: "基础知识", url: "base/ai/python/std-lib.html" },
  { page: "base/ai/machine-learning", label: "机器学习", section: "基础知识", url: "base/ai/machine-learning.html" },
  { page: "base/ai/deep-learning", label: "深度学习", section: "基础知识", url: "base/ai/deep-learning.html" },
  { page: "base/cs/operating-system", label: "操作系统", section: "基础知识", url: "base/cs/operating-system.html" },
  { page: "base/cs/computer-network", label: "计算机网络", section: "基础知识", url: "base/cs/computer-network.html" },
  { page: "base/math/advanced-math", label: "高等数学", section: "基础知识", url: "base/math/advanced-math.html" },
  { page: "base/math/linear-algebra", label: "线性代数", section: "基础知识", url: "base/math/linear-algebra.html" },
  { page: "ds-and-algo/index", label: "数据结构与算法专栏简介", section: "数据结构与算法", url: "ds-and-algo/index.html" },
  { page: "ds-and-algo/templates", label: "代码模板 (C++)", section: "数据结构与算法", url: "ds-and-algo/templates.html" },
  { page: "ds-and-algo/topic/dp", label: "动态规划", section: "数据结构与算法", url: "ds-and-algo/topic/dp.html" },
  { page: "ds-and-algo/topic/graph", label: "图论", section: "数据结构与算法", url: "ds-and-algo/topic/graph.html" },
  { page: "develop/index", label: "软件开发专栏简介", section: "软件开发", url: "develop/index.html" },
  { page: "develop/frontend/index", label: "前端专栏简介", section: "软件开发", url: "develop/frontend/index.html" },
  { page: "develop/frontend/html", label: "HTML", section: "软件开发", url: "develop/frontend/html.html" },
  { page: "develop/frontend/css", label: "CSS", section: "软件开发", url: "develop/frontend/css.html" },
  { page: "develop/frontend/javascript", label: "JavaScript", section: "软件开发", url: "develop/frontend/javascript.html" },
  { page: "develop/backend/index", label: "后端专栏简介", section: "软件开发", url: "develop/backend/index.html" },
  { page: "develop/backend/python", label: "Python 后端实践", section: "软件开发", url: "develop/backend/python.html" },
  { page: "develop/operation/index", label: "运维专栏简介", section: "软件开发", url: "develop/operation/index.html" },
  { page: "develop/operation/git", label: "Git", section: "软件开发", url: "develop/operation/git.html" },
  { page: "develop/operation/docker", label: "Docker", section: "软件开发", url: "develop/operation/docker.html" },
  { page: "llm/index", label: "大模型专栏简介", section: "大模型", url: "llm/index.html" },
  { page: "llm/development/index", label: "模型开发简介", section: "大模型", url: "llm/development/index.html" },
  { page: "llm/development/transformer", label: "Transformer", section: "大模型", url: "llm/development/transformer.html" },
  { page: "llm/development/training-stages", label: "训练阶段", section: "大模型", url: "llm/development/training-stages.html" },
  { page: "llm/serving/index", label: "模型服务简介", section: "大模型", url: "llm/serving/index.html" },
  { page: "llm/serving/inference-optimization", label: "推理优化", section: "大模型", url: "llm/serving/inference-optimization.html" },
  { page: "llm/application/index", label: "模型应用简介", section: "大模型", url: "llm/application/index.html" },
  { page: "llm/application/rag", label: "RAG", section: "大模型", url: "llm/application/rag.html" },
  { page: "llm/application/agent", label: "Agent", section: "大模型", url: "llm/application/agent.html" },
  { page: "contributing/index", label: "参与贡献", section: "参与贡献", url: "contributing/index.html" }
];

window.MD_SEARCH = [
  { title: "首页", section: "首页", url: "index.html", excerpt: "一个围绕计算机与人工智能的个人知识库：基础知识、数据结构与算法、软件开发、大模型四大板块。" },
  { title: "基础知识专栏简介", section: "基础知识", url: "base/index.html", excerpt: "收录计算机与人工智能领域最底层的通用知识：人工智能基础、计算机科学基础、数学基础。" },
  { title: "Python 编程专栏简介", section: "基础知识", url: "base/ai/python/index.html", excerpt: "Python 学习路径与环境搭建：uv 虚拟环境、Jupyter 与脚本分工、版本选择建议，导航至语法基础与常用标准库。" },
  { title: "语法基础", section: "基础知识", url: "base/ai/python/grammar.html", excerpt: "Python 核心语法：动态类型与对象绑定、可变不可变、is 与 ==、控制流与解包、默认参数陷阱、推导式生成器、类与 dataclass、EAFP 异常。" },
  { title: "常用标准库", section: "基础知识", url: "base/ai/python/std-lib.html", excerpt: "Python 标准库：collections 计数与双端队列、itertools 惰性迭代、heapq 堆与 Top-K、pathlib 路径、functools 缓存、json、re、logging。" },
  { title: "机器学习", section: "基础知识", url: "base/ai/machine-learning.html", excerpt: "机器学习入门：监督无监督强化学习、训练工作流、MSE 与交叉熵、梯度下降、正规方程、过拟合欠拟合、偏差方差、L1L2 正则、F1、交叉验证。" },
  { title: "深度学习", section: "基础知识", url: "base/ai/deep-learning.html", excerpt: "深度学习基础：神经元与 MLP、激活函数 Sigmoid ReLU GELU、Softmax、前向反向传播链式法则、SGD Adam、CNN RNN Transformer、注意力、Dropout、BatchNorm。" },
  { title: "操作系统", section: "基础知识", url: "base/cs/operating-system.html", excerpt: "操作系统核心：用户态内核态与系统调用、进程线程对比、上下文切换、调度算法、死锁四条件、生产者消费者信号量、虚拟内存页表 TLB、缺页中断、inode、epoll。" },
  { title: "计算机网络", section: "基础知识", url: "base/cs/computer-network.html", excerpt: "计算机网络：TCP/IP 分层、TCP 可靠传输流量控制拥塞控制、三次握手四次挥手、TIME_WAIT、DNS 解析、HTTP 报文状态码、HTTPS TLS、版本演进、排查命令。" },
  { title: "高等数学", section: "基础知识", url: "base/math/advanced-math.html", excerpt: "高等数学：导数与求导法则、链式法则与反向传播、泰勒公式与牛顿法、积分与牛顿莱布尼茨、几何级数、梯度 Hessian 极值、拉格朗日乘数法、凸函数优化。" },
  { title: "线性代数", section: "基础知识", url: "base/math/linear-algebra.html", excerpt: "线性代数：向量点积范数与余弦相似度、矩阵即线性映射、行列式秩特征值正定性、核与像、特征分解与 SVD、PCA、矩阵微积分、NumPy 运算速查。" },
  { title: "数据结构与算法专栏简介", section: "数据结构与算法", url: "ds-and-algo/index.html", excerpt: "面向算法竞赛与面试：代码模板、动态规划与图论专题解析，三遍学习法。" },
  { title: "代码模板 (C++)", section: "数据结构与算法", url: "ds-and-algo/templates.html", excerpt: "C++ 竞赛模板：快速排序、二分查找左右边界、前缀和与差分、单调栈、单调队列、Dijkstra 堆优化、并查集路径压缩、快速 IO、复杂度与边界陷阱。" },
  { title: "动态规划", section: "数据结构与算法", url: "ds-and-algo/topic/dp.html", excerpt: "动态规划状态定义与转移方程：LIS 二分优化、LCS、0-1 完全分组背包、区间 DP 石子合并、树形 DP、记忆化搜索、滚动数组、单调队列优化、经典例题模型。" },
  { title: "图论", section: "数据结构与算法", url: "ds-and-algo/topic/graph.html", excerpt: "图论邻接表与邻接矩阵、BFS 遍历、DFS 连通块、Dijkstra、SPFA、Bellman-Ford、Floyd 最短路、拓扑排序判环、DAG 最长路、二分图染色、Kruskal 最小生成树。" },
  { title: "软件开发专栏简介", section: "软件开发", url: "develop/index.html", excerpt: "工程实践中的工具链与最佳实践：前端三件套、后端服务、运维基础设施。" },
  { title: "前端专栏简介", section: "软件开发", url: "develop/frontend/index.html", excerpt: "前端导读：HTML/CSS/JavaScript 三件套职责、DOM 交汇、学习路线与工程化建议、DevTools 调试、MDN 查阅、框架学习时机。" },
  { title: "HTML", section: "软件开发", url: "develop/frontend/html.html", excerpt: "HTML 语义化标签、文档骨架与 head 配置、全局属性、链接图片 alt、块级行内元素、表格与列表、表单 label 与原生校验、下拉多行、注释与字符转义。" },
  { title: "CSS", section: "软件开发", url: "develop/frontend/css.html", excerpt: "CSS 盒模型 border-box、选择器优先级、层叠与继承、常用单位 rem vw、Flexbox 一维布局、Grid 二维布局、水平垂直居中、position 定位、伪类伪元素、CSS 变量、响应式媒体查询。" },
  { title: "JavaScript", section: "软件开发", url: "develop/frontend/javascript.html", excerpt: "JavaScript 变量 const 与原始类型、严格相等、对象与引用、闭包、解构展开、事件循环宏任务微任务、Promise 与 async await、数组 map filter reduce、类私有字段、DOM 操作与事件委托。" },
  { title: "后端专栏简介", section: "软件开发", url: "develop/backend/index.html", excerpt: "后端架构：分层设计 Controller Service DAO、数据库、缓存异步水平扩展、设计原则。" },
  { title: "Python 后端实践", section: "软件开发", url: "develop/backend/python.html", excerpt: "Python 后端：FastAPI、Django Flask 选型、WSGI ASGI、Gunicorn Uvicorn、venv Poetry uv 依赖管理、GIL asyncio 并发、部署。" },
  { title: "运维专栏简介", section: "软件开发", url: "develop/operation/index.html", excerpt: "运维稳定性：监控冗余演练、可观测性、故障恢复闭环、Git Docker 导航。" },
  { title: "Git", section: "软件开发", url: "develop/operation/git.html", excerpt: "分布式版本控制：工作区暂存区版本库、分支 merge rebase、reset revert reflog 后悔药、stash、冲突解决 force-with-lease。" },
  { title: "Docker", section: "软件开发", url: "develop/operation/docker.html", excerpt: "容器化：镜像分层写时复制、Dockerfile 指令、多阶段构建、数据卷网络模式、Docker Compose、运维命令。" },
  { title: "大模型专栏简介", section: "大模型", url: "llm/index.html", excerpt: "大语言模型开发、服务与应用全链路：架构训练评测、推理部署、RAG 与 Agent。" },
  { title: "模型开发简介", section: "大模型", url: "llm/development/index.html", excerpt: "模型开发：架构、数据、训练、评测，Scaling Laws、Transformer、预训练、SFT、RLHF、DPO。" },
  { title: "Transformer", section: "大模型", url: "llm/development/transformer.html", excerpt: "Transformer：自注意力、RoPE 位置编码、RMSNorm、SwiGLU、GQA、MLA、MoE、FlashAttention、长上下文、因果掩码、KV Cache 显存估算、Scaling Law。" },
  { title: "训练阶段", section: "大模型", url: "llm/development/training-stages.html", excerpt: "训练阶段：预训练、数据工程、SFT、RLHF、PPO、DPO、奖励模型、RLVR、GRPO、loss mask、评测基准、Scaling Law。" },
  { title: "模型服务简介", section: "大模型", url: "llm/serving/index.html", excerpt: "模型服务：TTFT、TPOT、吞吐量、Prefill、Decode、部署形态、推理与训练区别、请求生命周期。" },
  { title: "推理优化", section: "大模型", url: "llm/serving/inference-optimization.html", excerpt: "推理优化：KV Cache、PagedAttention、continuous batching、量化 GPTQ、AWQ、投机解码、Prefix Caching、chunked prefill、PD 分离、vLLM。" },
  { title: "模型应用简介", section: "大模型", url: "llm/application/index.html", excerpt: "模型应用：Chatbot、Copilot、Agent、RAG、提示词工程、上下文工程、工具调用、多智能体、范式选型。" },
  { title: "RAG", section: "大模型", url: "llm/application/rag.html", excerpt: "RAG：chunking 切分、embedding、向量库、混合检索、BM25、RRF、Reranker、RAGAS 评估、幻觉缓解、HyDE、GraphRAG。" },
  { title: "Agent", section: "大模型", url: "llm/application/agent.html", excerpt: "Agent：ReAct 循环、function calling 工具调用、多 Agent 协作、记忆机制、上下文工程、提示注入、沙箱、评测。" },
  { title: "参与贡献", section: "参与贡献", url: "contributing/index.html", excerpt: "贡献指南：Issue PR 工作流、mkdocs serve 本地预览、Conventional Commits、写作规范与致谢。" }
];