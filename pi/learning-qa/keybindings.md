# `docs/keybindings.md` 知识点（未考核）

> 2026-10-03 起，`docs/` 用户文档不再逐篇出课；这里直接给知识点与考点。源文件：`packages/coding-agent/docs/keybindings.md`。

## 一、机制
- 文件：`<agent-dir>/keybindings.json`（默认 `~/.pi/agent/keybindings.json`）。
- 格式：**动作 id → 一个键，或键的数组**；图例：
  ```json
  { "app.session.new": "ctrl+shift+n",
    "app.session.tree": ["ctrl+shift+t", "alt+shift+t"] }
  ```
- 值**替换**该动作的默认键；写**空数组** `[]` 可禁用某动作的按键绑定。
- 改完文件要 **`/reload`** 才在当前会话生效。
- 用 `/hotkeys` 查看当前生效的快捷键。

## 二、键语法
- `modifier+key`；修饰键 `ctrl` / `shift` / `alt` / `super`，可叠加（如 `ctrl+shift+alt+x`）。
- 特殊键名：`escape`/`esc`、`enter`/`return`、`tab`、`space`、`backspace`、`delete`、`home`/`end`、`pageUp`/`pageDown`、`up`/`down`/`left`/`right`、`f1`–`f12` 等。
- **`super` 绑定需要终端支持 Kitty 键盘协议**（能把 super 单独上报），否则可能不生效。

## 三、最该记的默认动作
| 动作 id | 默认 | 作用 |
|---|---|---|
| `app.interrupt` | `escape` | 中止 / abort |
| `app.clear` | `ctrl+c` | 首次清空编辑器 / 再次退出 |
| `app.exit` | `ctrl+d` | 编辑器为空时退出 |
| `app.editor.external` | `ctrl+g` | 外部编辑器 |
| `app.clipboard.pasteImage` | `ctrl+v`（Win/WSL `alt+v`） | 粘图片 |
| `app.model.select` | `ctrl+l` | 打开模型选择器 |
| `app.model.cycleForward` | `ctrl+p` | 循环下一个模型 |
| `app.thinking.cycle` | `shift+tab` | 循环思考级别 |
| `app.thinking.toggle` | `ctrl+t` | 折叠/展开 thinking |
| `app.tools.expand` | `ctrl+o` | 折叠/展开工具输出 |
| `app.message.copy` | `ctrl+x` | 复制消息 |
| `app.message.followUp` | `alt+enter`（Win/WSL `ctrl+q`） | 排队 follow-up |
| `app.message.dequeue` | `alt+up`（Win/WSL `alt+q`） | 把排队消息收回编辑器 |

## 考点（自查）
1. 改键位的流程：改哪个文件、改完做什么才生效？
2. 怎么禁用某个动作的按键？
3. Windows / WSL 上，follow-up 和「收回排队消息」的替代键是什么？
