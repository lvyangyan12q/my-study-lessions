# 源码漂移评估：deepseek-harness 0.1.6-alpha.2 → 0.2.1-rc.2

2026-10-18，随 pi 一并在「仓库都更新了，课程是否需要更新」的问题上复核本学科。

## 现状

- 评估起点：课程基线 `0.1.6-alpha.2`（`ddefc45fbc`，2026-09-20）。复核完成后基线已上移到 HEAD（见文末）。
- 当时 HEAD `687f282e8`（`0.2.1-rc.2`，2026-10-17）。运行现成工具：

```bash
node ./deepseek-harness/tools/check-source.mjs
```

初评结果（上移前）：**基线文件 29 个中 21 个哈希已变，5 个关注主题全部命中，已提交变化 658 项**。

## 第 1 课（`lessons/0001-agent-cycle.html`）结论

**主叙事在 HEAD 仍成立，无需重写。** 第 1 课依赖的 `agent.ts`、`session/src/index.ts`、`architecture.md` 均有改动，但核心机制未变：turn=零或多个 step、`deriveMessages()` 仍是模型历史的唯一来源、重试不重复组装、结束条件集合未变。

逐句复核后：**第 1 课正文不需要改**。初评时疑为失效的两处，对照提交后的实际文本后都成立：

1. §4 的原句是「**设计要求是**：影响模型请求的输入必须能从日志重建」，与 HEAD `docs/architecture.md` 的 "Model-visible means logged. Every model request must be reconstructable from the log." 一致；课文**没有**写成「由运行时不变量保证」。运行时不变量机制（`*/src/invariant.ts`、`runtime-diagnostics/invariants`）确已整仓删除，但课文措辞本就落在「设计要求」一侧，故不受影响。
2. §2 的省略说明是「这里省略 `system`、`request/header`、`request/context` 等事件」，未声称穷尽；新增的 `developer/message`（工具注册表增删，见 `packages/core/agent-loop/src/agent.ts`）与 `tool/result` 的模型角色由 `user` 改 `tool`（`packages/core/session/src/index.ts` 的 `'tool/result': 'tool'`），都不与课文冲突，属可选补充而非纠错。

唯一真实漂移是**行号与版本标注**：课文源码链接固定指向基线提交 `ddefc45fbc`，其中带行号的三个锚点在 HEAD 已移位——`turn()` `agent.ts:270`→`298`、`step()` `agent.ts:353`→`400`、`deriveMessages()` `session/src/index.ts:841`→`984`（文档锚点 `#turn-flow`、`#session-log`、`#where-new-behavior-goes` 仍有效）。这些 URL 指向固定提交，眼下仍解析到基线行，是否改指 HEAD 属取舍，不影响课文正确性。

`docs/user/develop/basic/tool.md` 未变（基线至 HEAD 同一 blob），§3 引用的来源链接仍有效。

## 状态与下一步

- **课程正文一行未改**：复核结论是第 1 课无需修改（上面「两处」经逐句对照后确认成立）。
- `SOURCE_BASELINE.json` 已随本次复核上移到 HEAD `687f282e8`（`0.2.1-rc.2`），并经现成工具重算全部 29 个文件哈希；`UPDATES.md` 同步。

Evidence: `tools/check-source.mjs` 输出；`git diff ddefc45fbc..HEAD` 对 `agent.ts`/`session/src/index.ts`/`architecture.md` 的语义 diff。

Implications: 第 1 课的「不变量」表述是个典型——架构文档的措辞变化（断言→设计要求）会静默改变一个句子的真假。修订时保留「故事骨架不变、只改具体断言」的分寸，正好呼应 `UPDATES.md` 的「稳定学习目标是职责关系」。
