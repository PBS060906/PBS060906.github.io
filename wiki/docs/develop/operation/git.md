# Git

Git 是分布式版本控制系统。理解其**三层区域**（工作区 → 暂存区 → 版本库）后，一切命令都能推出来——每条命令本质上都在这些区域之间搬运数据。

## 核心概念：三层区域

```mermaid
flowchart LR
    W[工作区] -- git add --> I[暂存区]
    I -- git commit --> R[版本库]
    R -- git push --> RM[远程仓库]
```

| 区域 | 本质 | 查看差异的命令 |
| ---- | ---- | ---- |
| 工作区 | 磁盘上正在编辑的文件 | `git diff`（工作区 vs 暂存区） |
| 暂存区 | 下一次提交的快照清单 | `git diff --staged`（暂存区 vs HEAD） |
| 版本库 | `.git` 目录里的提交历史 | `git diff HEAD`（工作区 vs 最新提交） |

`git status` 一次展示三层差异：未暂存的修改、已暂存待提交的内容、本地领先 / 落后远程的提交数。

## 日常命令速查

| 场景 | 命令 |
| ---- | ---- |
| 克隆仓库 | `git clone <url>` |
| 查看状态 | `git status` / `git diff` |
| 暂存与提交 | `git add -p` → `git commit -m "msg"` |
| 拉取更新 | `git pull --rebase` |
| 推送 | `git push origin main` |
| 撤销工作区修改 | `git restore <file>` |
| 回退提交 | `git reset --soft HEAD~1` |
| 查看历史 | `git log --oneline --graph` |

`git add -p` 按代码块（hunk）交互式暂存，是把一次大改动拆成多个干净提交的利器。

## 分支操作

```bash
git switch -c feature/demo   # 创建并切换（老写法 git checkout -b）
git merge feature/demo       # 合并（保留分叉历史）
git rebase main              # 变基（线性历史）
git branch -d feature/demo   # 删除已合并的分支
git push origin --delete feature/demo  # 删除远程分支
```

`merge` 与 `rebase` 都能整合历史，差别在于是否改写提交：

| 方式 | 历史 | 适用 |
| ---- | ---- | ---- |
| `merge` | 产生合并提交，保留真实分叉 | 共享分支整合 |
| `rebase` | 把提交搬到新基底，线性整洁 | 个人分支同步主干 |

!!! question "merge 还是 rebase"

    团队约定优先：共享分支用 merge 保平安，个人分支合入主干前 rebase 求整洁。**绝不 rebase 已推送的公共分支**——rebase 会改写提交哈希，等于给协作者埋雷。

## 后悔药：restore / reset / revert / reflog

按"提交是否已推送"选择撤销手段，这是避免误操作的第一原则：

=== "未推送：reset"

    `git reset` 移动分支指针，三种模式的回退范围不同：

    | 模式 | 暂存区 | 工作区 | 典型用途 |
    | ---- | ---- | ---- | ---- |
    | `--soft` | 保留 | 保留 | 只撤销 commit，重新组织提交 |
    | `--mixed`（默认） | 清空 | 保留 | 撤销 commit 与 add，重新暂存 |
    | `--hard` | 清空 | 丢弃 | 彻底丢弃本地修改（危险） |

    ```bash
    git reset --soft HEAD~1    # 撤销上一次提交，改动回到暂存区
    git reset --hard HEAD~1    # 连工作区一起回退，未提交改动会丢失
    ```

=== "已推送：revert"

    `git revert <commit>` 生成一个"反向提交"抵消目标改动，**不改写历史**，是公共分支上唯一安全的撤销方式：

    ```bash
    git revert abc1234            # 生成反向提交，抵消指定提交
    git revert -m 1 <merge-hash>  # 撤销一次 merge，保留主干侧
    ```

=== "找不到了：reflog"

    被 `reset --hard` 掉的提交并未立刻消失，引用日志记录了 HEAD 的每次移动：

    ```bash
    git reflog                   # 查看 HEAD 移动历史
    git reset --hard HEAD@{2}    # 回到两次操作之前的位置
    ```

    reflog 默认保留 90 天，是 Git 的"本地后悔药"——但只救得了本地提交，已推送的历史请走 revert。

`git restore <file>` 只丢弃工作区中单个文件的修改；若改动已进暂存区，先 `git restore --staged <file>` 取出，再 restore。

## stash：临时存档

写到一半要切分支修线上问题，又不想为半成品造提交：

```bash
git stash push -m "登录页写到一半"  # 存档并清空工作区
git stash list                     # 查看存档列表
git stash pop                      # 恢复最近一次存档并删除记录
git stash apply stash@{1}          # 恢复指定存档，保留记录
git stash drop stash@{0}           # 删除指定存档
```

!!! warning "注意"

    stash 默认**不含未跟踪文件**，需要带上 `-u`；恢复时可能产生冲突，`pop` 失败不会丢记录，不确定就先 `apply`。

## 提交信息规范

```text
<type>(<scope>): <subject>

feat(auth): 支持手机号验证码登录
fix(api): 修复分页参数越界
docs: 补充部署说明
```

| type | 含义 | type | 含义 |
| ---- | ---- | ---- | ---- |
| feat | 新功能 | refactor | 重构（不改行为） |
| fix | 缺陷修复 | test | 测试 |
| docs | 文档 | chore | 构建、依赖等杂项 |

好的 subject 用祈使句、控制在 50 字符内，说清"做了什么"；为什么这么改，写在正文里。

## 远程协作与冲突解决

```bash
git fetch origin            # 只下载远程更新，不合并
git pull --rebase           # fetch + 变基整合，避免多余 merge 提交
git push origin main        # 推送
```

`pull = fetch + 整合`。推送被拒时先 `fetch` 看清远程发生了什么，再决定用 rebase 还是 merge 整合。

### 冲突解决标准流程

1. `git pull --rebase`（或 `git merge`）触发冲突，`git status` 列出双方都改过的文件；
2. 打开文件处理冲突标记：

```text
<<<<<<< HEAD
当前分支的内容
=======
传入分支的内容
>>>>>>> feature/demo
```

3. 逐个 `git add <file>` 标记已解决；rebase 场景用 `git rebase --continue` 推进；
4. 全部解决后正常提交。中途想放弃：`git rebase --abort` / `git merge --abort` 回到冲突前的状态。

!!! tip "推送保护"

    需要强推时用 `git push --force-with-lease` 代替 `--force`：远程若有你没见过的新提交，推送会被拒绝，避免覆盖同事的工作。

## 实践要点

1. 执行任何命令前，先想清楚它在三层区域之间搬运了什么；
2. 已推送的历史只能 revert，不能 reset；`reset --hard` 前记住 reflog 是最后兜底；
3. 共享分支用 merge，个人分支合主干前 rebase，绝不 rebase 已推送的公共分支；
4. 提交小而完整，信息遵循 Conventional Commits；
5. 推送被拒不慌张：fetch 看状态 → rebase / merge 整合 → 解决冲突 → `--force-with-lease` 兜底强推。
