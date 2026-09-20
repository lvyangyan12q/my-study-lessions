# 阶段 0 收口：SDK 与扩展的「谁驱动谁」+ 事件驱动落层链已内化

用户完成阶段 0 最后一个文件 `examples/README.md` 的考核（两轮强化题独立答对），现能：

- 从「谁驱动谁」区分两类示例：SDK 示例由外部 Node/TS 程序驱动 Pi（入口 `createAgentSession`，宿主 = 外部进程）；扩展被 Pi 启动时加载并调用（宿主 = Pi 进程）。
- 把 README 课的「事件驱动 → Extension」判断链直接应用到新场景：如「会话结束自动 git commit」→ 生命周期事件 → 只有扩展能订阅 → 落 Extension，并能说出真实示例 `examples/extensions/auto-commit-on-exit.ts` 的位置。

Evidence: `learning-qa/examples-README.md` 强化题 1、2 独立答对。

Implications: 阶段 2–3 讲扩展时，「扩展运行在 Pi 进程内、启动时加载、export default 工厂」可作为既定前提带过，不必重讲，直接进入具体 API。出题继续要求推理链（「先…再…所以…」），用户已能给出完整链。

Status: active