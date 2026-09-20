# 学习路线：从一次调用到可维护插件

目标见 [MISSION.md](MISSION.md)。这是按能力推进的顺序，不要求按目录通读。只有用户能解释原因或提交实践证据，阶段才标记通过。

| 阶段 | 核心问题 | 产出与通过标准 | 首选依据 |
|---|---|---|---|
| 0 · 当前 | 模型调用工具后发生什么？ | 画出一次 turn 的两个 step；解释工具结果为何必须回到下一次模型请求 | [第一课](lessons/0001-agent-cycle.html)，architecture 的 Turn flow |
| 1 | 插件如何活起来、停下来？ | 解释 apply、inject、ctx 和 effect；预测依赖卸载时消费者会发生什么 | cordis-primer；cordis-tutorial 01–04 |
| 2 | 一个工具如何被模型看到和调用？ | 实现最小 greet 类工具，分清 parameters、execute、output.schema、output.render；覆盖有效与无效输入 | user/develop/basic/tool；core/tools |
| 3 | 插件如何装进应用？ | 用 profile + patch 加载本地插件；说明配置层次、替换规则和卸载结果 | user/develop/basic/index；architecture；boot/app-boot |
| 4 | 如何把功能换成另一种实现？ | 沿一个真实能力识别 Definition / Provider / Consumer；替换 provider 而保持调用接口 | user/develop/practice；capability-seams |
| 5 | 权限、失败和中断由谁处理？ | 追一次拒绝、异常与取消；写事件监听器时能解释 next() 与 signal | tool-execution-pipeline；core/tools；interaction |
| 6 | 会话如何恢复，模型为何“记得”？ | 从日志指出模型可见输入来源；区分临时流、日志事件、投影与落盘 | core/session；session persistence；agent-loop |
| 7 | 如何做一次有价值的二次开发？ | 选择真实需求，比较工具、事件、provider 和 SDK 方案，交付一个完整功能及验证证据 | extension-cookbook；sdk；相关 subsystem |
| 8 | 上游更新后如何继续维护？ | 读一次基线差异，修订依赖接口，运行与变更有关的验证，记录新基线 | [更新方法](UPDATES.md)，development，testing |

阶段 8 的检查从第一课起贯穿使用，不必等到最后才处理更新。

每课节奏：少量机制说明 → 一个可操作的例子 → 源码定位 → 自测 → 用自己的话解释。第一课约 15–20 分钟，时间可按反馈调整。

## 进度

- [ ] 阶段 0：第一课已生成，未考核
- [ ] 阶段 1–8：按学习反馈生成后续课

## 按文件推进（参考 pi 的课程方式）

每个文件只读当前阶段列出的重点。用户读完后在对话中回答 3 题：概念、执行流程、最小修改；回答与批改写入 learning-qa。有薄弱点追加 2 道针对题，解释通过后再勾选。直接看过答案的题保持未考核，后续换情境复测。不要因为页面或文件已生成而标记完成。

### 阶段 0 · 工具往返

- [ ] [`docs/architecture.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/architecture.md)：只读 Cordis、Core packages、Turn flow，辨认四类职责。
- [ ] [`packages/core/agent-loop/src/agent.ts`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/core/agent-loop/src/agent.ts)：只找 turn / step 和继续条件，暂不精读异常分支。

### 阶段 1 · 生命周期

- [ ] [`docs/cordis-tutorial/01-first-plugin.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cordis-tutorial/01-first-plugin.md)：插件加载与 apply。
- [ ] [`docs/cordis-tutorial/02-lifecycle-and-effects.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cordis-tutorial/02-lifecycle-and-effects.md)：effect、disposer 与资源清理。
- [ ] [`docs/cordis-tutorial/03-services.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cordis-tutorial/03-services.md)：依赖出现、消失与恢复。
- [ ] [`docs/cordis-tutorial/04-events.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cordis-tutorial/04-events.md)：事件模式和 waterfall 的 next()。

### 阶段 2 · 第一个工具

- [ ] [`docs/user/develop/basic/tool.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/user/develop/basic/tool.md)：parameters、execute、output.schema 和 render。
- [ ] [`packages/interaction/tool-ask-user/src/index.ts`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/interaction/tool-ask-user/src/index.ts)：读真实 consumer，解释两项服务依赖。
- [ ] [`packages/core/tools/src/schema.ts`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/core/tools/src/schema.ts)：只定位 defineTool 和验证职责。

### 阶段 3 · 应用组合

- [ ] [`docs/user/develop/basic/index.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/user/develop/basic/index.md)：用 dsh web --patch 加载插件，运行前核对当前环境要求。
- [ ] [`docs/user/develop/basic/config.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/user/develop/basic/config.md)：配置与运行时校验。
- [ ] [`packages/boot/app-boot/README.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/boot/app-boot/README.md)：profiles 和 patch 的组合顺序。

### 阶段 4 · 替换服务

- [ ] [`docs/user/develop/practice/index.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/user/develop/practice/index.md)：找到三个角色；按替换需要决定是否拆包。
- [ ] [`docs/capability-seams.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/capability-seams.md)：查当前能力的服务定义、provider 与 consumer。

### 阶段 5 · 失败与策略

- [ ] [`docs/tool-execution-pipeline.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/tool-execution-pipeline.md)：追一次获准、拒绝和失败。
- [ ] [`docs/cookbook/adding-a-tool.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cookbook/adding-a-tool.md)：取消信号、错误与输出协议。
- [ ] [`packages/core/agent-loop/src/tool-calls.ts`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/core/agent-loop/src/tool-calls.ts)：定位 executeToolCalls，先看结果提交再按需读并发。

### 阶段 6 · 会话与恢复

- [ ] [`packages/core/session/src/index.ts`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/core/session/src/index.ts)：对照 append 和 deriveMessages。
- [ ] [`packages/session/session-checkpoint-policy/src/index.ts`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/session/session-checkpoint-policy/src/index.ts)：找出何时刷新持久化。
- [ ] [`docs/session-format-status.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/session-format-status.md)：产品版本与 Session writer 格式。

### 阶段 7 · 实际二次开发

- [ ] [`docs/cookbook/extension-cookbook.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cookbook/extension-cookbook.md)：为真实需求选择扩展入口。
- [ ] [`docs/testing.md`](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/testing.md)：选择与行为有关的验证，包含相关的失败、取消或卸载路径。

阶段 7 的具体 SDK 或 UI 文件，等业务需求确定后再列；阶段 8 的版本复核按 UPDATES.md 贯穿进行。


## 下一次继续

告诉老师“继续 deepseek-harness”，或直接回答 [第一课问题](learning-qa/0001-agent-cycle.md)。教师先检查源码版本，再复核上一课薄弱点；无需用户先跑环境或提供命令输出。
