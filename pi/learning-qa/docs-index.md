# `docs/index.md` 学习问答

状态：**已通过并关闭（2026-10-03）**

> 说明：本课对应 `packages/coding-agent/docs/index.md`——官方文档地图。目标：知道文档分几组、每组解决什么问题，能把「需求 → 文档」映射起来。这是阶段 1（作为用户掌握主流程）的第一篇，也是最薄的一篇（一屏左右）。

## 第一轮

### 问题 1：概念

`docs/index.md` 把文档分成哪几组（写组名）？其中「Customization」组里包含哪几种定制资源？「Programmatic usage」组里与 README 一课四种运行模式对应的条目分别是哪几篇？

#### 我的回答

开始使用pi，定制pi,自动化或嵌入pi,查阅与安装信息，安全的使用；复用提示词、按需加载专门指令、加入可执行集成、改变终端界面、接入模型服务，并把这些资源打包分发；Use Pi interactively，Choose a model，Continue or branch a session，Configure Pi，Understand how Pi works
#### 批改

**部分正确。**

- **组名：全对。** 开始用 Pi / 定制 Pi / 自动化或嵌入 Pi / 查阅与安装信息 / 安全地使用——五组齐全。
- **定制资源：方向对，但需要给资源名。** 你写的是 index.md 那段能力描述的转述（提示词、专门指令、可执行集成、终端界面、模型服务、打包）。题目要的是**资源类型名**：Prompt Templates（提示词模板）、Skills（技能）、Extensions（扩展）、Themes（主题），由 Pi Package 分发。这正好是第 2 课定制阶梯的五层。
- **「Programmatic usage」：答错组。** 你列的是「Start using Pi」的五个条目。与四种运行模式对应的是「Automate or embed Pi」组：打印模式 → `cli.md`；JSON 事件流 → `json.md`；RPC → `rpc.md`；TypeScript SDK → `sdk.md`。


### 问题 2：执行流程

场景：你接到需求「把 Pi 嵌进自己的 TypeScript 程序：创建会话、订阅事件流、发一条消息」。从 `docs/index.md` 出发，依序应该读哪几篇？写出顺序并说明为什么是这个顺序（结合 README 一课的运行模式知识）。

另：上一课那个「消息渲染留白对不齐」的问题，从 `docs/index.md` 出发应该翻哪一组、哪一篇？

#### 我的回答

model,cli，sdk,json,rpc,
#### 批改

**第一部分：视为未答。** 你只丢了一串文件名，没有顺序、没有理由，而且混进了不相关的 `cli`（print 一次性）与 `rpc`（跨进程、非 Node）。

标准推理链：需求是「把 Pi 嵌进自己的 **TypeScript** 程序」→ 宿主语言是 Node/TS → 先按「谁驱动谁」选模式：**SDK**（外部 Node 程序驱动 Pi、进程内运行），而不是 RPC（非 Node 进程驱动）。所以首选 [sdk.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sdk.md)；「创建会话、订阅事件流、发一条消息」正是它开头的 `examples/sdk/01-minimal.ts` 做的事（事件订阅走 SDK 会话 API，不是 `json.md`——那是「跑一次、输出 JSON 事件流」的模式）。要选模型再回 `models.md`。

**第二部分：未答。** 「消息渲染留白对不齐」属**定制 Pi** 组 → [extensions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md)（消息渲染器一节）；换渲染器、改 TUI 都是扩展的地盘。


### 问题 3：最小修改

给一个从没摸过 Pi 的新同事，只用 `docs/index.md` 里的链接排一张「第一天学习顺序」：只列三篇，写清顺序与理由。

#### 我的回答

 Quickstart，Use Pi interactively，Choose a model

#### 批改

**选得合理，但本题要求「写清理由」，你没写。** 顺序本身成立：先装好、能跑（`quickstart.md`）→ 学会交互里怎么干活（`usage.md`）→ 按需换模型 / 接 Key（`models.md`）。补上理由链即可；另一条同样成立的路是把第三篇换成 `configuration.md`（先能用，再按自己偏好配）。


## 强化练习

> 只练本轮薄弱点：运行模式↔文档的映射、定制资源的落层。

### 强化题 1：一一配对 + 一个区分变量

把四种运行模式与 `docs/index.md`「Automate or embed Pi」里的四条一一配对（模式 → 文件）。再用一句话说清 **RPC 与 SDK 的区分变量**是什么。

