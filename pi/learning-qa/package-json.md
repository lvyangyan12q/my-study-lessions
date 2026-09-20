# `package.json` 学习问答

状态：**已关闭**（第一轮 1/3 通过；强化与追加练习后全部薄弱点修复；exports 白名单与 cli.js 去向两个点待间隔复测）

## 第一轮

### 问题 1：概念

`main`、`types`、`exports` 和 `bin` 分别控制什么？其中哪个字段让用户能够执行 `pi` 命令？

#### 我的回答

main是主入口的文件路径
types应该是ts的类型文件
exports是映射，后续可以直接使用映射代表导入的包
bin代表执行的文件

bin



#### 批改

基本通过，两点需修正：

- `main` ✓ 指向 `./dist/index.js`。补充边界：当 `exports` 存在时，根导入 `@earendil-works/pi-coding-agent` 优先由 `exports["."]` 解析，`main` 是没有 exports 的旧解析器的兜底入口。
- `types` 半对。准确说法：TypeScript 的默认类型声明入口，本包指向 `./dist/index.d.ts`——你 `import` 这个包时，编辑器读的就是它，而不是源码。
- `exports` ✗ 表述含糊。准确说法见下面问题 3 的批改——它是「子路径 → 包内文件」的映射，同时是白名单：没列出的内部文件从外面导不进来。
- `bin` 半对。它是「命令名 → 可执行文件」的映射：`"pi": "dist/cli.js"`。npm `node_modules/.bin` 建一个 `pi` shim，所以你能在终端敲 `pi`。选 `bin` 回答第二问：正确。

判定：通过。薄弱点 = `exports` 的方向和白名单语义，在问题 3 里继续强化。

### 问题 2：执行流程

运行 `npm run build:binary` 时，大致依次完成哪些工作？为什么除了生成 `pi.exe`，还要复制主题、文档、示例和 WASM 文件？

#### 我的回答

<!-- 在这里填写 -->

#### 批改

未作答。以下为讲解，理解后进入强化练习。

`build:binary` 的命令链（真实脚本是一行 `&&` 串联，拆开看是四步）：

1. `npm --prefix ../tui run build && npm --prefix ../ai run build && npm --prefix ../agent run build`
   先构建三个同级 workspace 包（TUI、模型层、agent 层）。注意前缀是 `../tui` 等——这个脚本只在完整 `pi-mono` 源码仓库里有意义，本目录是二进制发布包，不存在这些兄弟目录。
2. `npm run build`
   `tsgo` 编译 TS 到 `dist/`，给 `dist/cli.js` 和 `dist/rpc-entry.js` 加可执行权限，然后 `copy-assets` 把主题 JSON、图标 PNG、导出 HTML 模板复制进 `dist/`（npm 发布形态需要的资源）。
3. `bun build --compile ./dist/bun/cli.js ... --outfile dist/pi`
   把入口 JS 编译成**独立的可执行文件**（Windows 上即 `pi.exe`）。可执行文件里嵌入的是**代码**。
4. `npm run copy-binary-assets`
   把 `package.json`、`README.md`、`CHANGELOG.md`、`theme/*.json`、`assets/*.png`、导出模板、`docs/`、`examples/`、`photon_rs_bg.wasm` 复制到 `dist/`——也就是放在生成的二进制**旁边**。对照本目录：`pi.exe` 旁边正好是 `theme/`、`docs/`、`examples/`、`assets/`、`photon_rs_bg.wasm`。

**为什么必须复制**：编译只嵌入了代码，不会嵌入运行时按路径读取的**数据文件**。Pi 启动后要从磁盘加载主题 JSON、浏览内置文档、展示示例、用模板导出会话 HTML、用 photon WASM 在发送前压缩图片。这些文件不在，对应功能就坏——代码本身不报错，因为读文件发生在用到它们的时候。

一句话总结：**`pi.exe` 只带代码，不带数据；运行时契约 = 二进制 + 它按路径读取的资源。**

判定：不通过，计入强化练习。

### 问题 3：最小修改

假设要增加以下可导入子路径：

```ts
import ... from "@earendil-works/pi-coding-agent/testing";
```

对应文件已经生成到：

```text
dist/testing.js
dist/testing.d.ts
```

请写出对 `package.json` 的最小修改。

#### 我的回答

```json
"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js"
		},
		"./rpc-entry": {
			"import": "./dist/rpc-entry.js"
		},
        "...":{
            "import":"@earendil-works/pi-coding-agent/testing"
        }
	},
```

#### 批改

不通过。两处方向性错误：

1. **键写错了**。键是你要暴露的子路径，即 `"./testing"`——调用方写 `...import from "@earendil-works/pi-coding-agent/testing"` 时，Node 取包名后面的 `/testing` 来查这张表。`"..."` 不是一个子路径。
2. **值写错了，这是核心错误**。值必须指向**包内相对文件路径** `"./dist/testing.js"`，而不是包名 `"@earendil-works/pi-coding-agent/testing"`。`exports` 的值永远是「这个包里面的哪个文件」。写包名会自引用：Node 解析 `.../pi-coding-agent/testing` 时查这张表，查到的又是同一个包名，再次解析、死循环。
3. **漏了 `types` 条件**。题目说 `dist/testing.d.ts` 已生成，所以应加 `"types": "./dist/testing.d.ts"`，且必须写在 `"import"` 之前（TS 按条件顺序取第一个命中的）。

