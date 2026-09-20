# 二进制嵌入代码，运行时按路径读数据

用户已理解 `bun build --compile` 只把代码嵌进 `pi.exe`，而主题、文档、示例、WASM 是运行时按路径读取的资源，由 `copy-binary-assets` 安放在二进制旁边。初答曾把编译输入 `dist/bun/cli.js` 误归为运行时资源，追加练习后纠正。

Evidence: `learning-qa/package-json.md` 追加题 2 通过。

Implications: 后续讲资源加载（主题热重载、Skill 发现、ResourceLoader）时，「读文件发生在用到的时候」可作为既定前提。cli.js 去向列入间隔复测（见 NOTES.md）。
