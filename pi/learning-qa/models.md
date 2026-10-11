# `docs/models.md` 学习问答

状态：**未考核（2026-10-03 教师直接给答案）**——用户要求「这种直接写答案，我有时间看」。标准答案与讲解见下，后续可换问法复测。

> 说明：本课对应 `packages/coding-agent/docs/models.md`（选连接方式、选模型、`models.json`、分类/图像模型）。配套课 `lessons/0009-models.html`，中英对照 `reference/models-bilingual.html`。

## 问题与标准答案

### 问题 1：概念

按「你手里有什么」列出五种连接方式（各配推荐做法）。

**标准答案**

1. 受支持的**订阅** → 用 `/login` 登录。
2. provider 的 **API key** → 用 `/login` 存，或设它的环境变量。
3. 本地 **GGUF 模型** → 接 llama.cpp router。
4. OpenAI / Anthropic / Google **兼容端点** → 写进 `models.json`。
5. 自定义协议 / 认证流程 → 写或装 **provider 扩展**。

原则：**能用内置就别写配置**；只有 Pi 不认识你的 endpoint 时才进第 4 / 5 条。

### 问题 2：执行流程

本地 Ollama 跑 `qwen2.5-coder:7b`。
(a) 写最小 `models.json`；(b) 为什么 `"apiKey": "ollama"`；(c) 打开 `/model` 会发生什么。

**标准答案**

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "models": [ { "id": "qwen2.5-coder:7b" } ]
    }
  }
}
```

- (b) `"ollama"` 是**占位 key**：它的作用只是让模型对 Pi 可见（Pi 认为该 provider 认证可用），Ollama 本身不检查它。真正需要认证的端点，`apiKey` 可写环境插值 `$NAME` / `${NAME}`、字面值，或以 `!` 开头的命令。
- (c) 打开 `/model` 会**重新加载该文件**：`models` 条目增/替同 ID 模型；`modelOverrides` 只改元数据、不替换整个列表，未知 ID 被忽略。
- 补充差异：`models.json` 里的 `!command` 在**请求时执行、不被缓存**；`auth.json` 里的 `!command` 会被缓存到进程结束。

### 问题 3：最小修改 / 机制

分类模型（如 `jev`）为什么不显示在 `/model`？怎么让模型访问到它？

**标准答案**

- 分类模型**不聊天**，只对 JSON 状态回答选择题 / 是非题 / 打分题（带概率），所以不放进聊天模型选择器。
- 访问路径：模型通过 **`codemode` 工具**访问；该工具默认关闭，用 settings 的 `"defaultTools": ["+codemode"]` 打开。脚本里用 `models.getModelOfType("classifier", ...)` / `models.classify(model, { state, questions })`。
- 扩展不走 codemode，直接用 `ctx.modelRegistry.classify()`。
- 顺带：图像模型同理（不在 `/model`，经 `codemode` 的 `models.generateImages`）；分类模型的用量会计入会话花费。

## 间隔复测（后续混入，不预告）

- 五种连接方式的判断。
- `models.json` 里的命令不缓存、`auth.json` 里的命令缓存——这一对差异。
