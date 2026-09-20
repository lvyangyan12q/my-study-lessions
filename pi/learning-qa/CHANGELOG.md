# `CHANGELOG.md` 学习问答

状态：~~第一轮进行中~~ → **2026-09-15 改为「教师直接讲解，未考核」**（用户表示尚未开始学，不熟悉这些特性，主动要求先给答案）。标准答案与讲解见下方；后续安排角度不同的复测，用户未完成复测前不得关闭本课。

> 说明：本课只读 `packages/coding-agent/CHANGELOG.md` 的开头三个版本：0.82.1、0.82.0、0.81.1。目标是认识功能演进与改动分类，不背条目。
>
> 中英对照参考（同范围，逐条英文原文 + 中文译文）：[`../reference/changelog-bilingual.html`](../reference/changelog-bilingual.html)

## 第一轮

### 问题 1：概念

列出 0.82.1、0.82.0、0.81.1 各自「New Features」小节中的一条改动。CHANGELOG 的条目按什么分类组织（看小节标题）？其中哪一类与二次开发（扩展作者）最直接相关，为什么？

#### 我的回答

<!-- 未作答：教师直接给出标准答案与讲解（2026-09-15），见下方「标准答案与讲解」节。 -->

#### 批改

（未考核）

### 问题 2：执行流程

场景：你写的扩展在终端里自定义渲染消息。同事升级到 0.82.1 后反馈：你的消息和官方消息的上下留白对不齐。从 CHANGELOG 出发定位：(a) 哪条改动与此相关（写出改动名）？(b) 它解决什么痛点？(c) 你的修复步骤是什么（不用写代码，说清先查什么、再改什么）？

#### 我的回答

<!-- 未作答 -->

#### 批改

（未考核）

### 问题 3：最小修改

0.81.1 新增「Verifiable release source archives」：GitHub releases 附带确定性、带校验和的源码归档及独立二进制重建说明。回答：

(a) 用第一课（`package.json`）的知识解释：为什么安装后的 pi 目录里找不到 `dist/bun/cli.js` 这个编译入口文件？

(b) 同事想验证他手上的 pi 是否官方构建，CHANGELOG 这条给出的途径是什么？

#### 我的回答

<!-- 未作答 -->

#### 批改

（未考核）

### 问题 4：概念（回带）

0.81.1 新增了可验证的发布源码归档。用第一课（`package.json`）的知识回答：`exports` 字段在 Node 解析时扮演什么角色？用一句话说明它的白名单语义；并说明如果把某条 `exports` 的值写成包名（而不是以 `./` 开头的包内路径）会发生什么。

#### 我的回答

<!-- 未作答 -->

#### 批改

（未考核）

---

## 标准答案与讲解（教师直接给出，2026-09-15，未考核）

> 用户尚未开始学习，不熟悉这些特性，主动要求先给答案。以下为每题的标准答案与推理链。后续复测将更换问法。

### 问题 1

- 0.82.1 New Features 任选一条：**Claude Opus 5**（Anthropic / Bedrock 新增模型，支持 adaptive thinking 含 `xhigh`、inference profiles、prompt caching）。
- 0.82.0 New Features 任选一条：**Constrained tool sampling（受限工具采样）**——工具可要求严格 JSON Schema 或 OpenAI Lark/正则文法输出；此外还有 OpenRouter / Kimi Code `/login` 登录、会话感知的流式 bash 集成。
- 0.81.1 New Features 任选一条：**Verifiable release source archives（可验证发布源码归档）**；此外还有 Resilient compaction and branch summaries。
- 分类组织：条目按**改动性质**分四个小节 `New Features`（头条能力）/ `Added`（新增 API、字段、事件）/ `Changed`（既有行为变更）/ `Fixed`（错误修复）。
- 与扩展作者最直接相关：**`Added`**。新增的 API、事件与字段都集中在这里（0.82.1 的 `outputPad`、0.82.0 的 `Tool.constrainedSampling` 与 `bash_execution_update` 流事件、暴露给 bash 工具的 `PI_*` 环境变量），是扩展能用到的新能力的清单。`Changed` 次之——它可能破坏既有扩展的兼容性，升级前要扫。

### 问题 2

场景：自定义消息渲染器与官方消息的留白对不齐。

