# 主线提速：边缘基础下沉附录

2026-10-18，用户提出「想快些进入 pi 的真正的原理和代码阶段的学习，一些边缘的基础知识，就整理成附录文档，供我参考就行了」。经确认，范围取**阶段 1（用户文档）+ 阶段 14（平台维护）**，形态取**新建 HTML 速查页**。

## 为什么

- 阶段 1 的十篇用户文档、阶段 14 的九篇平台文档，都是「用户操作 / 环境维护」类，属边缘基础；它们此前与「读内核代码」的核心阶段并列，挡在通往 `packages/agent` 源码之前。
- 用户目标是尽快进入原理与代码；这些内容以**查阅**为主，不需要逐篇出课、逐篇考核。
- 但它们并非无用：安装认证、模型/凭据、会话/压缩、安全边界仍是日常要用的知识，所以**保留、下沉、给一处集中速查**，而不是删除。

## 动了什么

1. **新建** `pi/reference/appendix-user-basics.html`——「附录 · Pi 用户基础速查」。九个分节（安装与首次运行 / 运行模式与定制阶梯 / 文档地图 / 交互与介入 / 模型与 Provider / 配置与按键 / 会话与压缩 / 安全边界 / 平台与维护），每节 3–6 条要点 + 来源与深读链接。复用 `assets/course.css` 与 `workspace-links.js`（`data-pi` 链接约定），**只给浓缩要点、不复制课程正文**，深度仍留在原课 / 中英对照 / 问答页。
2. **重排** `pi/LEARNING_PATH.md`：
   - 顶部加「主线提速」说明；主线改为 **阶段 0 → 2 → 3 → … → 12 → 15**。
   - 原阶段 1、阶段 14 两整块移入文末新节「## 附录：用户基础与平台维护（按需查阅，不考核）」，条目与课号原样保留，指向速查页。
   - 学习与考核规则新增第 9 条：附录阶段不逐篇考核。
   - 顺手修两处：阶段 1 里重复的 `docs/models.md` 一行删除；顶部写死的本机路径 `F:/lessons-study/pi/`、`F:/ai-project/pi` 改为读 `machine.config.json`（符合「不写死本机绝对路径」硬规则）。
3. **补** `pi/RESOURCES.md`：为 settings / keybindings / sessions / security / compaction 等此前只有泛化「docs/ 目录」兜底的主题，补上具名来源（附录每条要点因此都可回溯）；同步「教学主线」段落的阶段范围。
4. 本条学习记录 + `NOTES.md` 追加一条决策。

## 一处顺带发现的漂移

原阶段 14 列的 `docs/development.md` 在当前源码仓库**已不存在**：查证 `git ls-files`（HEAD `482c1381a`）无此文件，`git log --diff-filter=D` 显示它随文档刷新提交 `25cc5c7bf`（2026-09-22）被移除；其内容并入仓库根 `AGENTS.md` 与 `CONTRIBUTING.md`（旧文件正文首句即「See AGENTS.md for additional guidelines」）。附录与 `LEARNING_PATH.md` 已改指真实文件，并标注此变更。

## 没有动什么

- 所有 `lessons/0001–0016`、`learning-qa/*`、`reference/` 既有页：**保持原样**，附录只链不打散；课号、编号一律不变。
- `MISSION.md`、`SOURCE_BASELINE.json`、`tools/`：未改。
- 源码基线不受影响（纯文档改动）。

## 后续（主线下一站 = 阶段 2）

按现成材料推进：`lessons/0003-agent-loop.html` → `exercises/0001-agent-loop.mjs` → `packages/agent/README.md`（课 `0010`）→ `agent-loop.ts` 的 `runLoop()`（课 `0016`）→ `lessons/0004-tool-failures.html` → `exercises/0002-tool-failures.mjs` → `reference/glossary.html`。

Evidence: `pi/LEARNING_PATH.md`（重排后）、`pi/reference/appendix-user-basics.html`（新建）、`pi/RESOURCES.md`、`learning-qa/*.md`；`docs/development.md` 的缺失由 `git ls-files` 与 `git log --diff-filter=D -- packages/coding-agent/docs/development.md` 于 pi HEAD `482c1381a` 验证。

Implications: 课程顺序应服务于「最近可达的硬核目标」，而非「知识的完备罗列」。把边缘知识从「必经」改为「可查」，是小成本换主线速度；但要有**一处**集中的去处（本页），否则下沉会变成散佚。
