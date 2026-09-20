# Repository Instructions

## 工作区

- 学习仓库根：`F:/lessons-study`（git 由用户自理，不代跑发布/提交）。
- **本学科工作区：`F:/lessons-study/pi/`**。所有课程内容都在这里：`lessons/`、`reference/`、`learning-records/`、`learning-qa/`、`exercises/`、`MISSION.md`、`RESOURCES.md`、`NOTES.md`、`LEARNING_PATH.md`。
- 源码仓库本体：`F:/ai-project/pi`（完整 monorepo，`packages/coding-agent` = Pi 0.82.1，含 `src/`；`packages/agent` 供阶段 2/15 的手搓内容）。

## 单一主线（阶段 0–15）

`LEARNING_PATH.md` 是一条合并主线：阶段 0–1 先用熟（发布包/用户主流程）→ 阶段 2 最小循环与工具失败（第一次读 `packages/agent`）→ 阶段 3–14 依次学配置、Extension、事件、安全、会话、TUI、SDK、RPC、Provider、复杂示例 → 阶段 15 手搓 agent 毕业任务（≤150 行 CLI agent）。「二次开发」与「手搓」不再分行，扩展知识每学一块就回到循环看它落在哪一点。

## 考核流程（主线）

1. 读 `LEARNING_PATH.md` 定位当前文件；读 `learning-qa/` 对应文件恢复历史。
2. 用户读完文件后，在对话里出 3 题（概念 / 执行流程 / 最小修改）；用户作答后写入 `learning-qa/` 对应 Markdown。
3. 逐题批改、解释错误；有薄弱点追加 2 道强化题（只练薄弱点）。
4. 全对才收口：更新该文件的「状态」与 `LEARNING_PATH.md` 复选框。
5. 用户主动要答案（未学先问）：给答案 + 讲解，但状态记「未考核」，后续换问法复测、混入不预告。
6. 推理类题目显式要求「给出判断过程」；用户整段粘贴原文或教师批改原文时按正确记但视为「待复测」。

## 链接约定（重要）

- 课程 HTML 指向 pi 源码的链接：写 **GitHub 地址 + `data-pi="<仓库内相对路径>"`**，不写本机绝对路径；页面由 `assets/workspace-links.js` 依据仓库根 `workspace.config.js`（当前 `piSourceRoot = "F:/ai-project/pi"`）改写成 `file:///` 本地链接。
- Markdown 文档里直接用 GitHub 链接（`https://github.com/earendil-works/pi/blob/main/<path>`，目录用 `/tree/main/`）。
- `workspace.config.js` 已被仓库 `.gitignore` 忽略；换机器时复制 `workspace.config.example.js` 改路径。

## Current checkpoint

- 已收口：`package.json`、`README.md`、`examples/README.md`（均 2026-09-11~15）。
- 未考核：`CHANGELOG.md`（2026-09-15 直接给答案，复测待做，混入后续 QA 不预告）。
- 待作答：`docs/index.md` 第一轮问题已出（`learning-qa/docs-index.md`），用户尚未作答。
- 路线：2026-09-20 已合并为单一主线（阶段 0–15），见 `LEARNING_PATH.md` 与 `learning-records/0008`。