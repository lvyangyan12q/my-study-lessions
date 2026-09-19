# learning-lessons

个人学习仓库。**每个学科一个子目录**，每个子目录是一份独立的教学工作区。

| 目录 | 学科 | 主线 |
|---|---|---|
| [`pi/`](./pi/) | pi / agent 工程 | 读懂真实 agent 实现，最终能自己手搓一个 agent |

## 怎么读

课程是单文件 HTML，直接用浏览器打开，不需要服务器。打印也排版过。

从 [`pi/lessons/0001-agent-loop.html`](./pi/lessons/0001-agent-loop.html) 开始。

## 每个学科目录的约定

| 文件 / 目录 | 作用 |
|---|---|
| `MISSION.md` | 为什么学这个。所有教学决策都要回到它 |
| `RESOURCES.md` | 可信资源清单（知识来源 + 社区），并显式标注已知缺口 |
| `NOTES.md` | 教学偏好、环境事实、已做的教学决策、已放弃的方向 |
| `lessons/00NN-*.html` | 课程。一次性的消费品，读完就算 |
| `reference/*.html` | 速查页（词汇表等）。会被反复回看 |
| `exercises/*.mjs` | 练习。单文件、单命令、自带判定，用 `node` 直接跑 |
| `learning-records/*.md` | 学习记录：确认过的起点、被纠正的误解、任务变更 |
| `assets/` | 课程共用的样式与交互组件 |

## 跑练习

```bash
cd pi
node exercises/0001-agent-loop.mjs
```

练习自己判定成败：通过与否直接打印，并用退出码表示。不需要 API key。

## 本机配置（换电脑要改）

课程里指向 pi 源码的链接**不写死路径**：

1. HTML 里写的是 GitHub 地址，所以任何机器、任何浏览器都能点开；
2. 如果本机有 pi 源码，复制 `workspace.config.example.js` 为 `workspace.config.js`，填上本机路径；
3. 页面加载时 `pi/assets/workspace-links.js` 会把这些链接改写成 `file://` 本地路径，直接打开本地文件。

`workspace.config.js` 已加入 `.gitignore`，每台机器一份，不上传。

## 发布

```bash
node tools/publish.mjs "第 2 课：工具失败的四种情形"
```

提交并推送到 `https://github.com/lvyangyan12q/my-study-lessions`。不带消息时用默认的"更新学习进度"。

## 说明

课程由 AI（pi）作为老师生成，我负责筛选、执行和反馈。外部引用一律给出出处，不凭记忆下结论。
"# my-study-lessions" 
