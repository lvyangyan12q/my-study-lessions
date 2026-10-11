# 人能介入 agent 循环的三种方式已内化

用户通过 `docs/usage.md` 核心题：能说清 Pi 工作中三种介入方式的行为与时机——`Enter` = **steer**（等当前回应及其工具调用结束再送达，引导下一次回应）、`Alt+Enter` = **follow-up**（等整个任务结束才取用）、`Escape` = **abort**（立即停止，排队消息退回编辑器）。abort 的后果、follow-up 不算打断，都判断正确。

唯一薄弱点：英文术语名（steer / follow-up / abort）两次都没主动写出，只描述了中文行为。已记入 `reference/glossary.html`，列为间隔复测。

Evidence: `learning-qa/usage.md` 第一轮 + 强化题 1、2。

Implications: 阶段 2 讲 agent 循环时，可直接把「steering / follow-up / abort 是循环的三个外部注入点」当作已知前提，对应 `how-pi-works` 与 `packages/agent` 的循环入口；术语名随复测补强。
