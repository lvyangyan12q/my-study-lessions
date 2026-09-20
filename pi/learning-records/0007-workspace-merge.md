# 2026-09-20：工作区迁至 F:/lessons-study/pi，两期教学合并

用户要求把 `F:/ai-project/pi/study/`（我的教学主线）并入独立的 `F:/lessons-study/pi/`（旧「手搓 agent」工作区），此后所有课程都在新位置。

## 做了什么

- 整体迁移：`study/` 内容移入 `F:/lessons-study/pi/`，旧目录删除（源码仓库内原为 untracked，无 git 影响）。
- 编号整合（避免两套 0001/0002 冲突）：
  - 旧课 `0001-agent-loop.html` → `lessons/0003-agent-loop.html`；`0002-tool-failures.html` → `0004-tool-failures.html`；交叉链接已同步。
  - 旧学习记录 `0001-starting-point-and-constraints.md` → `0006-starting-point-and-constraints.md`。
- 样式合并：`assets/course.css` = 我的主题 + 旧课组件类（.page/.kicker/.subtitle/.goal/.callout/.recall/.mcq/.stepper 等）+ 兼容变量（--muted/--paper-2/--mono/--serif/--sans）。旧 course.css 曾被误覆盖（mv 覆盖），已从 git HEAD 恢复后合并。
- 链接机制：HTML 里的 `../../packages/...` 链接改写成 GitHub + `data-pi` 约定（22 处），配合 `workspace.config.js`（piSourceRoot=F:/ai-project/pi）+ `assets/workspace-links.js` 在本地改写为 file://。转换脚本 `tools/convert-html-links.cjs` 保留。
- 元文件重写：MISSION.md / NOTES.md / RESOURCES.md / AGENTS.md 合并两线；LEARNING_PATH.md 增「并行支线」。父级 README.md 已更新。

## 关键洞察

- 两条使命天然互补且共享同一仓库：主线教「在 Pi 之上做二次开发」，支线教「读核心、手搓自己的 agent」。合并后支线课程（agent-loop 精读）填补了主线「内核推迟到阶段 9 后」的空白，可并行推进。
- 旧工作区「无 shell」的机器事实全部过时，现环境 bash 可用；但旧区「课程内嵌反馈、不催用户跑命令」的偏好保留（用户两次确认过）。
- 教训：在合并目录前先把两边的 course.css 备份/检查——本次 mv 覆盖了历史样式，靠 git HEAD 找回。以后任何「同名文件合并且要保留双方」的操作先存 git 版本。

Status: active