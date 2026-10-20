# 文档地图与定制落层已内化

用户通过 `docs/index.md` 考核：能默写五组文档；能把四种运行模式映射到「Automate or embed Pi」四篇（print→`cli.md`、JSON→`json.md`、RPC→`rpc.md`、SDK→`sdk.md`），并说清 RPC 跨进程 / SDK 同进程这一区分变量；能把定制需求按「触发机制」落到 Prompt Template / Skill / Extension / Theme / Package（手动 / 模型按需 / 事件驱动 / 外观 / 分发）。

第一轮曾把「Start using Pi」与「Automate or embed Pi」两组混淆，并把 `CHANGELOG` 当成要读的扩展文档；强化轮纠正。

Evidence: `learning-qa/docs-index.md` 第一轮 + 强化题 1–4。

Implications: 阶段 1 其余文件可假设「需求 → 文档」与「定制落层」已建立，出题侧重执行流程与最小修改，不再重复阶梯定位。这也是 MISSION「能判断需求应由配置、Skill、Extension、SDK 还是内核修改完成」的第一个已验证子项。
