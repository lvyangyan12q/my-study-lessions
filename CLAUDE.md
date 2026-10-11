# 仓库说明（给 AI Agent）

> 本文件与根目录 `AGENTS.md` 内容一致，两者同步维护；改一份就改另一份。

## 这是什么（先理解再动手）

- 这是一个 **Obsidian 知识库（vault）**，同时也是个人学习仓库。根目录即 vault 根。
- **每个学科 / 项目一个子目录**，子目录 = 一份独立的教学工作区。当前有 `pi/`、`deepseek-harness/`；**后续会不断加入新项目**。
- 新增学科时：新建一个子目录，按「学科目录约定」补齐文件即可；根目录说明一般无需改动（只在「当前学科」登记一行）。
- Obsidian 相关：课程是单文件 HTML（直接用浏览器打开），笔记是 Markdown；wikilink 写 `[[路径|显示文本]]`。`.obsidian/*.json` 是 Obsidian 自己写的界面状态，**不要**当成有意义的改动去评审或提交。

## 开工前：先读本机配置

本文件不写死任何本机路径。开始需要本机路径的操作前，**先读根目录 `machine.config.json`**：

- 存在 → 用其中的值：`repoRoot`、`piSourceRoot`、`deepseekSourceRoot`、`gitBashPath`、`gitRemote`、`branch`。
- 不存在 → 读 `machine.config.example.json`，提示用户复制为 `machine.config.json` 并填好本机路径，再继续。

`machine.config.json` 已加入 `.gitignore`，每台机器一份。协议约束：它的 `piSourceRoot` 必须与根目录 `workspace.config.js` 的 `piSourceRoot` 一致；`gitBashPath` 必须与 `~/.pi/agent/settings.json` 的 `shellPath` 一致。

## 学科目录约定

每个学科子目录内的文件（新增学科照此建立最小集：`MISSION.md`、`RESOURCES.md`、`NOTES.md`、`LEARNING_PATH.md`、`lessons/`、`assets/`）：

| 文件 / 目录 | 作用 |
|---|---|
| `MISSION.md` | 为什么学这个。所有教学决策回到它 |
| `RESOURCES.md` | 可信来源（知识 + 社区），显式标注已知缺口 |
| `NOTES.md` | 教学偏好、环境事实、已做的教学决策、已放弃的方向 |
| `LEARNING_PATH.md` | 主线的阶段路线与考核规则 |
| `lessons/00NN-*.html` | 课程。一次性的消费品，读完就算 |
| `reference/*.html` | 速查页（词汇表、运行模式、中英对照等）。会被反复回看 |
| `learning-qa/*.md` | 逐文件的问答考核：题目、回答、批改、强化题 |
| `learning-records/*.md` | 学习记录：确认过的起点、被纠正的误解、任务变更 |
| `exercises/*.mjs` | 练习，单文件、单命令、自带判定 |
| `assets/` | 课程共用的样式与交互组件 |

## 教学呈现（视觉优先，高知识密度）

- **能用图讲就不堆字。** 目标是让更少的文字承载更多信息，不是把课拉长。
- 优先手段：内联 SVG 图解、CSS/JS 动画、可交互组件（步进器、模拟器、quiz）。仓库已有 `assets/loop-stepper.js`、`assets/quiz.js` 可参考。
- 新出现的可复用可视化一律沉到该学科 `assets/`，第二课起直接复用，**禁止内联复制**。
- 每课仍只求一个「能带走的收获」，用图/动画把它讲透；难度控制在最近发展区，用视觉提密度，不用信息量压垮工作记忆。
- 图表与动画要考虑打印 / 静态降级（参考现有 `course.css`）。

## 硬规则

- **不凭参数记忆下结论。** 事实主张只能来自 `RESOURCES.md` 列出的来源，或本机源码仓库里的真实文件。
- 中文教学，代码与标识符保持英文。
- 课程是单文件 HTML；链接、样式、交互一律复用 `assets/`，不要另起一套。
- 选择题各选项等长（汉字数一致），不给格式线索。
- 不为「取证」催用户跑命令；练习尽量自带反馈、可自判。
- 只在一个学科子目录内改动；动手前先读该目录的 `MISSION.md`、`NOTES.md`、`LEARNING_PATH.md` 与最新的 `learning-records/`。
- 不在仓库里写死本机绝对路径（含本说明文件）。课程 HTML 里指向 pi 源码的链接写 GitHub 地址 + `data-pi="<仓库内相对路径>"`，由 `pi/assets/workspace-links.js` + 根 `workspace.config.js` 在本地改写为 `file://`。

## 考核流程（pi 主线；更细版本见 `pi/AGENTS.md`）

1. 读 `pi/LEARNING_PATH.md` 定位当前文件，读 `pi/learning-qa/` 恢复历史。
2. 用户读完文件后，在对话里出 3 题：概念 / 执行流程 / 最小修改。
3. 用户作答后写入 `pi/learning-qa/<文件名>.md`，逐题批改并解释错误。
4. 有薄弱点追加 2 道强化题（只练薄弱点）；全对才收口，更新该文件状态与 `LEARNING_PATH.md` 复选框。
5. 用户未学先问：给答案 + 讲解，但状态记「未考核」，之后换问法复测。
6. 每篇先挑核心部分重点讲、重点考；安装方式、目录、快捷键这类操作性细节不出题。

## 当前学科

### `pi/`

- 已收口：`package.json`、`README.md`、`examples/README.md`、`docs/index.md`、`docs/quickstart.md`、`docs/usage.md`（2026-10-03）
- 未考核（知识点/答案已给）：`CHANGELOG.md`、`docs/providers.md`、`docs/models.md`、`docs/settings.md`、`docs/keybindings.md`、`docs/sessions.md`、`docs/compaction.md`、`docs/security.md`
- 阶段 1（作为用户掌握主流程）已覆盖；**阶段 2 进行中**：`packages/agent/README.md`（`lessons/0010`）与 `agent-loop.ts` 的 `runLoop()`（`lessons/0016`）课与中英对照已给；下一步做 `exercises/0001-agent-loop.mjs` 并回到 `reference/glossary.html` 收词。
- 路线：2026-09-20 合并为单一主线（阶段 0–15），见 `pi/LEARNING_PATH.md` 与 `pi/learning-records/0008`

### `deepseek-harness/`

- 第 1 课已提供，待学习与解释；尚未考核任何概念
- 课程基线 `ddefc45fbc` / `0.1.6-alpha.2`，见 `SOURCE_BASELINE.json`

## 机器相关（值以 `machine.config.json` 为准）

- pi 的 `bash` 工具默认找不到 Git Bash（本机装在非标准路径），需要在 `~/.pi/agent/settings.json` 写 `"shellPath": "<gitBashPath>"`（转义反斜杠）。改完要 `/reload` 或重启 pi。
- 根 `.mcp.json` 注册了 `codebase-memory`（stdio: `codebase-memory-mcp`）。

## 源码基线（会持续迭代）

两个源码仓库都在持续迭代，课程里记的版本只是当时快照。继续任何主题前，**用 `machine.config.json` 里的路径现读源码的实际版本**，再决定是否更新记录或课程，不要假设仍是旧版：

- pi：课程记录 `0.82.1`；本机 `packages/coding-agent` 现为 `1.0.4`（HEAD `18336987a`，2026-10-06）
- deepseek-harness：基线记录 `0.1.6-alpha.2`；本机现为 `0.2.0-rc.2`
