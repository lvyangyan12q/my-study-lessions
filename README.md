# learning-lessons

个人学习仓库。**每个学科一个子目录**，每个子目录是一份独立的教学工作区。

| 目录 | 学科 | 主线 |
|---|---|---|
| [`pi/`](./pi/) | pi / agent 工程 | Pi 二次开发（扩展 / SDK / RPC）+ 手搓 agent，一条主线学到底 |
| [`deepseek-harness/`](./deepseek-harness/) | DeepSeek Harness | 运行机制 → Cordis 插件 → 二次开发，课程跟踪源码版本 |

## 怎么读

课程是单文件 HTML，直接用浏览器打开，不需要服务器。打印也排版过。

一条主线，见 [`pi/LEARNING_PATH.md`](./pi/LEARNING_PATH.md)：先用熟 pi，再读 agent 最小循环，再学扩展 / SDK / RPC，最后阶段 15 手搓出自己的 agent。问答考核在 `pi/learning-qa/`。

## 每个学科目录的约定

| 文件 / 目录 | 作用 |
|---|---|
| `MISSION.md` | 为什么学这个。所有教学决策都要回到它 |
| `RESOURCES.md` | 可信资源清单（知识来源 + 社区），并显式标注已知缺口 |
| `NOTES.md` | 教学偏好、环境事实、已做的教学决策、已放弃的方向 |
| `LEARNING_PATH.md` | 主线的阶段路线（0–15）与考核规则 |
| `lessons/00NN-*.html` | 课程。一次性的消费品，读完就算 |
| `reference/*.html` | 速查页（词汇表、运行模式、中英对照 CHANGELOG 等）。会被反复回看 |
| `learning-qa/*.md` | 主线逐文件的问答考核：题目、回答、批改、强化题 |
| `exercises/*.mjs` | 阶段 2 / 毕业任务的练习，单文件、单命令、自带判定 |
| `learning-records/*.md` | 学习记录：确认过的起点、被纠正的误解、任务变更 |
| `assets/` | 课程共用的样式与交互组件（course.css、quiz.js、loop-stepper.js、workspace-links.js） |

## 本机配置（换电脑要改）

课程里指向 pi 源码的链接**不写死路径**：

1. HTML 里写的是 GitHub 地址，所以任何机器、任何浏览器都能点开；
2. 如果本机有 pi 源码，复制 `workspace.config.example.js` 为 `workspace.config.js`，填上本机路径；
3. 页面加载时 `pi/assets/workspace-links.js` 会把这些链接改写成 `file://` 本地路径，直接打开本地文件。

`workspace.config.js` 已加入 `.gitignore`，每台机器一份，不上传。

## 说明

课程由 AI（pi）作为老师生成，我负责筛选、反馈与检查。外部引用一律给出出处，不凭记忆下结论。
