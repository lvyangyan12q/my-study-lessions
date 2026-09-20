# 使命修订：学习对象从发布包变为完整 monorepo

2026-09-11，用户确认：当前目录 `F:/ai-project/pi` 已是完整 `earendil-works/pi` monorepo，`packages/coding-agent`（0.82.1）含核心 `src/`。使命与路线中「二进制发布包、无内核源码」的表述全部过期，正式修订。

改动要点：

- `MISSION.md` Constraints：学习对象改为 `packages/coding-agent`；逐文件精读内核仍排在扩展/SDK/RPC 之后。Out of scope 相应改为「内核 `src/` 可用但不精读，按主题进入」。
- `LEARNING_PATH.md`：头部声明路径一律相对于 `packages/coding-agent/`；「进入内核源码学习的条件」改为从本地 `src/` 直接进入，不再要求下载 `pi-mono`；跳过清单保留发布包路径并注明 monorepo 中多为构建产物。
- 教学路线本身（阶段 0–13 的顺序与考核规则）不变。

Evidence: `MISSION.md` 修订前后对照；`NOTES.md` 2026-09-11 条目。

Implications: 后续出题可直接引用 `packages/coding-agent/src/` 的真实实现作为权威来源，与官方 `docs/`、`examples/` 并列；遇到文档与行为不一致时多了一个裁决途径。阶段 0 的「认清发布包」目标在新环境下应理解为「认清发布包的构建来源（本仓库）」，不影响当前 README.md 考核的继续。
