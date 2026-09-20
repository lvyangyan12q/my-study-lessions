# exports 是「子路径 → 包内文件」的白名单映射

用户已能读懂并正确书写 `package.json` 的 `exports` 条目（强化练习中独立写对完整条目，含 `types` 在前、`import` 在后）。此前误以为值可以写包名（形成自引用），已纠正。

Evidence: `learning-qa/package-json.md` 问题 3 初答错误 → 强化题 1(b) 独立写对；追加题 1 确认白名单语义。

Implications: 后续写 SDK 集成、扩展导入、诊断 "Package subpath not defined by exports" 类错误时可直接以此为地基，不必再教。白名单性质列入间隔复测（见 NOTES.md）。
