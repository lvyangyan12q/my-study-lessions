# `docs/quickstart.md` 学习问答

状态：**已通过并关闭（2026-10-03）**。按用户要求：安装方式 / 工作目录 / `--continue` 这类操作性细节不再出题；本课只取与使命相关的「定制选型器」判断（已在 `docs-index` 强化题中验证）。

> 说明：本课对应 `packages/coding-agent/docs/quickstart.md`——快速上手全文（安装 / 启动 / 选模型 / 给任务 / 继续 / 定制选型器）。这是阶段 1 第二篇。配套课 `lessons/0006-quickstart.html`，中英对照 `reference/quickstart-bilingual.html`。
>
> 答题要求：推理类题目要写出判断过程（「先…再…所以…」），只贴原文不计分。

## 第一轮

### 问题 1：概念

(a) quickstart 把 **model** 和 **provider** 分别定义成什么？
(b) 三种安装方式各是什么？各自对依赖的处理 / 更新方式有什么关键差别？
(c) 「工作目录（working folder）」在启动这一步起什么作用？（写出 quickstart 提到的用途）

#### 我的回答

model（模型）负责生成 Pi 的回答；provider（提供方）是 Pi 用来访问该模型的服务或账号
#### 批改

**部分正确（只答了 a）。**

- **(a) 对。**
- **(b) 未答。** 三种安装方式：
  - 安装脚本（macOS / Linux）：`curl -fsSL https://pi.dev/install.sh | sh`；**锁定全部依赖**，用 `pi update` 更新。
  - npm：`npm install -g --ignore-scripts @earendil-works/pi-coding-agent`；需 **Node.js 22.19+**，**不锁定传递依赖**。
  - Nix：`nix profile add github:earendil-works/pi/stable`；**从源码构建**，`pi update` 管不了，用 `nix profile upgrade pi`。
- **(c) 未答。** 工作目录的两个作用：帮助 Pi **发现相关文件、指令、配置**；并用它给**保存的会话分组**。

### 问题 2：执行流程

场景：在一台全新机器上，从零到「让 Pi 总结 `@meeting-notes.md` 并把 action items 存进 `action-items.md`」，然后退出；第二天在同一目录继续上次会话。

(a) 写出完整的命令 / 输入顺序（从安装到第二天继续），并说明每一步为什么需要。
(b) `pi --continue` 为什么能恢复到这个会话？它靠什么来确定「是同一个会话」？
(c) 编辑器里什么符号能替代手写完整文件路径？

#### 我的回答

a）pi --continue 
b）Pi 会自动保存会话。退出 Pi 后，在同一工作目录下用下面的命令恢复最近一次会话
靠sessionid
c)@
#### 批改

**只对了一小半。**

- **(a) 未答。** 完整顺序：① `curl -fsSL https://pi.dev/install.sh | sh` 安装 → `pi --version` 验证；② `cd /path/to/folder` + `pi` 启动（工作目录定上下文）；③ `/login` 选 provider 并认证（没模型无法干活）；④ 输入任务 `Summarize @meeting-notes.md and save the action items to action-items.md.`；⑤ 退出（会话自动保存）；⑥ 回到**同一目录** `pi --continue`。
- **(b) 判断错。** 你写「靠 sessionid」——不对。quickstart 说的是 Pi 用**工作目录**给保存的会话分组；`pi --continue` 恢复的是「**同一工作目录**下最近一次会话」。确定因素 = 工作目录（+「最近」），不是 session id。
- **(c) 对。** `@` 可以搜文件。

### 问题 3：最小修改（选型器）

团队提两个需求：

- 需求 A：想让 Pi 在这个仓库里工作时，始终遵守一份固定的编码规范（`coding-rules.md`）。
- 需求 B：想在编辑器输入 `/standup`，展开一段固定的站会汇报提示词。

(a) A、B 分别该用「定制选型器」里的哪个机制？（写机制名 + 放置位置 / 文件名）
(b) 各自**为什么不用**更重的机制？（A 为什么不用 Skill/Extension？B 为什么不用 Skill？）

#### 我的回答

agents.md,给某文件夹常驻指令
Prompt template从 / 菜单复用一段提示词
不需要
#### 批改

**(a) 对，(b) 未答。**

- **(a) 对。** A → **AGENTS.md**（context file，给某文件夹的常驻指令）；B → **Prompt template**（放 `~/.pi/agent/prompts/` 或 `.pi/prompts/`，如 `standup.md`，输入 `/standup` 展开）。
- **(b) 未答（这正是选型器的重点）。**
  - A 为什么不用 Skill/Extension：Skill 是「**模型判断需要时才加载**的能力包」，不是「无条件常驻规则」；Extension 是代码，用来加工具 / 事件，属于杀鸡用牛刀。常驻规则最轻的机制就是 context file。
  - B 为什么不用 Skill：`/standup` 只是「**用户手动**展开一段固定文本」，没有过程性知识、不需要模型判断何时加载；模板最轻。Skill 要 frontmatter、由模型按需加载、占上下文。

## 强化练习（已取消）

> 2026-10-03 用户要求：安装方式、工作目录、`--continue` 这类操作性细节不必出题。以下题目作废、保留备查。

> ~~只练本轮薄弱点：安装方式、工作目录与 --continue、选型器的「为什么不用更重的」。~~

### 强化题 1：安装 + 工作目录

(a) 三种安装方式各是什么？依赖锁定 / 更新方式的关键差别是什么？
(b) 工作目录起什么作用？`pi --continue` 靠什么确定「是同一个会话」？

#### 我的回答

<!-- 在这里填写 -->

#### 批改

（待作答）

### 强化题 2：选型器推理链

用「触发机制」解释两句：

(a) 为什么「仓库常驻编码规范」用 `AGENTS.md`，而不是 Skill 或 Extension？
(b) 为什么 `/standup` 用 Prompt template，而不是 Skill？

#### 我的回答

<!-- 在这里填写 -->

#### 批改

（待作答）