#### 我的回答

想在应用内部运行 Pi，用 TypeScript SDK；
想控制一个独立的 Pi 进程，用 RPC 模式；
想消费一次运行中的结构化事件，用 JSON 事件流模式；
一次性、脚本化任务用 打印模式。
rpc是通过rpc调用进程；sdk是程序内部运行是一个进程

#### 批改

**通过（补一个小点）。** 四条配对的语义全对：SDK = 进程内运行、RPC = 控制独立进程、JSON = 一次运行的结构化事件、print = 一次性脚本。区分变量也抓对了：**RPC 跨进程、SDK 同进程**（更准确：RPC 给非 Node 进程，SDK 给 Node/TS 应用）。唯一漏的是——题目要「模式 → 文件」，把文件名补上：print → `cli.md`、JSON → `json.md`、RPC → `rpc.md`、SDK → `sdk.md`。

### 强化题 2：三个需求各读哪篇

下列需求分别该读「定制 Pi」组里的哪一篇？各用一句话说明**触发机制**（谁触发、何时触发）：

(a) 输入 `/review` 展开一段固定的代码审查提示词。
(b) 每次会话结束自动 `git commit`。
(c) 自定义消息渲染器的留白与官方消息对不齐。

#### 我的回答
 Quickstart customization chooser

a)指令
b)门禁hooks
c)changelogs

#### 批改

**未通过——定制落层要重建。** 这三题问的是「该读『定制 Pi』哪一篇 + 触发机制」，你给的 a)指令、b)门禁hooks、c)changelogs 都没落到正确文件，还把「门禁」和「CHANGELOG」混了进来。

重建框架（决策变量 = **触发机制**）：

- 用户手动（斜杠命令把文本展开）→ **Prompt Template** → `prompt-templates.md`
- 模型按需加载（判断需要时才读）→ **Skill** → `skills.md`
- 事件驱动（某时刻自动执行代码）→ **Extension** → `extensions.md`
- 外观 → **Theme** → `themes.md`
- 分发以上任意几样 → **Pi Package** → `packages.md`

逐题：

- **(a) `/review` 展开固定提示词 → Prompt Template**（`prompt-templates.md`）；触发＝**用户手动**输入斜杠命令，把模板展开成文本。
- **(b) 会话结束自动 `git commit` → Extension**（`extensions.md`）；触发＝**事件驱动**（会话结束那一刻代码自动跑）。「门禁」是另一类扩展（执行前确认），不是这里。
- **(c) 消息渲染器留白 → Extension**（`extensions.md`）的**消息渲染器**（读 `outputPad` 对齐）；`CHANGELOG` 只是记录了这个改动，不是要读的文档。

### 强化题 3：落层 + 触发机制

下列需求各落「定制 Pi」的哪一层（写资源名 + 文件名）？触发机制各是什么？

(1) 让模型在需要时自动加载一份「公司代码规范」说明。
(2) 换一套终端配色。
(3) Bash 工具即将执行 `rm -rf` 时先弹窗确认。

#### 我的回答
1）可以用skills,模型按需加载（判断需要时才读）
2）外观 → **Theme** → `themes.md`
3）事件驱动（某时刻自动执行代码）→ **Extension** → `extensions.md`

#### 批改

**通过。** 三层全对：

1. 公司代码规范说明 → **Skill**（`skills.md`）；触发＝模型按需加载。
2. 终端配色 → **Theme**（`themes.md`）；换主题。
3. `rm -rf` 前弹窗 → **Extension**（`extensions.md`）；触发＝工具调用前的事件拦截（门禁）。

小补：第 1 题把文件名 `skills.md` 写上就更完整了。

### 强化题 4：决策变量

一句话回答：判断一个需求该用 Template / Skill / Extension 时，要先问的那个变量是什么？再各用 2–4 字写出三者的触发方式。

#### 我的回答

手动触发用template
ai自动选择触发用skill
事件驱动，某个时刻需要执行用extension

#### 批改

**通过。** 三种触发方式全对：手动 / 模型按需 / 事件驱动。唯一差点：题目先问「那个变量叫什么」——就是 **触发机制**（谁触发、何时触发）。记住先问这一句，再往三层里套。

---

**本轮收口：** 第一轮的经验、强化轮的重建都已完成；`docs/index.md` 关单，进入 `docs/quickstart.md`。