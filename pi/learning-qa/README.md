# `README.md` 学习问答

状态：**已通过并关闭（2026-09-11）**

> 说明：本课对应的源文件是 `packages/coding-agent/README.md`（「四种运行模式 + 定制阶梯 + Philosophy」那一篇），不是仓库根目录的 monorepo 总览 README。

## 第一轮

### 问题 1：概念

README 把 Pi 定位为什么？默认给模型哪四个工具？四种运行模式各自的入口是什么、分别适合谁用？

#### 我的回答

Pi 是一个极简的终端编程助手（coding harness）；
用 TypeScript 扩展（Extensions）、技能（Skills）、提示词模板（Prompt Templates） 和 主题（Themes）
交互模式、打印/JSON 模式、用于进程集成的 RPC 模式分别适合窗口对话，代码程序调用，其他agent或者mcp调用
#### 批改

**部分正确。**

- 定位：正确。README 原文 "minimal terminal coding harness"（极简终端编程助手），以 Extensions / Skills / Prompt Templates / Themes 扩展，不必 fork 内核。
- 默认四个工具：**未答**。答案：`read`、`write`、`edit`、`bash`。
- 运行模式：你只列了三种，**漏了第四种 SDK**。完整对照（入口 → 适合谁）：
  - 交互模式：`pi`（默认，无 flag）→ 人坐在终端里边聊边干活。
  - 打印模式：`pi -p "..."` → 一次性输出后退出，适合脚本/CI；可读管道 stdin（`cat README.md | pi -p "Summarize"`）。
  - JSON 模式：`pi --mode json` → 所有事件以 JSON 行输出，适合程序消费。
  - RPC 模式：`pi --mode rpc` → stdin/stdout 上 LF 分隔的 JSONL 协议，README 明确说是给 **非 Node.js 集成**用的。
  - SDK：`import { createAgentSession } from "@earendil-works/pi-coding-agent"` → 把 Pi 嵌进你自己的 TypeScript 应用。
- 「适合谁」的对应方向大体对，但 RPC 的准确措辞是「非 Node.js 进程集成」，不只是"其他 agent 或 MCP 调用"。

### 问题 2：执行流程

写出定制阶梯从轻到重的几层（含各自触发方式和放置位置要点）。接到需求「每次会话结束自动 `git commit`」，你按什么顺序判断它落在哪一层？最终落在哪一层、为什么这是最小选择？

#### 我的回答

