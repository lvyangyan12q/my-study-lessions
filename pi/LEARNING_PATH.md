# Pi 主学路线（合并主线：二次开发 + 手搓 agent）

> 目标一句话：先把 pi 当用户用熟，再亲眼看见 agent 的最小形态，再学会在 pi 之上做二次开发（配置 / Skill / Extension / SDK / RPC），最后用全部积累**手搓出自己的 agent**，并能判断「这个能力该放扩展层还是核心层」。
>
> 两条使命不再分行，合并为一条顺序主线。「手搓」从阶段 2 的 agent 最小形态开始贯穿全程：每学一块扩展能力，就回到真实循环看它对应循环里的哪一点。
>
> 工作区：`F:/lessons-study/pi/`。源码仓库：`F:/ai-project/pi`（完整 monorepo）。主线文件路径相对于 `packages/coding-agent/`；手搓内容相对于 `packages/agent/`。课程 HTML 已并入此工作区（0001–0004 起），后续课程继续按编号往下写。

## 学习与考核规则

1. 严格按阶段走；同一阶段内按文件出现顺序学习。
2. 每读完一个文件，告诉我：`完成：相对路径`。
3. 我会在 `learning-qa/` 中为该文件建立问答 Markdown，先写 3 题：概念题、执行流程题、最小修改题。
4. 你在对话里作答；我把回答写入同一个 Markdown 并逐题批改、补充解析。
5. 有错题时在同一文件末尾追加 2 题，只练薄弱点；你再次作答。全对则进入下一个文件。
6. 阶段结束追加 1 个小任务，要求组合本阶段知识完成。
7. `CHANGELOG.md`（已直接给答案）的**复测**由教师混入后续 QA（不预告），通过前算未完成；其余文件以问答通过为准。
8. 手搓线的课程（`lessons/0003` 起的 HTML）自带内嵌反馈（回忆卡 / 选择题 / 练习自判），读完课再顺手做完练习并自己对照判定即可，不阻塞主线前进。

## 阶段 0：认清学习对象

- [x] `package.json`：包入口、Node 版本、四个核心依赖、构建产物和脚本。（已完成，第一课已关闭）
- [ ] `CHANGELOG.md`：只看当前版本及最近两个版本，认识功能演进；**答案已直接给出，待复测通过后才算完成**。
- [x] `README.md`：Pi 的定位、四种运行模式、扩展机制和设计哲学。（已完成，已关闭）
- [x] `examples/README.md`：区分 SDK 示例与 Extension 示例。（已完成，已关闭）

阶段目标：能解释「Pi 是什么、当前目录有什么、为什么发布包里没有内核源码」。

阶段任务（回忆）：默写默认四工具；说出四种运行模式入口（interactive / print+JSON / RPC / SDK）；用一句话说清「程序驱动 Pi」与「Pi 驱动扩展」的区别。

## 阶段 1：作为用户掌握主流程

- [ ] `docs/index.md`：文档地图。
- [ ] `docs/quickstart.md`：安装、认证、第一次会话、项目指令。
- [ ] `docs/usage.md`：交互、命令、消息队列、上下文文件、CLI 参数。
- [ ] `docs/providers.md`：认证类型、Provider 选择与解析顺序。
- [ ] `docs/models.md`：自定义模型与兼容 API 配置。
- [ ] `docs/settings.md`：全局/项目配置及覆盖关系。
- [ ] `docs/keybindings.md`：按键格式、动作和自定义绑定。
- [ ] `docs/sessions.md`：会话保存、恢复、分支、fork、clone。
- [ ] `docs/compaction.md`：压缩与分支摘要的触发和结果。
- [ ] `docs/security.md`：项目信任、无内置沙箱的边界。

阶段任务：不用写代码，配置一个安全、可恢复、能切模型的日常工作流。

## 阶段 2：Agent 最小形态（第一次读内核）

> 目的：在变成作者之前，先亲眼看见 pi 每轮在做什么。「模型无状态」「上下文就是整个数组」这两个事实，后面所有扩展知识都建立在它们之上。

