# Pi 深度掌握 · 可信资料（合并自两期教学）

> 规则：课程里的事实主张必须来自这里列出的来源，或来自本机源码仓库中的实际文件。不依赖参数记忆。
> 链接一律指向 GitHub 上的同一文件（本机仓库位置由仓库根 `workspace.config.js` 配置；课程 HTML 页面加载时会自动改写成 `file:///` 本地链接；Markdown 里直接用 GitHub 链接）。

## Knowledge

### 本地源码仓库（最高可信度）

本机 pi 源码仓库：`F:/ai-project/pi`（完整 monorepo，含 `packages/coding-agent/src/` 与 `packages/agent/`）。

- [packages/coding-agent/README.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md)
  Pi 的官方总览：定位、四种运行模式、定制阶梯、Philosophy、CLI 参考。用途：任何「Pi 是什么／怎么用」问题的第一入口。
- [packages/coding-agent/docs/](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/docs)
  官方文档集（约 30 篇）。用途：`index.md` 是文档地图；扩展看 `extensions.md`+`tui.md`，嵌入看 `sdk.md`+`json.md`+`rpc.md`。
- [packages/coding-agent/examples/](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples)
  官方示例源码。用途：`extensions/` 是扩展 API 的事实标准（文档偏薄时以此为准）；`sdk/01-minimal.ts` 起是嵌入范例。
- [packages/coding-agent/CHANGELOG.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/CHANGELOG.md)
  功能演进与破坏性变更。用途：升级前扫 `Changed`，排查行为不符时查 `Fixed`。
- [packages/agent/src/agent-loop.ts](https://github.com/earendil-works/pi/blob/main/packages/agent/src/agent-loop.ts)
  约 600 行的真实 agent 循环：内外双层循环、工具批执行、截断保护、事件 emit。**用途**：阶段 2（0003 课起）与阶段 15 毕业任务的主源；先只读 `runLoop()`。
- [packages/agent/README.md](https://github.com/earendil-works/pi/blob/main/packages/agent/README.md)
  `@earendil-works/pi-agent-core` 的概念文档：Message Flow、Event Flow、AgentMessage vs LLM Message。用途：与源码对照读的「对外叙述」版本。
- [packages/agent/src/types.ts](https://github.com/earendil-works/pi/blob/main/packages/agent/src/types.ts)
  `AgentLoopConfig`、`BeforeToolCallResult`、`AfterToolCallResult`、`StreamFn` 的契约与字段语义。用途：想知道「官方允许你在哪插入行为」时。

### 外部文档与规范

- [Pi 官网：pi.dev](https://pi.dev)
  文档与安装脚本入口。用途：`curl -fsSL https://pi.dev/install.sh | sh`；版本检查 API。
- [源码仓库：earendil-works/pi](https://github.com/earendil-works/pi)
  完整 monorepo 源码与 release notes。用途：内核实现、GitHub issues 搜索、发布源码归档验证。
- [npm：@earendil-works/pi-coding-agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)
  发布包元数据、版本历史、依赖。用途：核对版本、依赖树、安装方式。
- [Agent Skills 标准：agentskills.io](https://agentskills.io)
  Skill 遵循的开放标准（frontmatter、渐进加载）。用途：写 Skill 时的规范来源。
- [Node.js 文档 · Package entry points](https://nodejs.org/api/packages.html#package-entry-points)
  `exports`/`main`/`types`/`bin` 的权威语义。用途：`package.json` 边界最终依据。
- [Mario Zechner：Why you don't need MCP](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
  Philosophy 中「No MCP」的原始论证。
- [Mario Zechner：Pi coding agent 设计说明](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
  README Philosophy 一节的完整版。
- [CONTRIBUTING.md](https://github.com/earendil-works/pi/blob/main/CONTRIBUTING.md)
  注意：**改 pi 本体**与**写扩展**是两条不同的路；前者有贡献门禁。二次开发通常应走扩展而不是改核心。

## Wisdom (Communities)

- [Pi Discord](https://discord.com/invite/3cU7Bz4UPx)
  官方社区。用途：扩展 API 的实践问题、第三方 Pi Package 分享、让社区 review 想法/设计。**用户已同意加入**。
- [GitHub Issues / Discussions：earendil-works/pi](https://github.com/earendil-works/pi/issues)
  维护者与贡献者出没处。用途：搜「有没有人做过 X」、报告行为边界、定位实现约束。

## Gaps（已知缺口）

- 未找到**第三方**成体系的 pi 扩展教程/视频；文档 + examples 目前就是全部高质量材料。
- **「从零构建 agent」方向的外部高质量材料尚未调研**（Anthropic / OpenAI 官方 agent 设计文章）；写毕业任务与阶段 2 课程前先找一手来源，不凭记忆引用。
- 官方扩展 API 的破坏性变更没有集中记录，只能查 `CHANGELOG.md`。
- 中文材料：未发现，教学需自己产出中文参考页。

## 教学主线

主线（阶段 0–13，按文件推进）：见 `LEARNING_PATH.md`。
主线阶段 2 起：`lessons/0003`、`0004` → `packages/agent/` 源码 + 官方概念文档；阶段 15 是毕业任务（≤150 行手搓 agent）。