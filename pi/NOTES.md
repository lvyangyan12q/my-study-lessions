# Teaching Notes（合并自两期教学）

## 工作区位置（2026-10-03 更新）

- 仓库根 = 学习总目录（Obsidian 知识库），每门学科一个子目录，`pi/` 是其中一门；git 推 GitHub `lvyangyan12q/my-study-lessions`。
- 本学科工作区：本目录 `pi/`。
- 本机路径不写死：仓库根 `machine.config.json`（gitignore，每机一份）保存 `repoRoot` / `piSourceRoot` / `deepseekSourceRoot` / `gitBashPath`；换机器复制 `machine.config.example.json` 填一份。
- 课程里指向 pi 源码的链接一律走「GitHub 地址 + `data-pi` 属性」约定：`assets/workspace-links.js` + 仓库根 `workspace.config.js`（gitignore，`piSourceRoot` 需与 `machine.config.json` 一致）在页面加载时改写成 `file:///` 本地直达。**不要在课程中写死本机绝对路径。**

## 教学流程（主线，阶段 0、2–12、15；原阶段 1/14 已下沉附录）

- 按文件推进（`LEARNING_PATH.md`）；每读完一个文件用户回报，`learning-qa/<文件名>.md` 中 3 题（概念/执行流程/最小修改）起步。
- 用户在对话里作答 → 教师写入文件（闭卷，避免用户看到相邻批改）。
- 有错题追加 2 道强化题只练薄弱点；全对才收口并在 `LEARNING_PATH.md` 打勾。
- **用户会把源文件原文整段粘贴当回答**：推理类题目需显式要求「给出判断过程」，否则视为未答。用户主动要答案（未学先问）时：给答案+讲解，但状态记「未考核」，换问法复测。
- 已排间隔复测（混入后续 QA，不预告）：exports 白名单性质、cli.js 去向（~2026-09-11 前后，部分已通过）；**CHANGELOG 一课（2026-09-15 直接给答案）复测未做**；**压缩⇒只改「发给模型的上下文」而不改 messages 数组/原始条目**、**`isError` 的角色语义**（2026-10-18 记）。

## 手搓 agent 并入主线（2026-09-20 二次整合）

- 用户要求不再分主线/支线：`LEARNING_PATH.md` 重写为单一主线，`packages/agent` 内容按主题嵌在各阶段（阶段 2 最小循环、阶段 5 StreamFn/事件点、阶段 7 压缩实现、阶段 15 毕业任务「手搓 ≤150 行 agent」）。
- 旧课 `lessons/0003-agent-loop.html`、`0004-tool-failures.html`、`exercises/`、`reference/glossary.html` 全部保留在主序列里，编号顺延（后续课程 0005 起）。
- 该线原本的样式/组件决策（quiz.js 回忆卡/选择题、loop-stepper、练习单文件单命令自判）继续适用；新增可复用组件写进 `assets/`。

## 边缘基础下沉附录（2026-10-18）

- 用户要求「快些进入原理和代码，边缘基础知识整理成附录备查」。经确认：范围 = **阶段 1（用户文档）+ 阶段 14（平台维护）**；形态 = **新建 HTML 速查页**。
- 做法：新建 `reference/appendix-user-basics.html`（九节要点 + 链接，只链不复制正文）；`LEARNING_PATH.md` 主线改为 **阶段 0 → 2 → 3 → … → 12 → 15**，原 1、14 移入文末「附录」节并标注不考核；规则加第 9 条「附录不逐篇考核」。
- 原则：**保留全部旧课、不改课号、不删课**，只把「必经」改为「附录可查」。`lessons/0001–0016`、`learning-qa/*`、既有 `reference/*` 一律不动。
- 顺带修正：`LEARNING_PATH.md` 顶部写死的本机路径改为读 `machine.config.json`；删掉阶段 1 重复的一行；附录中发现原列 `docs/development.md` 已被上游（`25cc5c7bf`，2026-09-22）移除，改指仓库根 `AGENTS.md` / `CONTRIBUTING.md`。
- 详见 `learning-records/0012-mainline-skip-to-code.md`。

