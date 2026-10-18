# 源码漂移评估：pi v1.0.0 → v1.3.0（文档课需修订，源码课仅补细节）

2026-10-18，用户问「当前代码仓库都更新了，是否需要更新课程」。按仓库规矩现读源码实际版本后评估，结论：**需要一次版本复核，但幅度分化很大**——文档课（0005–0015）有中等漂移，源码课（0010/0016 与 agent 中英对照）核心机制未变。

## 先纠正一个错误记录

此前 `NOTES.md` 写「课程按记录版本 `0.82.1` 写」**不准确**。`v0.82.1`（2026-07-25）时 `docs/cli.md`/`configuration.md`/`how-pi-works.md` 尚不存在（随 09-22 文档刷新 `25cc5c7bf` 才出现），而课程已引用它们；源码课用的 `finishTurn`/`prepareRequest`/`TranscriptContext` 在 0.82.1 也不存在。课程实际是 2026-09-15~10-11 多版本混写，文档课近似 **v1.0.0**（2026-10-01，恰在课程收口日 10-03 前）。

## 建基线（本学科此前没有）

- 新增 `SOURCE_BASELINE.json`（锚点 v1.0.0 `a13d35a7`，5 个关注主题 + 25 文件哈希）+ `tools/check-source.mjs` + `tools/README.md`，结构对齐 `deepseek-harness/tools/`。
- 运行结果：v1.0.0 → HEAD `482c1381a`（v1.3.0）**26 项变化，5 个关注主题全部命中**。

## 源码课（lessons/0010、0016、reference/agent-readme-bilingual）

**核心机制未变，无需重写。** 证据：`git diff v1.1.0..HEAD` 对三个文件完全为空；课程 0 命中旧 API（`shouldStopAfterTurn`/`addedToolNames`/`AgentContext.systemPrompt`），说明课程本就用的是改版后版本。自 v1.0.0 起唯一真实代码改动是提交 `36a686ee8`（2026-10-06）引入的 `durationMs`。

待办（补细节，非改论断）：
- 事件表补 `tool_execution_end` 现带 `durationMs`。
- 可选：`AgentToolResult.isError`（execute 可返回 `isError:true` 而不抛）、`convertToLlm` 现允许输出 `SystemMessage`。

## 文档课（0005–0015）— 自 v1.0.0 起的真实漂移

| 旧行为 → 新行为 | 影响的课 |
|---|---|
| Azure provider ID `azure-openai-responses` → **`azure`** | 0008 providers |
| `--tools` 现接受纯 `+name`/`-name`（改 defaultTools 选择）；`--no-tools` 含 MCP；新增 `--no-mcp` | 0007 usage / 0011 settings |
| `/share` 默认：已登录 Radius 用 artifact，否则私有 gist；新增 `sessionShareDestination` | 0013 sessions / 0007 usage |
| compaction `reserveTokens` **只是触发阈值**（不再影响摘要输出上限）；摘要**不再含 `[Assistant thinking]`** | 0014 compaction |
| keybinding 默认键变化（`cursorLineStart/End` 去 `ctrl+home`/`ctrl+end`；fullscreen 顶/底改 `ctrl+home`/`ctrl+end`） | 0012 keybindings |
| `message-types`：`SystemMessage.replace` **移除**；`AssistantMessage.thinkingLevel`、`ToolResultMessage.nestedCalls` 新增 | 扩展/SDK 相关课 |
| 安装新增 **Nix**（`pi update` 不能更新 Nix 安装）；`samplingParams`/`samplingParamsByThinkingLevel` | 0006 quickstart / 0009 models |
| 文档地图新增 2 篇：`models-configuration.md`、`nvidia-rtx-llama-cpp.md`（v1.0.0 后无删除） | 0005 docs-map |

自 v1.0.0 起**未变**、课程应已跟上：`index.md`、`security.md`、`session-format.md`、`configuration.md`、`how-pi-works.md`、`virtual-models.md`、`slash-commands.md`。（首轮评估若以 0.82.1 为锚会把这些误判为需整页刷新。）

## 状态与下一步

- **复核已完成并收口**（2026-10-18）。逐课对照 v1.0.0→v1.3.0 后，上表的多数条目**并未落到任何课程正文**——文档课是概念级叙述，不含那些字段级细节（`azure-openai-responses`、`--tools +/-`、`sessionShareDestination`、`cursorLineStart`、`reserveTokens` 输出上限、`samplingParams`、`--no-mcp`、`Nix` 等在 lessons/reference 里 grep 均 0 命中；`0006` 本就已含 Nix 安装/卸载段）。
- 实际改动：
  - `lessons/0002`：定位语改回 README 现文 "minimal, extensible agent harness"；「没有内建 MCP」改为「MCP 已内建」（`builtin:mcp`、`.pi/mcp.json`、`pi mcp add/list`、`--no-mcp`、`/mcp`）。
  - 参照页：`pi-customization-map`（MCP 归入内建）、`glossary`（compaction 落点改为 `packages/coding-agent/src/core/compaction/`）、`pi-package-map`（页脚版本标签去掉 `0.82.1`）、`usage-bilingual`（`/share` 默认语义 + `sessionShareDestination`）、`models-bilingual`（classifier 表补 `openai / gpt-6-luna`）。
  - 源码课 `0010`/`0016`：核心机制未变，未改（`durationMs` 属事件负载细节，课程事件表本就不列负载）。
- `SOURCE_BASELINE.json` 已上移 v1.3.0（`482c1381a`），重算 26 个文件哈希并新增 `mcp.md` 跟踪；`node ./pi/tools/check-source.mjs` 报 0 变化。

Evidence: `tools/check-source.mjs` 输出；三份按 v1.0.0→HEAD（源码课另核 v1.1.0）与 v0.82.1→HEAD 的语义 diff；`git diff a13d35a7..HEAD --name-status -- packages/coding-agent/docs/`。

Implications: 教训是「记录版本号」必须锚到可验证的提交，否则日后无从判断课程是否过期——本学科此前正是缺一个像 deepseek 那样的基线文件。后续每个从源码提取的事实，落进课程时记下对应提交更稳妥。
