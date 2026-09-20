# `examples/README.md` 学习问答

状态：~~第一轮进行中~~ → ~~第一轮已批改（部分正确）~~ → **已通过并关闭（2026-09-15）**

> 说明：本课对应 `packages/coding-agent/examples/README.md`——一份示例地图，目标是能一眼分清 SDK 示例与 Extension 示例，知道什么需求去哪个目录找现成例子。

## 第一轮

### 问题 1：概念

`examples/` 下的两大分组是什么？各用一两句话说明它们演示什么（写清楚：sdk/ 的示例是从哪个入口函数开始的）。README 里列的 extensions 能力大类中，请至少写出四类（举例即可，不用背全）。

#### 我的回答

sdk `createAgentSession`

extensions:自定义工具，生命周期事件处理器，自定义ui,系统提示修改和自定义压缩

#### 批改

**部分正确（通过线边缘）。**

- 两大分组：你写了 `sdk` 与 `extensions`，隐含正确但没点明分组名是 `sdk/` 与 `extensions/` 两个目录。
- sdk/ 的入口函数：`createAgentSession` 正确。缺一句定位：sdk/ 演示的是**在自有程序里程序化使用 Pi**（自定义模型、提示词、工具、扩展、会话管理），是「嵌入」视角。
- extensions 能力四类：自定义工具、生命周期事件处理器、自定义 UI、系统提示修改和自定义压缩——四类全部正确。
- 缺：没交代 extensions/ 的写入方式（「为交互会话增强 Pi 的扩展」，跑在 Pi 自己进程里）——这正好是问题 2 的落点。

### 问题 2：执行流程

判断题，请给出判断过程（「先…再…所以…」）：

一个同事把 `examples/sdk/01-minimal.ts`（用 `createAgentSession()` 建会话的完整程序）复制进 `~/.pi/agent/extensions/`，想让它作为扩展自动加载。这个做法对不对？错在哪里？sdk/ 与 extensions/ 两份示例的「宿主进程」分别是什么？

#### 我的回答

不对，sdk是给外部程序对接调用pi的能力的。extension是给piagent增加扩展能力

#### 批改

**部分正确。** 判断「不对」正确，「外部程序对接调用 Pi」vs「给 Pi Agent 加扩展」方向对，但两点没答到位：

1. **推理链缺失**（题目明确要「先…再…所以…」）：标准链——先看文件形态：`01-minimal.ts` 是**独立的程序**（`createAgentSession()` 建会话、订阅事件、发消息、退出，全程自己驱动）；再看加载方向：`~/.pi/agent/extensions/` 里的文件是**被 Pi 启动时加载**的扩展模块，Pi 是宿主；所以把独立程序放进扩展目录，Pi 会按「扩展」的方式调它，得到的不是「嵌一个 Agent 进来」，而是行为不符/根本不生效。
2. **宿主进程**没写明：sdk/ 示例的宿主 = **运行它的那个 Node/TS 进程**（外部程序自己）；extensions/ 示例的宿主 = **Pi 自身的进程**（由 Pi 加载并调用）。判断一句话：**谁在驱动谁**——SDK 示例是「程序驱动 Pi」，扩展是「Pi 驱动扩展」。

### 问题 3：最小修改

需求：想写一个「每次会话结束时自动 `git commit`」的示例供团队参考。放 `examples/sdk/` 还是 `examples/extensions/`？用一句话说明理由（结合上一课 README 的判断链），并给出这个示例在真实仓库中对应的文件名（提示：这个文件真实存在）。

#### 我的回答

放到extensions.Git integration (checkpoints, auto-commit)

#### 批改

**部分正确。** 目录 `extensions/` 正确，引用 README 的 Git integration 能力清单也对；漏了两点：

1. **理由没接上一课的判断链**：「会话结束」是一个**生命周期事件**，只会被扩展订阅（扩展有事件钩子）；Prompt/Skill/Theme 都没有事件钩子，SDK 是嵌入场景不适用——所以落 Extension。
2. **真实文件名没写**：`examples/extensions/auto-commit-on-exit.ts`（本就存在）。

**总评：三个都对了一半左右，没有硬错误，但推理链都要补。追加 2 道强化题，只练薄弱点。**

---

## 强化练习（第一轮薄弱点，共 2 题）

### 强化题 1：加载机制

不查资料回答：Pi 在启动时**怎么对待** `extensions/` 目录里的文件（它期望每个文件是什么形态、谁来调用）？对比：sdk/ 里的示例程序**靠谁启动**（谁调用了 `createAgentSession`）？用「谁驱动谁」一句话总结两者关系。

#### 我的回答

pi启动时加载extensions，pi驱动扩展；sdk时程序驱动pi

#### 批改

**通过。** 加载方向与「谁驱动谁」都正确。补充一个精确点：Pi 期望扩展目录里每个文件是「导出工厂函数的模块」（`export default` 返回扩展定义），启动时由 Pi 调用——具体形态在第 3 阶段学 hello.ts 时再装。

### 强化题 2：补全判断链

补全上一次的最小修改题：写出该示例的真实文件名（`examples/extensions/` 下），并补上完整理由链：「会话结束」是什么触发方式 → 定制阶梯里只有哪一层能订阅事件 → 所以落在哪一层？

#### 我的回答

auto-commit-on-exit.ts. 会话结束触发生命周期事件，钩子函数触发，只有extensions支持订阅事件

#### 批改

**通过，本课关闭。** 链完整：会话结束 = 生命周期事件 → 只有扩展能订阅事件 → 落 Extension；文件名 `auto-commit-on-exit.ts` 准确。

阶段 0 备注：`CHANGELOG.md` 仍为未考核状态（复测题将在后续 QA 中混入，不预告）；package.json / README / examples-README 三课已收口。