- [ ] `lessons/0003-agent-loop.html`（已有课）：agent = while 循环 + messages 数组 + 模型调用 + 工具执行。
- [ ] `exercises/0001-agent-loop.mjs`：补全循环，假模型假工具已备好，`node` 直接跑。
- [ ] `packages/agent/README.md`：Message Flow、Event Flow、AgentMessage vs LLM Message。
- [ ] `packages/agent/src/agent-loop.ts` 的 `runLoop()`（第一遍，只读结构）：内外双层循环、工具批执行、事件 emit 点。
- [ ] `lessons/0004-tool-failures.html`（已有课）：工具的四种失败 = 一条消息回灌给模型。
- [ ] `exercises/0002-tool-failures.mjs`：把失败的三种情形各自包成 `isError` 结果。
- [ ] `reference/glossary.html`：把零散术语并入常用词（compaction、toolResult、StreamFn 等）。

阶段任务：在纸上默写 7 行最小循环；标注「工具结果 / 工具错误都要回灌 messages」；解释「模型是无状态的」与「为什么会有 compaction」。

## 阶段 3：理解四种定制资源

- [ ] `docs/prompt-templates.md`：模板位置、参数和加载规则。
- [ ] `docs/skills.md`：Skill 目录、frontmatter、渐进加载和校验。
- [ ] `docs/themes.md`：主题加载、token 和颜色格式。
- [ ] `theme/theme-schema.json`：主题配置的机器约束。
- [ ] `theme/dark.json`：完整深色主题实例。
- [ ] `theme/light.json`：与深色主题对照，只看差异。
- [ ] `docs/packages.md`：将扩展、Skill、模板和主题打成 Pi Package。
- [ ] `docs/extensions.md`：先通读 Quick Start、Events、API、Custom Tools、Custom UI；后续反复查。
- [ ] `examples/extensions/README.md`：扩展示例索引和运行方法。

阶段任务：说清 Template、Skill、Extension、Package 分别解决什么问题，以及何时用最小的那个（决策变量 = 触发机制：手动 / 模型按需 / 事件驱动）。

## 阶段 4：Extension 最小闭环

- [ ] `examples/extensions/hello.ts`：最小自定义工具和 TypeBox 参数。
- [ ] `examples/extensions/commands.ts`：注册命令。
- [ ] `examples/extensions/question.ts`：工具调用 UI，并把结果返回模型。
- [ ] `examples/extensions/tools.ts`：查看、切换工具及会话状态同步。
- [ ] `examples/extensions/dynamic-tools.ts`：运行期增加工具。
- [ ] `examples/extensions/tool-override.ts`：覆盖内置工具。
- [ ] `examples/extensions/truncated-tool.ts`：限制大输出。
- [ ] `examples/extensions/structured-output.ts`：结构化结果。
- [ ] `examples/extensions/bash-spawn-hook.ts`：拦截底层进程启动。
- [ ] `examples/extensions/built-in-tool-renderer.ts`：替换工具同时复用内置渲染器。
- [ ] `examples/extensions/minimal-mode.ts`：用最小工具集构造受限模式。
- [ ] `examples/extensions/reload-runtime.ts`：重载时保存/恢复运行状态。
- [ ] `examples/extensions/dynamic-resources/index.ts`：运行时发现资源。
- [ ] `examples/extensions/dynamic-resources/SKILL.md`：被动态发现的 Skill。
- [ ] `examples/extensions/dynamic-resources/dynamic.md`：被动态发现的文本资源。
- [ ] `examples/extensions/dynamic-resources/dynamic.json`：被动态发现的结构化资源。

阶段任务：写一个单文件扩展，只有一个命令和一个工具，不引入依赖。写完回看阶段 2：这个扩展的工具注册、`tool_call` 事件，分别落在最小循环的哪一步？

## 阶段 5：事件、输入、Prompt 与模型请求

