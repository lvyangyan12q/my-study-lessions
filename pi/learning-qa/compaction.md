# `docs/compaction.md` 知识点（未考核）

> 2026-10-03 起，`docs/` 用户文档不再逐篇出课；这里直接给知识点与考点。源文件：`packages/coding-agent/docs/compaction.md`。**这篇是阶段 7 的地基，值得回看。**

## 一、两种摘要（别混）
| 机制 | 触发 | 目的 |
|---|---|---|
| Compaction | 上下文超阈值，或 `/compact` | 把旧消息摘要掉，腾出上下文 |
| Branch summarization | `/tree` 导航 | 换分支时保留你离开那条分支的上下文 |

两者都用相近的结构化格式、并累积记录文件操作。

## 二、触发与阈值
- 自动压缩条件：`contextTokens > contextWindow - reserveTokens`。
- 默认 `reserveTokens = 16384`（给模型回应留空间）、`keepRecentTokens = 20000`（保留不被摘要的近期 token）。
- 多轮运行中，Pi 在工具执行完、结果追加后、下一次 assistant 回应前检查；超阈值就在 `prepareNextTurn` 里压缩。

## 三、五步怎么做
1. **找切点**：从后往前累计 token，直到达到 `keepRecentTokens`。
2. **取消息**：从上一个保留边界（或会话起点）到切点。
3. **生成摘要**：调 LLM 用结构化格式；有上一次摘要就作为迭代上下文传入。
4. **追加条目**：写 `CompactionEntry`（含 `summary` 与 `firstKeptEntryId`）。
5. **重建上下文**：下一次请求 = 摘要 + 从 `firstKeptEntryId` 起的消息。

## 四、切点规则（最该记）
- 可在 **user 消息 / assistant 消息 / BashExecution / 自定义消息** 处切。
- **绝不在 tool 结果处切**——工具结果必须和它的工具调用待在一起。
- **原始条目全部保留**（压缩只是让它们不再发给模型）；重复压缩从上一次的 `firstKeptEntryId` 起。

## 五、摘要格式
Goal / Constraints & Preferences / Progress(Done·In Progress·Blocked) / Key Decisions / Next Steps /（compaction 另有 **Critical Context**）+ `<read-files>` / `<modified-files>`。
序列化时**工具结果截断到 2000 字符**（read/bash 常是上下文大户）。

## 六、扩展钩子
- `session_before_compact`：可取消或给自定义摘要（拿到 preparation）。
- `session_compact_failed`：压缩失败/中止时触发。
- `session_before_tree`：`/tree` 导航前触发。

## 七、设置
`compaction.enabled` / `reserveTokens` / `keepRecentTokens` / `modelOverrides`（每值独立回退：模型覆盖 → 普通 → 内置默认）。

## 考点（自查）
1. 为什么会有 compaction？（回到「模型无状态、每轮重发全部消息」）
2. 切点能不能落在 tool 结果上？为什么？
3. `firstKeptEntryId` 是干什么的？重复压缩时从哪里开始？
4. compaction 与 branch summarization 的触发和用途有何不同？
