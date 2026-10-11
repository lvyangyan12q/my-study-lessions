# Teaching Notes（合并自两期教学）

## 工作区位置（2026-10-03 更新）

- 仓库根 = 学习总目录（Obsidian 知识库），每门学科一个子目录，`pi/` 是其中一门；git 推 GitHub `lvyangyan12q/my-study-lessions`。
- 本学科工作区：本目录 `pi/`。
- 本机路径不写死：仓库根 `machine.config.json`（gitignore，每机一份）保存 `repoRoot` / `piSourceRoot` / `deepseekSourceRoot` / `gitBashPath`；换机器复制 `machine.config.example.json` 填一份。
- 课程里指向 pi 源码的链接一律走「GitHub 地址 + `data-pi` 属性」约定：`assets/workspace-links.js` + 仓库根 `workspace.config.js`（gitignore，`piSourceRoot` 需与 `machine.config.json` 一致）在页面加载时改写成 `file:///` 本地直达。**不要在课程中写死本机绝对路径。**

## 教学流程（主线，阶段 0–13）

- 按文件推进（`LEARNING_PATH.md`）；每读完一个文件用户回报，`learning-qa/<文件名>.md` 中 3 题（概念/执行流程/最小修改）起步。
- 用户在对话里作答 → 教师写入文件（闭卷，避免用户看到相邻批改）。
- 有错题追加 2 道强化题只练薄弱点；全对才收口并在 `LEARNING_PATH.md` 打勾。
- **用户会把源文件原文整段粘贴当回答**：推理类题目需显式要求「给出判断过程」，否则视为未答。用户主动要答案（未学先问）时：给答案+讲解，但状态记「未考核」，换问法复测。
- 已排间隔复测（混入后续 QA，不预告）：exports 白名单性质、cli.js 去向（~2026-09-11 前后，部分已通过）；**CHANGELOG 一课（2026-09-15 直接给答案）复测未做**。

## 手搓 agent 并入主线（2026-09-20 二次整合）

- 用户要求不再分主线/支线：`LEARNING_PATH.md` 重写为单一主线，`packages/agent` 内容按主题嵌在各阶段（阶段 2 最小循环、阶段 5 StreamFn/事件点、阶段 7 压缩实现、阶段 15 毕业任务「手搓 ≤150 行 agent」）。
- 旧课 `lessons/0003-agent-loop.html`、`0004-tool-failures.html`、`exercises/`、`reference/glossary.html` 全部保留在主序列里，编号顺延（后续课程 0005 起）。
- 该线原本的样式/组件决策（quiz.js 回忆卡/选择题、loop-stepper、练习单文件单命令自判）继续适用；新增可复用组件写进 `assets/`。

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

## 机器事实（2026-10-03 更新）

- bash 可用（Git Bash 装在非标准路径 `D:\programming\Git`，已在 `~/.pi/agent/settings.json` 设 `shellPath`）；`node` 可用（Node v22）。
- 源码仓库是完整 monorepo（含 `packages/coding-agent/src/`、`packages/agent/`）；本机在位路径见 `machine.config.json.piSourceRoot`（记录曾写 `D:/programming/workspace/pi`）。
- 「引用文档走 `packages/coding-agent/docs/`，根目录没有 docs/」同样成立。
- 2026-10-06：pi 升到 **1.0.4**（源码与全局安装一致，HEAD `18336987a`，覆盖 v1.0.1–v1.0.4，最后提交 2026-10-06）。
- 2026-10-06：`~/.pi/agent/settings.json` 新增 `extensions: ["D:/learning-lessons/pi/extensions"]`；其中 `pi/extensions/jev.ts`（547 行）把 Jev 分类模型包成 `jev` 工具（用 `ctx.modelRegistry.classify()`）——这是阶段 3/4 的**真实扩展素材**，未入库。
- 1.0.1–1.0.4 对已有课程的影响（小）：`--tools` 支持 `+name/-name`、`*` 模式与 `--no-mcp`；`Home`/`End` 行为调整；`models.json` 新增 `samplingParamsByThinkingLevel`；`coding-agent` 的 Azure provider 改名为 `azure`（Breaking）；`outputPad` 现也作用于 `!` 输出/工具输出/摘要块。核心机制未变。



## Open items

- 主线 checkpoint：**阶段 0–1 已覆盖**——`package.json`/`README.md`/`examples-README.md`/`docs/index.md`/`quickstart`/`usage` 收口；`providers`/`models`/`settings`/`keybindings`/`sessions`/`compaction`/`security` 直接给知识点与答案（未考核）；`CHANGELOG` 待复测。
- 下一步：**阶段 2**（`packages/agent` 源码 + 手搓），课 `lessons/0003`/`0004` 已有，可进入 `packages/agent/README.md` 与 `agent-loop.ts` 的 `runLoop()`。

## 2026-09-20 迁移记录

- 目录合并操作与编号：我的学习记录 0001–0005 保留；旧线上 0001 → `learning-records/0006-starting-point-and-constraints.md`；旧课 0001/0002 → `lessons/0003-agent-loop.html`/`0004-tool-failures.html`（交叉链接已同步）。
- 样式：`assets/course.css` 合并 = 我的主题为基础 + 旧课组件类（.page/.kicker/.subtitle/.goal/.callout/.recall/.mcq/.stepper 等）+ 兼容变量（--muted/--paper-2/--mono/--serif/--sans）。旧 course.css 曾被我误覆盖，已从 git HEAD 恢复后合并。
- 链接：我的 5 个 HTML 改为 GitHub+data-pi 约定（22 处），脚本 `tools/convert-html-links.cjs` 保留备查。