# 检查课程与源码的差异（pi）

在学习目录执行（需要 Node.js 18+ 与 Git）：

```bash
node ./pi/tools/check-source.mjs
```

不传参数时，脚本按仓库根 `machine.config.json` 的 `piSourceRoot` 找源仓库（该文件 gitignore，每台机器一份）。源仓库临时换位置时，用参数覆盖本次检查的路径：

```bash
node ./pi/tools/check-source.mjs --source "<源仓库目录>"
```

脚本固定读取自身上一级的 `SOURCE_BASELINE.json`，因此从其他工作目录调用也能找到基线。`watchedAreas[].paths` 接受仓库内的文件或目录相对路径，不使用 glob；目录会匹配其下的所有路径。

输出包括基线与当前提交、`packages/coding-agent` 版本、历史关系、关注区域的已提交变化、相对 HEAD 的暂存与未暂存变化、未跟踪文件路径，以及基线文件的 SHA-256 校验结果。新增、删除和 Git 检测到的重命名都会显示；重命名任意一端属于关注区域时都会纳入。哈希比较的是工作区原始字节，换行符变化也会触发提示。

每次升级源码后先运行一次，根据末尾列出的主题复核相应课程和接口。这是只读检查：不执行 fetch、pull、安装命令或仓库脚本，不写源仓库与基线，不读取未跟踪文件的内容；常见私密配置路径与密钥文件会拒绝读取，也不会跟随文件符号链接读取。

退出码 `0` 表示检查完成（检测到变化或分叉也可以是 `0`）；退出码 `2` 表示检查出错或不完整，例如缺少基线提交、路径无效、Git 不可用。没有变化只说明本次选定区域和文件未变，不代表全项目或插件 API 兼容。

> 与 `deepseek-harness/tools/` 下的同名脚本结构一致，只是本机源码键为 `piSourceRoot`、版本取自 `packages/coding-agent/package.json`。基线锚点的选择依据见 `SOURCE_BASELINE.json` 的 `captureNotes`。
