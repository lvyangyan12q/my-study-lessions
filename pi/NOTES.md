# Teaching Notes（合并自两期教学）

## 工作区位置（2026-09-20 起生效）

- 学习仓库根：`F:/lessons-study`（用户自理的 git 仓库，原 `D:/learning-lessons` 迁来，推 GitHub `lvyangyan12q/my-study-lessions`）。**仓库根 = 学习总目录，`pi/` 是其中一门学科。**
- 本学科工作区：**`F:/lessons-study/pi/`**（2026-09-20 从 `F:/ai-project/pi/study/` 整体迁入，与旧工作区合并）。
- 课程里指向 pi 源码的链接一律走「GitHub 地址 + `data-pi` 属性」约定：`assets/workspace-links.js` + 仓库根 `workspace.config.js`（gitignore，每机一份，当前 `piSourceRoot = "F:/ai-project/pi"`）在页面加载时改写成 `file:///` 本地直达。**不要在课程中写死本机绝对路径。**
- 旧路径 `F:/ai-project/pi/study/` 已删除；源码仓库本体在 `F:/ai-project/pi`。

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

## 机器事实（历史记录，已过时 → 现况）

- ~~没有 shell、无法执行命令~~ → 现环境（`F:/lessons-study`）bash 可用，`node` 可用（Node v22）。
- ~~仓库在 `D:/programming/workspace/pi`~~ → 现为 `F:/ai-project/pi`，是完整 monorepo（含 `packages/coding-agent/src/`、`packages/agent/`）。
- 当时「引用文档走 `packages/coding-agent/docs/`，根目录没有 docs/」→ 现在同样成立。



## Open items

- 主线 checkpoint：`CHANGELOG.md` 未考核（待复测）；`docs/index.md` 第一轮问题已出、待用户作答；`package.json`/`README.md`/`examples-README.md` 已收口。
- 合并主线后：`LEARNING_PATH.md` 已重写为单一顺序（阶段 0–15）；下一步作业仍是 `docs/index.md` 三题。

## 2026-09-20 迁移记录

- 目录合并操作与编号：我的学习记录 0001–0005 保留；旧线上 0001 → `learning-records/0006-starting-point-and-constraints.md`；旧课 0001/0002 → `lessons/0003-agent-loop.html`/`0004-tool-failures.html`（交叉链接已同步）。
- 样式：`assets/course.css` 合并 = 我的主题为基础 + 旧课组件类（.page/.kicker/.subtitle/.goal/.callout/.recall/.mcq/.stepper 等）+ 兼容变量（--muted/--paper-2/--mono/--serif/--sans）。旧 course.css 曾被我误覆盖，已从 git HEAD 恢复后合并。
- 链接：我的 5 个 HTML 改为 GitHub+data-pi 约定（22 处），脚本 `tools/convert-html-links.cjs` 保留备查。