- [ ] `examples/extensions/input-transform.ts`：同步输入改写。
- [ ] `examples/extensions/input-transform-streaming.ts`：运行中输入的处理。
- [ ] `examples/extensions/inline-bash.ts`：把特定输入变成动作。
- [ ] `examples/extensions/interactive-shell.ts`：接管用户 shell 行为。
- [ ] `examples/extensions/prompt-customizer.ts`：在 agent 启动前修改 prompt。
- [ ] `examples/extensions/pirate.ts`：命令状态与 prompt 修改联动。
- [ ] `examples/extensions/claude-rules.ts`：从文件加载附加规则。
- [ ] `examples/extensions/system-prompt-header.ts`：读取和展示最终 system prompt。
- [ ] `examples/extensions/preset.ts`：Flag、Shortcut、Command 和事件组合。
- [ ] `examples/extensions/provider-payload.ts`：Provider 请求前后观察/修改载荷。
- [ ] `examples/extensions/model-status.ts`：模型选择事件。
- [ ] `examples/extensions/kimi-deferred-tools.ts`：延迟工具及模型能力适配。
- [ ] 复盘（手搓线贯通）：`packages/agent/src/types.ts` 的 `StreamFn` 契约；对照 `agent-loop.ts` 的事件点，指出 input-transform、prompt-customizer、provider-payload 各自对应循环里哪个阶段。

阶段任务：画出 `input → before_agent_start → provider → tool → agent_end` 的事件顺序，并一一标注它们落在真实循环的哪一步。

## 阶段 6：安全与生命周期

- [ ] `examples/extensions/permission-gate.ts`：危险命令确认。
- [ ] `examples/extensions/protected-paths.ts`：保护敏感路径。
- [ ] `examples/extensions/project-trust.ts`：项目信任事件。
- [ ] `examples/extensions/confirm-destructive.ts`：切会话/fork 前确认。
- [ ] `examples/extensions/dirty-repo-guard.ts`：Git 脏工作区守卫。
- [ ] `examples/extensions/auto-commit-on-exit.ts`：退出生命周期动作。
- [ ] `examples/extensions/notify.ts`：任务结束通知。
- [ ] `examples/extensions/titlebar-spinner.ts`：启动、结束、关闭时清理资源。
- [ ] `examples/extensions/mac-system-theme.ts`：系统事件监听与销毁。
- [ ] `examples/extensions/file-trigger.ts`：文件监听与关闭清理。

阶段任务：找出每个示例的「必须清理的资源」和对应清理事件。呼应阶段 2：退出/中断在最小循环里是「唯一正常出口」之外的那几条路。

## 阶段 7：会话、消息、摘要与 Git

- [ ] `docs/session-format.md`：JSONL、树结构、消息类型、上下文构建。
- [ ] `examples/extensions/bookmark.ts`：自定义会话条目和回放。
- [ ] `examples/extensions/session-name.ts`：会话元数据。
- [ ] `examples/extensions/send-user-message.ts`：普通、steer、follow-up 消息。
- [ ] `examples/extensions/handoff.ts`：生成交接上下文。
- [ ] `examples/extensions/summarize.ts`：手动摘要。
- [ ] `examples/extensions/custom-compaction.ts`：覆盖压缩过程。
- [ ] `examples/extensions/trigger-compact.ts`：触发压缩。
- [ ] `examples/extensions/git-checkpoint.ts`：工具、turn、fork、结束事件组合。
- [ ] `examples/extensions/git-merge-and-resolve.ts`：结束后合并及冲突处理。
- [ ] `examples/extensions/todo.ts`：用自定义消息持久化并从会话树重建状态。
- [ ] 复盘（手搓线贯通）：`packages/agent/src/harness/compaction/` 的实现；session-format 讲的消息类型与阶段 2 的 messages 数组是什么关系。

阶段任务：从 JSONL 中手工判断当前分支，并解释为什么 UI 状态不能只放在内存里。

## 阶段 8：TUI 与自定义渲染

