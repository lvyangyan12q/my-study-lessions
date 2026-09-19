# pi 二次开发 —— 资源清单

> 原则：**不信任模型的记忆**，所有断言都回到下面这些一手来源核对。
> 链接一律指向 GitHub 上的同一文件（本机路径见仓库根的 `workspace.config.js`，课程页面会自动改写成 `file://` 本地链接）。

## 本地源码仓库（最高可信度）

本机 pi 源码仓库：`D:/programming/workspace/pi`（路径由 `workspace.config.js` 配置，因为每台电脑位置可能不同）。
下面用 GitHub 形式给出路径；本地仓库里是同样的相对路径。

### 手搓 agent 专项（当前任务的主线教材）

- [packages/agent/src/agent-loop.ts](https://github.com/earendil-works/pi/blob/main/packages/agent/src/agent-loop.ts)
  约 600 行的真实 agent 循环：内外双层循环、工具批执行、截断保护、事件 emit。
  **用于**：第 1 课起的主源。读法：先只读 `runLoop()`，跳过 `declareToolChanges()` 与并行执行。
- [packages/agent/README.md](https://github.com/earendil-works/pi/blob/main/packages/agent/README.md)
  `@earendil-works/pi-agent-core` 的概念文档：Message Flow、Event Flow、AgentMessage vs LLM Message。
  **用于**：同一件事的"对外叙述"版本，与源码对照读。
- [packages/agent/src/types.ts](https://github.com/earendil-works/pi/blob/main/packages/agent/src/types.ts)
  `AgentLoopConfig`、`BeforeToolCallResult`、`AfterToolCallResult`、`StreamFn` 的契约与字段语义。
  **用于**：想知道"官方允许你在哪插入行为"时。
- [packages/agent/src/harness/compaction/](https://github.com/earendil-works/pi/tree/main/packages/agent/src/harness/compaction)
  上下文压缩的实现。
  **用于**：第 4 课（上下文窗口）那一节。

（正在核实的路径：假模型 provider `fauxText` / `fauxToolCall`，本机 npm 包里是 `packages/ai/src/providers/faux.ts`，本仓库尚未确认对应文件。用于跑练习时避免花 API key。）

### 扩展点（"先验证想法"阶段的教材）

- [packages/coding-agent/docs/extensions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md)（约 3000 行）
  扩展机制完整参考：事件订阅、`registerTool`、`registerCommand`、`ctx.ui`、状态持久化、自定义渲染。
  **用于**：任何"我想让 pi 在 X 时候做 Y"的问题。二次开发的主入口。
- [packages/coding-agent/docs/tui.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/tui.md)（约 960 行）
  TUI 组件 API。**用于**：写自定义交互界面时才翻，别提前读。
- [packages/coding-agent/docs/custom-provider.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/custom-provider.md)（约 780 行）
  `pi.registerProvider()`。**用于**：接入自己的模型服务/代理。
- [packages/coding-agent/docs/skills.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md)（约 230 行）
  Skill 的写法与加载规则。**用于**：只想要"给 pi 加一套流程知识"、不写代码时。
- [packages/coding-agent/docs/packages.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md)（约 230 行）
  打包分发。**用于**：跨机器复用或分享时。
- [packages/coding-agent/docs/sdk.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sdk.md)（约 1220 行）
  把 pi 嵌入自己的程序（含 RPC 模式）。**用于**：目标是"做自己的 agent 应用"而非改造 pi。

## 知识（外部）

- [Pi 官网](https://pi.dev)
  安装与概览。
- [CONTRIBUTING.md](https://github.com/earendil-works/pi/blob/main/CONTRIBUTING.md)
  注意：**改 pi 本体**与**写扩展**是两条完全不同的路。前者有贡献门禁（新贡献者 PR 默认自动关闭），二次开发通常应走扩展而不是改核心。

## 智慧（社区）

- [pi Discord](https://discord.com/invite/3cU7Bz4UPx)
  官方社区。**用于**：扩展 API 的怪问题、想要别人 review 你的设计、想知道官方推荐做法。用户已同意加入。
- [GitHub earendil-works/pi Issues](https://github.com/earendil-works/pi/issues)
  **用于**：搜"有没有人做过 X"。先搜再写，能省一节课的量。

## Gaps（已知缺口）

- 未找到**第三方**成体系的 pi 扩展教程/视频。文档 + examples 目前就是全部高质量材料。后续会话应主动搜一次再下结论。
- **"从零构建 agent"方向的外部高质量材料尚未调研**（例如 Anthropic / OpenAI 关于 agent 设计的官方文章）。下次会话前先找一手来源，不要凭记忆引用。
- 官方扩展 API 的"演进史/破坏性变更"没有集中记录，只能查 `packages/coding-agent/CHANGELOG.md`。
- 中文材料：未发现。教学需自己产出中文参考页。

## 教学主线（依 MISSION.md）

1. 最小循环的形态与真实源码对照
2. 工具与参数校验、错误如何回灌给模型
3. 流式输出与事件流（UI 从哪里拿数据）
4. 上下文窗口与压缩
5. 中断、重试、排队消息这类"入口与出口"问题
6. 用 pi extension 快速验证想法（然后判断该放扩展层还是核心层）

## 用户偏好

- 愿意加入社区（pi Discord），后续可以推荐去社区验证想法（已确认）。
- 时间预算：每天 1 小时（已确认）。每节课按 60 分钟"读 + 动手"设计。
