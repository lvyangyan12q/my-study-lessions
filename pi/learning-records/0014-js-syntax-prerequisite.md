# 阶段 2 的隐藏前置：JS/TS 语法，不是流程

2026-10-18，紧接 `lessons/0003` 收口、进入 `exercises/0001-agent-loop.mjs`。用户写完一版提交，逐行核对后发现：**循环流程他是懂的，真正挡住他的是 JavaScript 语法**。用户原话：「我知道流程，但是 ts 语法不会」。

## 证据

用户的 `runLoop()` 里，概念性的东西基本对（`msgs.push(result)` 位置正确、知道要 filter toolCall、知道没 toolCall 就退出），但全是语法级的错：

- 赋值漏 `const`（`result = callModel(msgs)`）→ 严格模式下 `ReferenceError`。
- `calls.for (...) { ... }`——把关键字 `for` 当方法调用，且抄进来一个模板里未定义的 `array` → `SyntaxError`。
- `isToolCall` 直接用了课里 7 行伪代码的简写，没展开成真的判断 → `TypeError`。
- 函数开头那句 `throw new Error("TODO...")` 没删，整个 `while` 成死代码。
- 把「遍历工具」写成了 `await runLoop(element)`——误把 `runLoop`（整体循环）当 `runTool`（单个工具）。

这五条里，只有最后一条算概念混淆；其余四条纯语法。

## 决策

- **不当成「循环没学会」重讲概念**——那会重复 `0003` 已收口的内容，浪费工作记忆。
- 新增 `reference/js-syntax.html`：只覆盖写这个循环需要的语法（`const`/`let`、`async`/`await`、箭头函数、`Array.filter|some|push|length`、`for...of`、对象/数组字面量、`if`/`return`、注释），每块配「在这段循环里扮演什么」，末尾附**对照版 8 行** + 「报错 → 病因」对照表 + 自查清单。`RESOURCES.md` 增补 MDN 作为这些语法的权威来源。
- 教学流程约定（记入 `NOTES.md`）：阶段 2 起，凡要求写代码，**先给对应语法速查，再让其动手**；点评代码用「报错 → 病因」直连到行，不从概念重讲。

## 为什么用速查页而不是新课

语法属「raw units of knowledge」——可反复回看，不是一次性讲完就走的。它天然是 reference 材料（本工作区约定：速查页给「压缩后的要点」，课给「一次性讲透一个点」）。而且用户已明确「流程懂」，缺的是可查的语法条目，正是参考页的形状。

## 结果（2026-10-18 收口）

- 用户按速查页改好 `runLoop()`，`node exercises/0001-agent-loop.mjs` 自判**通过**，`exercises/0001` 收口。
- 定位靠「报错 → 病因」对照：漏 `const` → `ReferenceError`；`calls.for (...)` → `SyntaxError`；`runTool` 前漏 `await` → 工具结果没入栈、循环停不下来（报「callModel 已被调用 N 次」）。
- 用户自述「知道流程、只是语法不会」，与本次判断一致；速查页按此定制，并修正一处我先前说粗的地方——练习里 `callModel` 是同步的，只有 `runTool` 是 `async`（`await` 必须加）。

## 下一步

课 `0010`（`packages/agent/README.md`：Message Flow / Event Flow），再课 `0016`（`agent-loop.ts` 的 `runLoop()` 真源码）。

Evidence: `exercises/0001-agent-loop.mjs` 用户提交版（第 61–78 行）；`reference/js-syntax.html`（新建）；`NOTES.md` 的教学约定条目。

Implications: 主线里「先讲清机制、再动手」的顺序，隐含了一个未写出的前置——**宿主语言的语法**。它此前被「概念课」挡住看不见；一旦切到真源码 + 写代码阶段就暴露出来。尽早识别「是语法卡住还是概念卡住」，比默认「没学会就重讲」更省用户的时间；两者给的药完全不同。