- [ ] `docs/tui.md`：组件、Focus、Overlay、键盘、宽度、失效与性能。
- [ ] `examples/extensions/custom-header.ts`：替换/恢复 Header。
- [ ] `examples/extensions/custom-footer.ts`：替换 Footer。
- [ ] `examples/extensions/status-line.ts`：状态行更新。
- [ ] `examples/extensions/widget-placement.ts`：Widget 布局。
- [ ] `examples/extensions/border-status-editor.ts`：自定义 Editor 边框状态。
- [ ] `examples/extensions/rainbow-editor.ts`：自定义 Editor 渲染。
- [ ] `examples/extensions/modal-editor.ts`：模态编辑器。
- [ ] `examples/extensions/entry-renderer.ts`：会话条目渲染。
- [ ] `examples/extensions/message-renderer.ts`：自定义消息渲染。
- [ ] `examples/extensions/hidden-thinking-label.ts`：thinking 展示状态。
- [ ] `examples/extensions/working-indicator.ts`：工作指示器。
- [ ] `examples/extensions/working-message-test.ts`：工作消息行为验证。
- [ ] `examples/extensions/overlay-test.ts`：Overlay 基础。
- [ ] `examples/extensions/overlay-qa-tests.ts`：Overlay 边界与布局用例。
- [ ] `examples/extensions/timed-confirm.ts`：带超时/中止的交互。
- [ ] `examples/extensions/qna.ts`：命令驱动的问答 UI。
- [ ] `examples/extensions/questionnaire.ts`：多问题表单工具。

阶段任务：做一个可关闭、可取消、终端变窄也不溢出的 Overlay。

## 阶段 9：SDK 嵌入（严格按编号）

- [ ] `docs/sdk.md`：Session、ResourceLoader、Manager 和运行方式总览。
- [ ] `examples/sdk/README.md`：示例地图与选项速查。
- [ ] `examples/sdk/01-minimal.ts`：默认会话。
- [ ] `examples/sdk/02-custom-model.ts`：模型与 thinking level。
- [ ] `examples/sdk/03-custom-prompt.ts`：覆盖/追加 system prompt。
- [ ] `examples/sdk/04-skills.ts`：发现、过滤、替换 Skills。
- [ ] `examples/sdk/05-tools.ts`：工具白名单、自定义工具和 cwd。
- [ ] `examples/sdk/06-extensions.ts`：以 factory 注入扩展。
- [ ] `examples/sdk/07-context-files.ts`：AGENTS.md 上下文加载。
- [ ] `examples/sdk/08-prompt-templates.ts`：模板资源加载。
- [ ] `examples/sdk/09-api-keys-and-oauth.ts`：认证来源和运行时 Key。
- [ ] `examples/sdk/10-settings.ts`：内存设置与覆盖。
- [ ] `examples/sdk/11-sessions.ts`：内存、持久化、继续和列举会话。
- [ ] `examples/sdk/12-full-control.ts`：关闭自动发现，完全显式装配。
- [ ] `examples/sdk/13-session-runtime.ts`：cwd 切换时重建服务和会话。

阶段任务：用 SDK 写一个最小只读 Agent；先不要做 UI、Provider 或持久化抽象。写完回答：`createAgentSession()` 与阶段 2 的 `runLoop()` 是什么关系（同一个循环的托管入口）？

## 阶段 10：RPC 与机器可读输出

- [ ] `docs/json.md`：一次性 JSON 事件流。
- [ ] `docs/rpc.md`：JSONL framing、命令、事件、错误和 UI 协议。
- [ ] `examples/rpc-extension-ui.ts`：RPC 客户端如何承接 Extension UI。
- [ ] `examples/extensions/rpc-demo.ts`：从扩展侧触发各种 RPC UI 事件。

阶段任务：实现最小客户端，只支持 `prompt`、事件打印和 `abort`。

## 阶段 11：外部依赖、沙箱与 Provider