## 用户偏好

- 中文教学；代码与标识符保持英文。
- **不要为了「获取证据」就催用户跑命令或回报输出**：资料与课程直接生成；练习自判成败，措辞用「做完自己对照」。用户会主动汇报进度或提问。
- 每天约 1 小时；内容宁可短。
- 选择题选项等长（全部 4 个汉字），避免格式泄题。
- 2026-10-03：本库是 Obsidian 知识库，会持续加入新学科；课程**视觉优先**（图解 / 动画 / 交互组件），在 60 分钟预算内提高知识密度——用视觉承载信息，而不是靠加长文字。
- 2026-10-03：出题**只考与使命相关的概念与判断链**（二次开发 / 手搓 / 判断落层）；**安装方式、目录、`--continue` 这类操作性细节不要出题**。
- 2026-10-03：**核心概念 / 机制要重点讲、重点考**；每篇先挑出「核心部分」深讲，再只对核心出题（概念 + 判断链）。操作性细节（安装、目录、快捷键）不出题。
- 2026-10-03：**课程验收尺子（10 分钟）**：一门课要能让读者在 10 分钟内 ① 说清本课内容 ② 带走一个明确收获 ③ 核心知识点不漏。三缺一不算达标。
- 2026-10-03：问答**默认直接写标准答案 + 讲解**进 `learning-qa/`（状态记「未考核（教师直接给答案）」），不等用户逐题作答；用户有空看，后续换问法复测。
- 2026-10-03：`docs/` 这类偏概念/操作的用户文档**不逐篇出课与中英对照**，直接给「知识点 + 答案」Markdown（放 `learning-qa/`）。**视觉课 + 中英对照只留给核心**（`packages/agent` 源码、Extension、SDK、手搓 agent）。
- 2026-10-18：**用户 JS/TS 语法不熟（流程懂）**。阶段 2 起凡要求写代码：先给对应语法速查（新建 `reference/js-syntax.html`），再让其动手；代码点评用「报错 → 病因」对照直连到具体行，不从概念重讲。

## 机器事实（2026-10-11 更新）

- **本机绝对路径一律不写在本文件**，读仓库根 `machine.config.json`：`repoRoot` / `piSourceRoot` / `gitBashPath`（每机一份，已 gitignore）。
- bash 可用（Git Bash 装在非标准路径，已按 `gitBashPath` 写进 `~/.pi/agent/settings.json` 的 `shellPath`）；`node` 可用（Node v22）。
- 源码仓库是完整 monorepo（含 `packages/coding-agent/src/`、`packages/agent/`），在位于 `machine.config.json.piSourceRoot`。
- 「引用文档走 `packages/coding-agent/docs/`，根目录没有 docs/」同样成立。
- 2026-10-18：pi 现为 **1.3.0**（HEAD `482c1381a`）。
- 2026-10-18：此前「课程按记录版本 `0.82.1` 写」**不准确，已作废**。依据：`v0.82.1`（2026-07-25）时 `docs/cli.md`/`docs/configuration.md`/`docs/how-pi-works.md` 尚不存在——它们随文档刷新 `25cc5c7bf`（2026-09-22，随 v0.87.1 起）才出现，而课程 `lessons/0005` 已引用它们。课程实际是 2026-09-15~10-11 多版本混写：老课 `0003`/`0004` 更早，文档课近似 v1.0.0，新课 `0010`/`0016` ≈ v1.1.0。
- 2026-10-18：本学科**新建**源漂移检查（此前只有 deepseek 有）：`pi/SOURCE_BASELINE.json` + `pi/tools/check-source.mjs`（结构对齐 `deepseek-harness/tools/`，本机源码键为 `piSourceRoot`）。同日先以 v1.0.0 `a13d35a7` 为临时锚点评估，复核完课程后**锚点已上移到 HEAD v1.3.0 `482c1381a`**（2026-10-18）；`mcp.md` 已并入跟踪。`node ./pi/tools/check-source.mjs` 现报 0 变化。
- 1.0.1–1.0.4 的影响（小）：`--tools`/`--exclude-tools` 支持 `*` 模式、`--no-mcp`；`Home`/`End` 行为调整；`models.json` 新增 `samplingParamsByThinkingLevel`；`coding-agent` 的 Azure provider 改名为 `azure`（Breaking）。
- 1.1.0 的影响（对二次开发最相关的几条）：`--tools` 新增 `+name/-name`（改默认选中项而非整个替换）；工具渲染上下文新增 `outputPad`（现也作用于 `!` 输出 / 工具输出 / 摘要块）与 `durationMs`；`tool_execution_end`、`agent_settled` 新增 `durationMs` / `aborted`；分类器新增 GPT-6 Luna（`OPENAI_API_KEY`）与 llama.cpp 原生 decision model（Julia-1 / Laya / Kev / lev / OpenJev），`models.classify()` 开始接受 `images`。核心机制未变。
- 2026-10-11：`~/.pi/agent/settings.json` 的 `extensions` 指向本仓库的 `pi/extensions`。**它以本机绝对路径形式写在机器配置里，每台机器要重设一次**——所以绝不要把该路径抄进任何入库文件（这正是旧记录踩过的坑）。
- `pi/extensions/jev.ts`（547 行）：把 Jev 分类模型包成 `jev` 工具（用 `ctx.modelRegistry.classify()`），是阶段 3/4 的**真实扩展素材**，**已入库**（旧记录写「未入库」已过期）。两点注意：
  - 它是**可选**素材——`LEARNING_PATH.md` 任何阶段清单都没有列它；pi 也支持 `pi -e ./pi/extensions/jev.ts` 显式加载，不挂全局设置不影响主线。
  - 它需要 Jev-capable provider（`TYPESAFE_API_KEY` / `OPENROUTER_API_KEY` / `AI_GATEWAY_API_KEY` / `CLOUDFLARE_*` / `OPENCODE_API_KEY` 之一，见文件头注释）。本机 `~/.pi/agent/models.json` 目前只配了 `command-code`，没有 Jev provider，所以 `jev` 工具挂着也调不通。



