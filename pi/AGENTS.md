# Repository Instructions — 学科：pi

## 工作区

- 本学科工作区：本目录 `pi/`。所有课程内容都在这里：`lessons/`、`reference/`、`learning-records/`、`learning-qa/`、`exercises/`、`MISSION.md`、`RESOURCES.md`、`NOTES.md`、`LEARNING_PATH.md`、`assets/`。
- 本机路径**不写死**：开工前读仓库根 `machine.config.json`（缺则读 `machine.config.example.json` 并让用户复制填写）。用其中的 `repoRoot`（仓库根）与 `piSourceRoot`（本机 pi monorepo）。
- git 由用户自理，不代跑发布 / 提交。

## 单一主线（阶段 0–15）

`LEARNING_PATH.md` 是一条合并主线：阶段 0–1 先用熟（发布包 / 用户主流程）→ 阶段 2 最小循环与工具失败（第一次读 `packages/agent`）→ 阶段 3–14 依次学配置、Extension、事件、安全、会话、TUI、SDK、RPC、Provider、复杂示例 → 阶段 15 手搓 agent 毕业任务（≤150 行 CLI agent）。「二次开发」与「手搓」不分行，扩展知识每学一块就回到循环看它落在哪一点。

## 考核流程（主线）

1. 读 `LEARNING_PATH.md` 定位当前文件；读 `learning-qa/` 对应文件恢复历史。
2. 用户读完文件后，在对话里出 3 题（概念 / 执行流程 / 最小修改）；用户作答后写入 `learning-qa/` 对应 Markdown。
3. 逐题批改、解释错误；有薄弱点追加 2 道强化题（只练薄弱点）。
4. 全对才收口：更新该文件的「状态」与 `LEARNING_PATH.md` 复选框。
5. 用户主动要答案（未学先问）：给答案 + 讲解，但状态记「未考核」，后续换问法复测、混入不预告。**默认做法（2026-10-03）：标准答案 + 讲解直接写进 `learning-qa/`，状态记「未考核（教师直接给答案）」，不等用户逐题作答**；用户有空看。
6. 推理类题目显式要求「给出判断过程」；用户整段粘贴原文或教师批改原文时按正确记但视为「待复测」。
7. 每篇先挑出**核心部分**重点讲，再只对核心出题考核（概念 + 判断链）；安装方式、目录、快捷键这类操作性细节不出题（2026-10-03）。

## 教学呈现（视觉优先，高知识密度）

- 课程**能用图讲就不堆字**：优先内联 SVG、CSS/JS 动画、可交互组件；用视觉承载信息，而不是靠加长文字。
- 复用 `assets/`（`course.css`、`quiz.js`、`loop-stepper.js`、`workspace-links.js`）；新出现的可复用可视化沉到 `assets/`，禁止内联复制。
- 每课仍只求一个「可带走的收获」，用图/动画讲透，难度留在最近发展区。
- **验收尺子（10 分钟）**：读者能否在 10 分钟内 ① 说清本课内容 ② 带走一个明确收获 ③ 核心知识点不漏。交付前自查这三条。

## 链接约定（重要）

- 课程 HTML 指向 pi 源码的链接：写 **GitHub 地址 + `data-pi="<仓库内相对路径>"`**，不写本机绝对路径；页面由 `assets/workspace-links.js` 依据仓库根 `workspace.config.js` 的 `piSourceRoot` 改写成 `file:///`。
- Markdown 文档里直接用 GitHub 链接（`https://github.com/earendil-works/pi/blob/main/<path>`，目录用 `/tree/main/`）。
- `workspace.config.js` 与 `machine.config.json` 都已 gitignore、每机一份；两者的 `piSourceRoot` 必须一致。

## 源码版本（会持续迭代）

课程里记的版本只是当时快照。继续任何主题前，用 `machine.config.json.piSourceRoot` **现读源码实际版本**（如 `packages/coding-agent/package.json` 的 `version`），再决定是否更新记录 / 课程，不要假设仍是旧版。记录里写的是 `0.82.1`；**本机现为 `1.1.0`**（HEAD `ea448f454`，2026-10-10）。更新后扫 `CHANGELOG.md` 的 Changed/Breaking 判断对课程的影响。

## Current checkpoint

- 已收口：`package.json`、`README.md`、`examples/README.md`（2026-09-11~15）。
- 已收口：`docs/index.md`、`docs/quickstart.md`、`docs/usage.md`（2026-10-03；usage 核心考点=三种介入方式，术语名列间隔复测）。
- 未考核（知识点/答案已给）：`CHANGELOG.md`、`docs/providers.md`、`docs/models.md`、`docs/settings.md`、`docs/keybindings.md`、`docs/sessions.md`、`docs/compaction.md`、`docs/security.md`。
- 阶段 1（作为用户掌握主流程）已覆盖；**阶段 2 进行中**：`packages/agent/README.md`（`lessons/0010`）与 `agent-loop.ts` 的 `runLoop()`（`lessons/0016`）课与中英对照已给；下一步做 `exercises/0001-agent-loop.mjs` 并回到 `reference/glossary.html` 收词。
- 路线：2026-09-20 已合并为单一主线（阶段 0–15），见 `LEARNING_PATH.md` 与 `learning-records/0008`。