- [ ] `docs/custom-provider.md`：注册/覆盖 Provider、OAuth、流式 API。
- [ ] `examples/extensions/custom-provider-anthropic/package.json`：最小 Provider 示例依赖。
- [ ] `examples/extensions/custom-provider-anthropic/index.ts`：自定义 Anthropic Provider。
- [ ] `examples/extensions/custom-provider-gitlab-duo/package.json`：GitLab Duo 示例依赖。
- [ ] `examples/extensions/custom-provider-gitlab-duo/index.ts`：OAuth 与自定义 Provider。
- [ ] `examples/extensions/custom-provider-gitlab-duo/test.ts`：Provider 最小验证。
- [ ] `examples/extensions/with-deps/package.json`：扩展自带依赖。
- [ ] `examples/extensions/with-deps/index.ts`：使用扩展局部依赖。
- [ ] `docs/containerization.md`：Gondolin、Docker、OpenShell 的取舍。
- [ ] `examples/extensions/sandbox/package.json`：沙箱依赖边界。
- [ ] `examples/extensions/sandbox/index.ts`：在沙箱中替换工具。
- [ ] `examples/extensions/gondolin/package.json`：Gondolin 依赖。
- [ ] `examples/extensions/gondolin/index.ts`：容器生命周期及工具代理。
- [ ] `examples/extensions/ssh.ts`：远端 cwd、工具和 prompt 重写。
- [ ] `examples/extensions/github-issue-autocomplete.ts`：外部 CLI 与输入补全。

阶段任务：比较「本机权限门」「进程沙箱」「容器」「SSH」四种边界。旁记：阶段 2 手搓循环里的「工具执行」在真实 pi 里可以被替换成任意这些后端——这就是扩展层能做的最大一件事。

## 阶段 12：复杂组合示例（最后读）

- [ ] `examples/extensions/plan-mode/README.md`：状态机需求和用法。
- [ ] `examples/extensions/plan-mode/utils.ts`：计划解析/格式化纯函数。
- [ ] `examples/extensions/plan-mode/index.ts`：Flag、命令、快捷键、工具门禁、上下文和状态持久化。
- [ ] `examples/extensions/subagent/README.md`：子 Agent 的行为和限制。
- [ ] `examples/extensions/subagent/agents.ts`：Agent 配置发现与解析。
- [ ] `examples/extensions/subagent/index.ts`：工具、并发、进程和结果汇总。
- [ ] `examples/extensions/subagent/agents/worker.md`：Worker 角色提示词。
- [ ] `examples/extensions/subagent/agents/scout.md`：Scout 角色提示词。
- [ ] `examples/extensions/subagent/agents/planner.md`：Planner 角色提示词。
- [ ] `examples/extensions/subagent/agents/reviewer.md`：Reviewer 角色提示词。
- [ ] `examples/extensions/subagent/prompts/scout-and-plan.md`：侦察规划流程。
- [ ] `examples/extensions/subagent/prompts/implement.md`：实现流程。
- [ ] `examples/extensions/subagent/prompts/implement-and-review.md`：实现加审查流程。
- [ ] `examples/extensions/tic-tac-toe.ts`：持久状态、消息渲染、命令和工具的完整组合。
- [ ] `examples/extensions/event-bus.ts`：扩展之间通信。
- [ ] `examples/extensions/shutdown-command.ts`：关闭请求与可取消操作。

阶段任务：任选一个复杂示例，删到只剩满足一个真实需求的最小版本，并说明删掉了什么。

## 阶段 13：可选 UI/娱乐案例

这些文件不影响掌握 Pi；只有要练 TUI 时再读。

- [ ] `examples/extensions/snake.ts`：实时键盘与游戏循环。
- [ ] `examples/extensions/space-invaders.ts`：更复杂的实时状态和绘制。
- [ ] `examples/extensions/doom-overlay/README.md`：WASM Doom 集成说明。
- [ ] `examples/extensions/doom-overlay/index.ts`：Overlay 入口。
- [ ] `examples/extensions/doom-overlay/doom-component.ts`：TUI 组件桥接。
- [ ] `examples/extensions/doom-overlay/doom-engine.ts`：WASM 引擎桥接。
- [ ] `examples/extensions/doom-overlay/doom-keys.ts`：按键映射。
- [ ] `examples/extensions/doom-overlay/wad-finder.ts`：资源发现。
- [ ] `examples/extensions/doom-overlay/doom/doomgeneric_pi.c`：WASM 宿主接口。
- [ ] `examples/extensions/doom-overlay/doom/build.sh`：构建脚本。

## 阶段 14：平台与维护参考（按需，不必顺序学）