以 Markdown 文件形式保存的可复用提示词。输入 /name 展开。

 ```markdown
   <!-- ~/.pi/agent/prompts/review.md -->
   Review this code for bugs, security issues, and performance problems.
   Focus on: {{focus}}
 ```

 放在 ~/.pi/agent/prompts/、.pi/prompts/
 ### 技能

 遵循 Agent Skills 标准 的按需能力包。通过 /skill:name 调用，或让助手自动加载。

 ```markdown
   <!-- ~/.pi/agent/skills/my-skill/SKILL.md -->
   # My Skill
   Use this skill when the user asks about X.

   ## Steps
   1. Do this
   2. Then that
 ```

 放在 ~/.pi/agent/skills/、~/.agents/skills/、.pi/skills/ 或 .agents/skills/（
  ### 扩展

 用 TypeScript 模块扩展 Pi，可实现自定义工具、命令、键盘快捷键、事件处理器和 UI 组件。

 ```typescript
   export default function (pi: ExtensionAPI) {
     pi.registerTool({ name: "deploy", ... });
     pi.registerCommand("stats", { ... });
     pi.on("tool_call", async (event, ctx) => { ... });
   }
 ```

 默认导出也可以是 async 的。Pi 会等待异步扩展工厂完成后再继续启动，这适用于一次性初始化，例如在调用
 pi.registerProvider() 之前先拉取远程模型列表。

 可以做什么：
 - 自定义工具（或完全替换内置工具）
 - 子代理和计划模式
 - 自定义压缩和总结
 - 权限门控和路径保护
 - 自定义编辑器和 UI 组件
 - 状态栏、头部、底部栏
 - Git 检查点和自动提交
 - SSH 和沙箱执行
 - MCP 服务器集成
 - 让 Pi 长得像 Claude Code
 - 等待时玩游戏（是的，能跑 Doom）
 - ……任何你能想到的东西

 放在 ~/.pi/agent/extensions/、.pi/extensions/
  ### 主题

 内置：dark、light。主题支持热重载：修改活动主题文件，Pi 会立即应用改动。

 放在 ~/.pi/agent/themes/、.pi/themes/
 ### Pi 包

 通过 npm 或 git 打包并分享扩展、技能、提示词和主题。在 npmjs.com 或 Discord 上查找包。

 │ 安全： Pi 包以完整的系统权限运行。扩展会执行任意代码，技能可以指示模型执行任何操作，包括运行可执行文件。安装第三方
 │ 包之前请审查其源代码。

 ```bash
   pi install npm:@foo/pi-tools
   pi install npm:@foo/pi-tools@1.2.3      # 固定版本
   pi install git:github.com/user/repo
   pi install git:github.com/user/repo@v1  # tag 或 commit
   pi install git:git@github.com:user/repo
   pi install git:git@github.com:user/repo@v1  # tag 或 commit
   pi install https://github.com/user/repo
   pi install https://github.com/user/repo@v1      # tag 或 commit
   pi install ssh://git@github.com/user/repo
   pi install ssh://git@github.com/user/repo@v1    # tag 或 commit
   pi remove npm:@foo/pi-tools
   pi uninstall npm:@foo/pi-tools          # remove 的别名
   pi list
   pi update                               # 仅更新 pi
   pi update --all                         # 更新 pi 和所有包
   pi update --extensions                  # 仅更新包
   pi update --models                      # 仅刷新模型目录
   pi update --self                        # 仅更新 pi
   pi update --self --force                # 即使已是最新也重装 pi
   pi update npm:@foo/pi-tools             # 更新单个包
   pi config                               # 启用/禁用扩展、技能、提示词、主题
 ```

 包安装到 ~/.pi/agent/git/（git）或 ~/.pi/agent/npm/（npm）。用 -l 进行项目本地安装（.pi/git/、.pi/npm/）。git 的 @ref
  值是固定的 tag 或 commit；被固定的包会被 pi update --extensions 和 pi update --all 跳过，所以用 pi install
 git:host/user/repo@new-ref 把已有包移到新的 ref。git 包默认用 npm install --omit=dev 安装依赖，因此运行时依赖必须列在
 dependencies 下；配置了 npmCommand 时，git 包使用不带参数的 install 以兼容包装器。如果你使用 Node 版本管理器，希望包
 安装复用稳定的 npm 环境，在 settings.json 中设置 npmCommand，例如 ["mise", "exec", "node@20", "--", "npm"]。

 通过在 package.json 中添加 pi 键来创建包：

 ```json
   {
     "name": "my-pi-package",
     "keywords": ["pi-package"],
     "pi": {
       "extensions": ["./extensions"],
       "skills": ["./skills"],
       "prompts": ["./prompts"],
       "themes": ["./themes"]
     }
   }
 ```
#### 批改

**部分正确。**

- 阶梯层次与放置位置：正确。Prompt Templates（`~/.pi/agent/prompts/`、`.pi/prompts/`）→ Skills（`~/.pi/agent/skills/`、`~/.agents/skills/`、`.pi/skills/`、`.agents/skills/`）→ Extensions（`~/.pi/agent/extensions/`、`.pi/extensions/`）→ Themes → Pi Packages（`package.json` 加 `pi` 键）。
- 但**判断流程没有作答**：「按什么顺序判断、最终落在哪层、为什么这是最小选择」——本题的重点就是这条推理链，粘贴 README 原文 ≠ 回答。
- 标准推理链：这个需求是**事件驱动的动作**（在"会话结束"这一时刻执行代码），逐项排除——
  1. 不是 Prompt Template：模板只是一段可展开的文本，没有执行能力。
  2. 不是 Skill：Skill 是模型按需加载的能力包，同样没有事件钩子。
  3. 不是 Theme：与外观无关。
  4. 落在 **Extension**：只有扩展能订阅生命周期事件并在时机到达时执行代码。README 扩展能力清单里明确列了 "Git checkpointing and auto-commit"。Pi Package 只是给扩展打包分发的方式，不是更轻的方案。

### 问题 3：最小修改

