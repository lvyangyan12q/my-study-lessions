# Mission: Pi 深度掌握与二次开发

## Why

两条驱动，合并自两期教学：

1. **二次开发**：掌握 Pi 的扩展、SDK 与 RPC 接口，能针对真实工作流做二次开发并交付可运行的定制功能。
2. **手搓 agent**：不再把 agent 当黑盒，能在读懂 pi 这类现成实现之后按自己需要改造它，最终从零写出自己的 agent，而不是被框架定好的形状限制。

## Success looks like

- 能独立实现、调试并维护单文件 Extension。
- 能用 SDK 或 RPC 将 Pi 嵌入自己的程序。
- 能判断需求应由配置、Skill、Extension、SDK 还是内核修改完成。
- 需要修改内核时，能进入完整 monorepo 源码定位正确模块。
- 不看任何 agent 框架，用 ≤150 行 TypeScript 写出一个 CLI agent：接一个模型、挂 2 个工具、循环到任务结束。
- 能指着 `packages/agent/src/agent-loop.ts` 逐个说出每层循环和每个 `emit` 为什么存在。
- 遇到真实故障能自己定位：工具抛错、参数不合法、上下文超长、用户中断。
- 能用 pi extension 快速验证想法，并判断「这个能力该放在扩展层还是核心层」。

## Constraints

- 学习对象：`packages/coding-agent`（Pi 0.82.1，完整 monorepo 的一部分）为主；`packages/agent` 在阶段 2/5/7/15 按主题并入主线。
- 中文教学；问题、回答、批改和强化题保存在 `learning-qa/` 的 Markdown 中；不依赖参数记忆，断言回 `RESOURCES.md` 核源。
- 先做最小可运行实现，再增加确有需要的复杂度。
- 时间预算：每天约 1 小时；每课内容量按 60 分钟「读 + 动手」设计（旧工作区确认）。
- 不能跑命令时（或用户不愿跑时），课程反馈内置在 HTML（选择题 / 回忆卡自判），不把「跑练习」设为开课前置。

## Out of scope

- 与二次开发无关的娱乐型 TUI 示例暂缓。
- `packages/coding-agent/src/` 可用但不逐文件精读；只在需要解释扩展/SDK 行为或定位实现时按主题进入。`packages/agent/` 的循环与压缩是主线的正式组成部分（阶段 2/5/7/15），不属于「内核精读」的推迟范围。
- 训练/微调模型、多 agent 编排框架、向量库/RAG、Web UI/前端界面。