- [ ] `docs/windows.md`：Windows shell 配置。
- [ ] `docs/termux.md`：Android/Termux 环境。
- [ ] `docs/tmux.md`：tmux 键盘协议。
- [ ] `docs/terminal-setup.md`：各终端键盘设置。
- [ ] `docs/shell-aliases.md`：shell alias。
- [ ] `docs/llama-cpp.md`：本地模型路由。
- [ ] `docs/environment-variables.md`：进程和 shell 环境变量。
- [ ] `docs/development.md`：完整源码仓库的开发、测试和目录结构。
- [ ] `docs/docs.json`：官网文档导航配置，不属于运行时逻辑。

## 阶段 15：手搓 agent 毕业任务（主线终点）

> 此时你已：见过最小循环（阶段 2）、会写扩展拦截循环各环节（阶段 4–8）、会用 SDK 托管同一个循环（阶段 9–10）、懂得工具执行的替换边界（阶段 11）。毕业任务把全部知识放回「从零写一个 agent」。

目标：**不 import pi、不 import 任何 agent 框架**，用 ≤150 行 TypeScript 写出一个 CLI agent：

- 结构：messages 数组 + while 循环 + 模型调用 + 工具执行（阶段 2 的 7 行骨架）。
- 必须正确处理四种真实情况：工具不存在、参数不合法、工具抛错（都包成 `isError` 消息回灌）、上下文超长（自己做截断或简单压缩）。
- 支持流式输出与简单事件 emit（对照阶段 5 的 `StreamFn` 契约，不用照搬）。
- 支持用户中断（Ctrl+C）作为循环出口（呼应阶段 6）。

做法与验收：

1. 先用假模型跑通（`packages/ai/src/providers/faux.ts` 的 fauxText / fauxToolCall 思路，或自带 stub），自动判定脚本参照 `exercises/0001`、`0002` 的写法。
2. 再换真实模型 API（任选：Anthropic / OpenAI 兼容 / llama.cpp 本地路由），跑通两条工具调用链。
3. 交付时写 1 页说明：哪些地方直接抄了 pi 的理解、哪些地方故意做得比 pi 简单、哪些地方是需要 pi 这种规模的工程才有的（对照 `agent-loop.ts` 的每一步保护）。
4. 结论段回答 MISSION 的核心题：**这个能力该放扩展层还是核心层？**——用你自己写的那版做对照。

完成即达成 MISSION Success 前四条（二次开发）与后四条（手搓 agent）的全部目标。

## 明确跳过：不是学习源码

> 本节按发布包目录结构书写；在 monorepo 中这些产物多数不存在于 `packages/coding-agent/` 根下（它们由构建生成或随发布包附带）。原则不变：二进制与生成物一律不学，要学实现去读 `src/` 对应 TypeScript。

- `pi.exe`：编译后的可执行文件（发布包才有）。
- `photon_rs_bg.wasm`：第三方图像处理 WASM。
- `native/win32/prebuilds/win32-x64/win32-console-mode.node`：原生二进制模块。
- `assets/clankolas.png`、`docs/images/*`：图片资源。
- `examples/extensions/**/package-lock.json`：依赖锁文件，排错或审计时再看。
- `examples/extensions/doom-overlay/doom/build/doom.js`、`doom.wasm`：生成物。
- `export-html/*.map`、`export-html/*.d.ts`、`export-html/*.d.ts.map`：生成物。
- `export-html/vendor/*`：第三方压缩库。
- `export-html/index.js`、`ansi-to-html.js`、`tool-renderer.js`：编译产物；要学实现应去完整源码读对应 TypeScript。
- `export-html/template.html`、`template.css`、`template.js`：只有定制导出 HTML 时才读，不进入主路线。在 monorepo 中对应实现在 `src/` 的导出模块里。

## 进入内核源码学习的条件

主线完成后，若要深入 `packages/coding-agent/` 的内核（CLI 入口、模式分发、AgentSession、SessionManager、ResourceLoader、Extension runner、TUI），直接进本地 `src/`。手搓线在阶段 2 和 5、7、15 已按主题读过 `packages/agent/` 的循环与压缩；毕业后可继续读 `packages/ai/`（Provider、模型能力元数据）作为下一步。