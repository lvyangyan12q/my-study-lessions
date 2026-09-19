# Mission: 手搓一个 agent

## Why
用户原话："为了后续可以手搓 agent"。即：不再把 agent 当黑盒，能自己从零写出核心循环，并在读懂 pi 这类现成实现之后按自己需要改造它，而不是被框架定好的形状限制。

## Success looks like
- 不看任何 agent 框架，用 ≤150 行 TypeScript 写出一个 CLI agent：接一个模型、挂 2 个工具、循环到任务结束
- 能指着 `packages/agent/src/agent-loop.ts` 逐个说出每层循环和每个 `emit` 为什么存在
- 遇到真实故障能自己定位：工具抛错、参数不合法、上下文超长、用户中断
- 能写 pi extension 快速验证想法，并能判断"这个能力该放在扩展层还是核心层"

## Constraints
- 每周可投入时间：**每天 1 小时，约 7 小时/周（已确认）**
- 现有 TypeScript / Node 水平：**能读 TypeScript，没写过 Node 项目（已确认）**
- 环境：用户机器上 pi 会话内的 bash 工具不可用，所有练习需在用户自己的终端执行
- 每节课的内容量按 60 分钟"读 + 动手"预算设计

## Out of scope（现在不碰）
- 训练 / 微调模型
- 多 agent 编排框架
- 向量库 / RAG
- Web UI / 前端界面
