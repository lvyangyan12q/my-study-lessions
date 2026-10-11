# `docs/providers.md` 学习问答

状态：**未考核（2026-10-03 教师直接给答案）**——用户要求「这种直接写答案，我有时间看」。标准答案与讲解见下，后续可换问法复测。

> 说明：本课对应 `packages/coding-agent/docs/providers.md`（认证方式与 provider 专属配置），核心的**凭据解析顺序**原文在 `models.md`。配套课 `lessons/0008-providers.html`，中英对照 `reference/providers-bilingual.html`。

## 问题与标准答案

### 问题 1：概念

(a) Pi 的**凭据解析顺序**（从高到低，四级）。
(b) 存下的 API-key 凭据里的 `env` 对象，和进程环境谁优先？

**标准答案**

- (a) 从高到低：① 运行时 `--api-key` → ② `auth.json` 里存下的凭据 → ③ `models.json` 里的 `apiKey` → ④ provider 的环境变量 / 云端 ambient 凭据。**第一个命中的胜出。**（原文在 `docs/models.md`，不在 providers.md）
- (b) 凭据的 `env` 对象**优先于进程环境**（对该 provider 而言）。例：把 `CLOUDFLARE_ACCOUNT_ID` 放进凭据的 `env`，就盖过 shell 里的同名变量。

### 问题 2：执行流程（场景判断）

`export ANTHROPIC_API_KEY=...`，同时 `auth.json` 存着一份 Anthropic OAuth 凭据。
(a) 用哪个？(b) 无头服务器 OAuth 回调回不来，怎么办？

**标准答案**

- (a) 用 **`auth.json` 里的 OAuth 凭据**。判断过程：没有运行时 `--api-key` → 查 `auth.json`，命中 OAuth 凭据 → 就用它；环境变量属于第 4 级，**优先级低于已存凭据**，轮不到。（这就是为什么「我设了环境变量它却不用」的排错点在这里。）
- (b) 按提示把**最终重定向 URL 或授权码**粘回 Pi，完成 headless 认证。

### 问题 3：最小修改

不想把密钥写进磁盘，想用系统密钥管理器。
(a) 最小配置；(b) 命令何时执行、失败怎样；(c) `/logout` 后还生效吗？

**标准答案**

- (a) 改 `auth.json`，把某 provider 的 `key` 写成一个以 `!` 开头的命令：
  ```json
  { "anthropic": { "type": "api_key", "key": "!security find-generic-password -ws 'anthropic'" } }
  ```
- (b) Pi 在**首次需要该 key 时**执行命令，并把标准输出缓存到进程结束。**空输出 / 超时 / 非零退出 → key 保持未解析，直到重启。**
- (c) **不再生效**。这条凭据本身就存在 `auth.json` 里，而 `/logout` 会移除该 provider 已存的凭据（连同这条命令）。注意 `/logout` 的边界：它**不会**取消环境变量、**不会**删 `models.json` 里的认证、**也不会**在 provider 处吊销——但这里被删的正是 `auth.json` 条目本身。

## 间隔复测（后续混入，不预告）

- 凭据解析四级顺序（尤其「环境变量排在最后」）。
- `/logout` 删了什么、没删什么。