(a) 对应改动：**"Exposed the `outputPad` setting to custom message renderers"**（#7045，@xl0）。
(b) 痛点：自定义渲染器此前拿不到留白设置，只能写死值，所以与内置渲染不一致。修复后自定义渲染器的 `MessageRenderOptions` 里多了一个 `outputPad: number` 字段（源码证据：`packages/coding-agent/src/core/extensions/types.ts` 约 1131 行）；interactive 模式启动时从 `settingsManager.getOutputPad()` 读取（默认 1）。
(c) 修复步骤：① 查 0.82.1 的 Added 小节定位改动名；② 查 `docs/extensions.md` 消息渲染器一节（或直接看 `types.ts` 的 `MessageRenderOptions`）确认新字段；③ 在自己的渲染器里使用 `options.outputPad`（把留白对齐到官方值），而不是写死常量；④ 实测对齐。

### 问题 3

(a) 找不到 `dist/bun/cli.js` 的原因：该文件是**构建中间产物**。发布时用 `bun build --compile` 把所有 JS 代码**嵌进 `pi.exe` 二进制**（学习记录 0002：二进制嵌入代码，运行时按路径读数据）；安装目录里只放运行时按需读取的数据资源（主题、文档、示例、WASM）。所以安装后目录里**没有 `.js` 源码文件可找**。在 monorepo 中 `dist/` 更是只在构建时生成，源码树的 `packages/coding-agent/` 下根本不存在。
(b) 验证途径：利用 0.81.1 新增的**确定性、带校验和的源码归档**——从对应版本的 GitHub release 下载 source archive，先校验 checksum 与官方一致；再按其附的「重建独立二进制」说明从源码重新构建；由于构建是确定性的（deterministic），重建结果应与官方发布的二进制 hash 一致，从而证明手上这份就是官方构建。

### 问题 4

- `exports` 的角色：包对外**可导入子路径的白名单映射**（子路径 → 包内文件路径）。只有列在 `exports` 里的子路径能被外部 `import` / `require`，没列的一律报 "Package subpath is not defined by exports"。
- 值写成包名（或以其他不以 `./` 开头的东西）：Node 直接抛 `ERR_INVALID_PACKAGE_TARGET`（错误原文：`targets must start with "./"`），写自己的包名（自引用）同样报错。已在本机 Node v22.20.0 实测。正确写法：`"./foo": "./dist/foo.js"`。

## 生词速查（本课三个版本出现的主要术语）

- **adaptive thinking / `xhigh`**：模型「思考」投入的等级；Opus 5 新增最高档 `xhigh`。
- **inference profiles**：Bedrock 的推理配置组合（模型路由 / 参数预设）。
- **prompt caching**：缓存 system prompt、工具定义等稳定前缀，降低延迟与成本。
- **`If-None-Match` / `304`**：HTTP 条件请求；内容未变化时服务端返回空的 304，客户端沿用本地缓存，省下载。
- **compaction / branch summaries**：上下文超预算时，把历史压缩成摘要；分叉分支各自保留摘要；provider 瞬时故障按重试策略重试，重试生命周期事件对 interactive/JSON/RPC/SDK 四类消费方开放。
- **constrained sampling**：让工具输出受严格 JSON Schema 或文法约束（比「请求模型尽量遵守」更硬）；配套 `supportsGrammarTools` / `supportsStrictTools` 能力标志，防止向不支持的模型发请求。
- **OAuth PKCE / device authorization**：CLI 登录流程；`/login` 授权 OpenRouter（PKCE）或 Kimi Code（设备授权 + 自动刷新令牌）。
- **deterministic, checksummed source archives**：同源码、同配置必然产出同 hash 的构建产物，可据此验证官方二进制。
- **inherited**：改动来自上游 `pi-ai` 包（模型 / Provider 层）的同步，不是 `coding-agent` 自身写的代码，但会改变可观察行为。
- **scoped model**：带作用域的模型 ID（如 `provider:model`）。
- **`EISDIR`**：把目录当文件读时的 I/O 错误；0.82.1 修复了上下文发现把名为 `AGENTS.md` 的目录当文件读的问题。
- **pre-0.81 agent-core API 的 stream fallback**：0.81.1 给仍用旧版扩展 API 的扩展恢复了默认流回退——说明扩展 API 存在兼容层，升级后旧扩展可能仍被兼容。