正确答案（在现有 `exports` 里新增一个条目即可）：

```json
"./testing": {
	"types": "./dist/testing.d.ts",
	"import": "./dist/testing.js"
}
```

加分项：你凭记忆准确复述了现有的 `.` 和 `./rpc-entry` 两个条目。

判定：不通过。强化练习将针对 `exports` 的「子路径 → 包内文件」方向。

参考：[Node.js 文档 · Package entry points](https://nodejs.org/api/packages.html#package-entry-points)

## 强化练习

> 第一轮结果：问题 1 通过；问题 2、3 不通过。以下两题只练薄弱点，答完全对即关闭第一课。

### 强化题 1：exports 方向与白名单

扩展代码里写：

```ts
import { x } from "@earendil-works/pi-coding-agent/session-format";
```

Node 报错：

```text
Error: Package subpath './session-format' is not defined by "exports"
```

(a) 用一句话说明这个报错体现了 `exports` 的什么性质。
(b) 已有产物 `dist/session-format.js` 和 `dist/session-format.d.ts`，写出修复所需的 `exports` 条目。

#### 我的回答

"exports": {
		"./session-format": {
			"types": "./dist/session-format.d.ts",
			"import": "./dist/session-format.js"
		}
	}

#### 批改

- (a) **未作答**。正确答案：`exports` 是**白名单**（封顶列表）——只有明确列出的子路径才能被导入；文件在磁盘上存在没用，没列进表里就是导不进，报错正来源于此。这条在追加练习里补答。
- (b) ✓ **完全正确**：键 `./session-format`、`types` 在前、`import` 在后、两个路径都对。第一轮的核心薄弱点（`exports` 的「子路径 → 包内文件」方向）已修复。

### 强化题 2：二进制的运行时边界

同事把 `pi.exe` 单独复制到一个空目录，说「一个 exe 就够了」。对照 `copy-binary-assets` 复制的内容：

(a) 列出他缺的资源，每项配一个会坏的功能。
(b) 解释为什么问题往往出在「用到的时候」，而不是启动时立刻崩溃。

#### 我的回答

a)./dist/bun/cli.js,theme/`、`docs/`、`examples/`、`assets/`、`photon_rs_bg.wasm`
b)Pi 启动后要从磁盘加载主题 JSON、浏览内置文档、展示示例、用模板导出会话 HTML、用 photon WASM 在发送前压缩图片。这些文件不在，对应功能就坏——代码本身不报错，因为读文件发生在用到它们的时候

#### 批改

- (a) **部分对，有一处概念错误**：
  - ✗ `dist/bun/cli.js` **不是**会缺的资源。它是 `bun build --compile` 的**编译输入**——第 3 步构建时被嵌进了 `pi.exe` 本体。可执行文件一旦生成，就不再需要磁盘上有 cli.js。把它当运行时资源，正是混淆了「编译进二进制的代码」和「运行时按路径读的数据」这条第一课的主线。
  - ✓ `theme/`、`docs/`、`examples/`、`assets/`、`photon_rs_bg.wasm` 列对了。
  - 漏了：`package.json`（版本/配置识别）、`README.md`、`CHANGELOG.md`、export-html 的模板和 vendor JS（导出会话 HTML 用）。
  - 未按要求「每项配一个会坏的功能」。
- (b) ✓ 内容正确。注意：这段与我几分钟前的讲解几乎逐字一致——属于刚读过的短期记忆。过几天在后续课程的复习题里再测一次，答得出才算长期掌握。

## 追加练习（只补两个口子，各约 30 秒）

### 追加题 1：回到强化题 1(a)

Node 报错 `Package subpath './session-format' is not defined by "exports"`。
这次用一句话回答：这体现了 `exports` 的什么性质？

#### 我的回答

只有导出了才能被引用

#### 批改

✓ 通过。这就是白名单性质。更精确的表述：`exports` 封顶了可导入范围——**没列出的子路径，即使文件在磁盘上存在也无法导入**。补两个词你就有完整版：「只有**显式列出**的才能被引用」。

### 追加题 2：cli.js 去哪了

`dist/bun/cli.js` 在构建的第几步、变成了什么？为什么把 `pi.exe` 拷到空目录后，它**不属于**会缺的资源？

#### 我的回答
compile ,把入口 JS 编译成**独立的可执行文件**（Windows 上即 `pi.exe`）
pi.exe` 只带代码，不带数据；运行时契约 = 二进制 + 它按路径读取的资源。

#### 批改

✓ 通过，一处补齐：发生在**第 3 步**（`bun build --compile`）。论证链完整：cli.js 是代码 → 编译时嵌入 pi.exe → pi.exe 自带代码 → 所以不缺。

提醒：这两句是从我的批改里粘贴的（`**` 标记都还在）。内容对了，但「能粘贴」≠「能复述」。已排入间隔复测：几天后的练习里会不经预告地再问这两个点。

**第一课关闭。** 下一个文件：`README.md`。