给当前项目加一个可复用的「代码审查」提示词，输入 `/review` 展开。写出最小实现：文件放哪里、内容写什么。如果还要分发给同事（npm 或 git），最小改动是什么？

#### 我的回答
创建review的skill

```markdown
   <!-- ~/.pi/agent/skills/my-skill/SKILL.md -->
   # review
   当进行代码审查时使用这个skill

   ## Steps
   1. 确认代码改动内容
   2. 按照开发规范进行代码审查，可以单独启动多个子agent分别从代码逻辑，规范化，国际化，日志打印，异常处理，漏洞扫描方面进行审查
   3. 汇总审查结果进行报告
 ```

 放在 ~/.pi/agent/skills/、~/.agents/skills/、.pi/skills/ 或 .agents/skills/
  通过在 package.json 中添加 pi 键来创建包：

 ```json
   {
     "name": "review-pi-package",
     "keywords": ["review-package"],
     "pi": {
  
       "skills": ["./review"]

     }
   }
#### 批改

**未通过（资源类型选错），分发机制答对一半。**

- 最小实现是 **Prompt Template**，不是 Skill：
  - 文件：`.pi/prompts/review.md`（项目级）或 `~/.pi/agent/prompts/review.md`（全局）。
  - 内容：提示词文本本身，如 `Review this code for bugs, security issues, and performance problems. Focus on: {{focus}}`（`{{focus}}` 是占位符，展开时填入）。
  - 触发：编辑器输入 `/review` 展开。
- 为什么不是 Skill：Skill 遵循 Agent Skills 标准，是带 name/description frontmatter 的 SKILL.md，由模型按需加载、占用上下文；一段固定的审查提示词没有过程性知识，模板更轻。等需求升级为「多步、带判断条件的审查流程」时才值得用 Skill。
- 你答对的部分：`package.json` 加 `pi` 键的打包机制正确，但应指向 `"prompts": ["./prompts"]`（目录内放 review.md），不是 `"skills": ["./review"]`。Skill 的调用形式是 `/skill:name`，不是 `/review`。
- 附带问题：你写的 SKILL.md 缺 frontmatter；且内容里「启动多个子 agent」是扩展能力，Skill 本身做不到。

## 强化练习（第一轮薄弱点，共 2 题）

### 强化题 1：默写补漏

不查资料，默写：(a) Pi 默认给模型的四个工具；(b) 除交互、print/JSON、RPC 之外的第四种运行模式，写出它的入口形式（import 什么、来自哪个包）和它适合谁。

#### 我的回答

read,write,bash,edit
sdk 
import { createAgentSession, ModelRuntime, SessionManager } from "@earendil-works/pi-coding-agent"
代码实现时调用agent

#### 批改

**通过。**

- (a) 正确：`read`、`write`、`edit`、`bash`，四个齐全（顺序不限）。
- (b) 基本正确：模式名 SDK 对，import 语句与 README 原文一致。「适合谁」建议记完整表述：**想把 Pi 嵌入自有 TypeScript/Node 应用的开发者**。区分记忆：RPC 给非 Node.js 进程用，SDK 给 Node/TS 应用用——两者都是「程序集成」，按宿主语言分。

### 强化题 2：场景判断

两个需求分别落在定制阶梯的哪一层？各用一句话说明理由，并点出两者的关键区别（触发机制上）：

(a) 输入 `/review` 展开一段固定的代码审查提示词。
(b) 每次 Bash 工具即将执行 `rm -rf` 时，先弹窗让用户确认。

#### 我的回答

a)prompt.提示词模板，可以直接按照模板给agent发消息
b)扩展，可以用hooks，或者门禁检测触发动作

#### 批改

**通过。**

- (a) 正确：Prompt Template。更精确的说法：`/review` 在编辑器里把模板展开成文本，由你确认后发给模型（模板本身不"给 agent 发消息"，是你的输入快捷方式）。
- (b) 正确：Extension。精确机制：扩展订阅工具调用事件（如 `tool_call`），在 bash 真正执行前拦截并插入确认——README 能力清单里的 "Permission gates and path protection" 就是这类。
- 关键区别你没有明写，标准表述：**(a) 用户手动触发**（斜杠命令、展开文本）；**(b) 事件驱动**（工具调用前自动拦截，无需用户预先输入）。判断落层时先问「谁触发、何时触发」——这是定制阶梯的决策变量。
