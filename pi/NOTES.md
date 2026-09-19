# Teaching Notes

## 仓库与工作区位置

- 仓库根：`D:/learning-lessons`（用户的个人学习仓库，推到 `https://github.com/lvyangyan12q/my-study-lessions`）。**仓库根 = 学习总目录，`pi/` 只是其中一门学科。**
- 本门学科的工作区：`D:/learning-lessons/pi/`。
- 原始位置是 `D:/programming/workspace/pi/learning/`（pi 源码仓库内部）。后来用户要求独立成仓库，2025 那轮搬迁过程中丢了内容，由我在新位置按上下文重建。
- 因此：**不要假设任何文件还在旧路径**。`D:/programming/workspace/pi/learning/` 下只剩一个我误建的 `assets/workspace-links.js`，属于残留，可以忽略或删掉。
- 仓库外还躺着几个已经作废的脚本（用户可自行删除）：`workspace/scan-old-study.mjs`、`workspace/import-old-study.mjs`、`workspace/publish-study.mjs`、`workspace/study/`（空的旧目标目录）。

## 跨机器路径配置（重要设计）

课程里指向 pi 源码/文档的链接**不写死本机路径**：

- HTML 里一律写 GitHub 地址（`https://github.com/earendil-works/pi/blob/main/<path>`）+ `data-pi="<仓库内相对路径>"`。
- `<script src="../../workspace.config.js">` 设置 `window.LEARNING_WORKSPACE.piSourceRoot`。
- `pi/assets/workspace-links.js` 在页面加载时把带 `data-pi` 的链接改写成 `file:///<piSourceRoot>/<相对路径>`。
- 配置缺失（新电脑、刚 clone）→ 保持 GitHub 链接，页面照常可用。

`workspace.config.js` 在 `.gitignore` 里，每台机器一份；`workspace.config.example.js` 入库作模板。

## Machine facts (probed)

- **没有 shell**：bash 工具报 "No bash shell found"（搜过 `C:\Program Files\Git\bin\bash.exe` 与 x86 版）。我无法执行任何命令、无法列目录、无法打开文件给用户。目录是否存在只能用 `read` 探测（`EISDIR` = 存在，`ENOENT` = 不存在）。
- 后果：练习必须由用户在自己终端跑；我写的脚本我无法执行验证，只能逐行通读。发脚本前要把风险面写清楚。
- git 不在 `C:\Program Files\Git\cmd`，也不在 `C:\Program Files\GitHub CLI`、`%LOCALAPPDATA%\Programs\Git`。但 `D:/programming/workspace/pi/.git` 存在（origin = earendil-works/pi），说明 git 在用户 PATH 的某个位置可用。
- `C:\Program Files\nodejs` 不存在，但 `%APPDATA%\npm` 存在 → node 用了非默认前缀（大概率 nvm-windows）。pi 本身跑在 node 上，所以用户终端有 node。
- 仓库 `D:/programming/workspace/pi` 的 docs 在 `packages/coding-agent/docs/`，**根目录没有 docs/**。引用文档要走这个路径。

## 用户偏好（重要）

- **不要让他跑命令、不要等他回报输出。** 用户原话："你不需要写这些命令，你直接生成对应文件和资料就好了"。他要的是课程与资料本身。
- 因此：每节课的反馈必须内置在 HTML 里（选择题 / 回忆卡 / 步进器自判），不依赖终端。
- 练习文件照旧产出（那是技能练习的载体），但不要附带"跑完把输出贴给我"的要求，也不要用它作为开下一课的前置条件。写作时用"做完自己对照"的语气。
- 不要因为缺少证据就停下来不发下一课。没有证据时按上一课的内容顺势往下教，并在课内把前置知识简要重申一遍。

## 教学决策（续）

- 用户写中文，课程用中文；代码与标识符保持英文。
- 共享样式 `pi/assets/course.css`（无外部字体、离线可用、含打印规则）。
- 已组件化：`course.css`、`quiz.js`（`.recall` 回忆卡 + `.mcq` 选择题）、`loop-stepper.js`（`<loop-stepper>` JSON 驱动的循环轨迹播放器）、`workspace-links.js`（跨机器链接）。
- 选择题选项等长（全部 4 个汉字），避免格式泄题。
- 时间预算每天 1 小时：每课必须能在 60 分钟内"读完 + 做完练习"。
- 练习一律单文件 `.mjs`、单条 `node` 命令、自动判定成败。
- 不引入构建链；Node 基础（ESM、`process.argv`、`for await`）在真实代码里顺路讲，不单独开课。

## 已放弃的方向（不要再提，除非用户主动问）

- `D:/迅雷下载/study`：用户曾提出把这批旧 pi 学习材料合并进仓库，随后自己收回（"算了，你不要这部分了"）。**不要再主动提议导入。**
- 教训：不要为了"看一眼目录"就让用户去跑扫描脚本。读不了目录时，先用已有信息推进教学，或者用最少的一条命令解决，且要说明为什么。

## Open items

- **git 与推送由用户自理**（用户原话："推送你不用管了，我配置好了"）。不要再催他跑发布命令。
- 第 2 课已出（`lessons/0002-tool-failures.html`），按"已能写出循环"的假设写，课内重申了前置知识。
- 仍没有学习证据（练习未跑、回忆题未答），且用户不要我做这件事。后续按内容主线推进，不再以证据为前置条件。
- 第 3 课之后应调研外部高质量材料（"从零构建 agent"），不要在没找到一手来源时引用。
