# `docs/settings.md` 知识点（未考核）

> 2026-10-03 起，`docs/` 用户文档不再逐篇出课；这里直接给知识点与考点。源文件：`packages/coding-agent/docs/settings.md`。

## 一、覆盖关系（最该记住的一条）
- **项目设置覆盖 agent 目录（用户）设置**；但**资源列表是合并**，不是替换。
- 只有少数项**只能在 agent 目录设置**：`defaultProjectTrust`、`httpProxy`。`cacheWarming` 只能全局。

## 二、模型与思考
- `defaultProvider` / `defaultModel` 默认自动；`defaultThinkingLevel` 默认 `"medium"`（可选 off/minimal/low/medium/high/xhigh/max）。
- `enabledModels`：启动选择与模型循环用的模型模式（格式同 `--models`）。

## 三、工具（`defaultTools`）
- 默认：`read`、`bash`、`edit`、`write`。内置可用还有 `powershell`、`grep`、`find`、`ls`。
- 语法：**纯名替换**默认；`+name` 加、`-name` 减。空数组禁用所有内置工具（不禁扩展/SDK 工具）。
- 项目设置叠在用户设置之上：只含 `+`/`-` 的列表**改**用户选择；含纯名的列表**替换**。
- `/reload` 只**启用新增**的工具；不关闭被移除的、也不重新启用你手动关掉的。

## 四、会话与压缩
- `sessionDir`：会话存储目录（相对路径从工作目录解析）。
- `compaction.enabled`(true) / `reserveTokens`(16384) / `keepRecentTokens`(20000) / `modelOverrides`。
- 解析：**每个值各自独立回退**——模型覆盖 → 普通设置 → 内置默认；项目与用户对象先合并再做模型查找。
- `branchSummary.reserveTokens`(16384) / `skipPrompt`(false)。

## 五、资源
- `packages` / `extensions` / `skills` / `prompts` / `themes`；`enableSkillCommands`(true)。
- 路径解析：**用户设置从 agent 目录**，**项目设置从 `.pi/`**；支持绝对路径与 `~`。
- 数组语法：`!pattern` 排除、`+path` 精确包含、`-path` 精确排除；用户与项目两处的资源都会加载。
- 内置扩展名：`builtin:mcp`、`builtin:llama.cpp`、`builtin:codemode`、`builtin:tool-search`（默认加载，可用 `-builtin:mcp` 关）。

## 六、网络与重试（速记）
- `transport` 默认 auto；`httpIdleTimeoutMs` 默认 300000。
- `retry.maxRetries`(3) 是 **agent 级**；**`retry.provider.maxRetries` 默认 0，保持 0**（否则会拖慢配额/用量错误的处理）。

## 考点（自查）
1. 项目设置和用户设置，谁会覆盖谁？资源列表呢？
2. `defaultTools` 里 `+name` / `-name` / 纯名各是什么语义？空数组呢？`/reload` 的边界？
3. `compaction` 的模型覆盖、普通设置、内置默认，三者怎么回退？
