# README 考核关闭：四种模式 + 按触发机制判断定制阶梯

`README.md`（`packages/coding-agent/README.md`）考核两轮后于 2026-09-11 通过关闭。用户现在能默写默认四工具（`read`/`write`/`edit`/`bash`）与四种运行模式入口（交互、`pi -p`、`--mode json`、`--mode rpc`、SDK `createAgentSession` from `@earendil-works/pi-coding-agent`），并能正确区分 RPC（非 Node.js 进程）与 SDK（Node/TS 应用嵌入）。

核心非显然洞察（已在批改中确立，后续课程可直接引用）：**定制阶梯的决策变量是触发机制**——用户手动展开（Prompt Template）→ 模型按需加载（Skill）→ 事件驱动执行代码（Extension）。「会话结束自动 git commit」「`rm -rf` 前确认」都因事件驱动而落 Extension；Package 只是扩展的分发形态，不是更轻的方案。

Evidence: `learning-qa/README.md` 第一轮（概念漏四工具与 SDK 模式、Q2 未答判断链、Q3 资源类型选错）+ 强化题全对。

Implications: 阶段 2–3 讲 Extensions 时可假设该判断框架已建立，无需重讲四层定位；出题侧重判断链而非纯默写。教学上注意：用户会把源文件原文整段粘贴当作回答——推理类题目需显式要求「给出判断过程」。