## Open items

- **2026-10-18 源码漂移复核已收口，见 `learning-records/0011`**：逐课核对 v1.0.0→v1.3.0 后，多数文档课本就概念级、结论未变；实际改动仅 `lessons/0002`（README 定位语、内建 MCP）与 5 处参照页（自定义地图 MCP、glossary 的 compaction 落点、包结构图版本标签、usage 的 `/share`、models 的 classifier 表）。源码课（0010/0016）核心未变。`SOURCE_BASELINE.json` 已上移 v1.3.0 且清检通过。
- 主线 checkpoint：**阶段 0 已覆盖**（`package.json`/`README.md`/`examples-README.md` 收口；`CHANGELOG` 待复测）。原阶段 1 的用户文档（`index`/`quickstart`/`usage` 已收口，`providers`/`models`/`settings`/`keybindings`/`sessions`/`compaction`/`security` 已给知识点）**已下沉附录**，不再阻塞主线。
- 下一步：**阶段 2 进行中**——`lessons/0003` 与 `exercises/0001` 均已收口（2026-10-18；见 `learning-records/0013`、`0014`）；下一站课 `0010`（`packages/agent/README.md`：Message Flow / Event Flow），再课 `0016`（`agent-loop.ts` 的 `runLoop()`）。

## 2026-09-20 迁移记录

- 目录合并操作与编号：我的学习记录 0001–0005 保留；旧线上 0001 → `learning-records/0006-starting-point-and-constraints.md`；旧课 0001/0002 → `lessons/0003-agent-loop.html`/`0004-tool-failures.html`（交叉链接已同步）。
- 样式：`assets/course.css` 合并 = 我的主题为基础 + 旧课组件类（.page/.kicker/.subtitle/.goal/.callout/.recall/.mcq/.stepper 等）+ 兼容变量（--muted/--paper-2/--mono/--serif/--sans）。旧 course.css 曾被我误覆盖，已从 git HEAD 恢复后合并。
- 链接：我的 5 个 HTML 改为 GitHub+data-pi 约定（22 处），脚本 `tools/convert-html-links.cjs` 保留备查。