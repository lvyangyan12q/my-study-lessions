// 练习 0002 · 工具失败的处置
//
// 运行：  node exercises/0002-tool-failures.mjs
// 位置：  D:/learning-lessons/pi/exercises/0002-tool-failures.mjs
//
// 与练习 0001 的分工：循环已经写好了，你只补 runToolCall()。
// 目标：把前三种失败（工具不存在、参数不合法、工具抛错）各自包成一条
//       带 isError 标记的 toolResult，绝不让异常冒泡出循环。
//
// 不需要 API key，判定是自动的。

const MAX_MODEL_CALLS = 12;

let modelCalls = 0;

// —— 假工具表 ——
// 注意：这个表里只有 read_file。read_fil（少个 e）不存在，用来触发第一种失败。
const tools = {
	read_file: {
		// 参数要求：arguments.path 必须是非空字符串
		async run(args) {
			if (args.path === "explode.txt") {
				throw new Error("EACCES: 权限不足");
			}
			if (args.path !== "README.md") {
				throw new Error(`文件不存在: ${args.path}`);
			}
			return "128 行";
		},
	},
};

// —— 假模型的剧本 ——
// 按"已经收到了几条 toolResult"决定下一句说什么，所以它一定会跟着你的
// 处置结果往下走：你正确回灌了错误，它就知道该改什么。
function callModel(msgs) {
	modelCalls += 1;
	if (modelCalls > MAX_MODEL_CALLS) {
		throw new Error(`callModel 已被调用 ${modelCalls} 次：循环停不下来`);
	}
	const done = msgs.filter((m) => m.role === "toolResult").length;
	const script = [
		{
			role: "assistant",
			content: [{ type: "toolCall", id: "c1", name: "read_fil", arguments: { path: "README.md" } }],
		},
		{
			role: "assistant",
			content: [{ type: "toolCall", id: "c2", name: "read_file", arguments: {} }],
		},
		{
			role: "assistant",
			content: [{ type: "toolCall", id: "c3", name: "read_file", arguments: { path: "explode.txt" } }],
		},
		{
			role: "assistant",
			content: [{ type: "toolCall", id: "c4", name: "read_file", arguments: { path: "README.md" } }],
		},
		{
			role: "assistant",
			content: [{ type: "text", text: "README.md 有 128 行。" }],
		},
	];
	return script[Math.min(done, script.length - 1)];
}

// ============================================================
// 你要写的就是这个函数。
//
// 要求（按顺序）：
//   1. 查工具：tools[call.name] 不存在
//      -> 返回 isError: true，文案里必须带上工具名（模型靠它知道该改什么）
//   2. 校验参数：read_file 要求 call.arguments.path 是非空字符串
//      -> 不满足则返回 isError: true，文案说明缺什么
//   3. 执行：await tool.run(call.arguments)
//      -> 用 try/catch 把异常接住，返回 isError: true，文案用 error.message
//   4. 成功：返回 isError: false，text 用工具的返回值
//
// 每一条都必须返回同样形状的对象，一个字段都不能少：
//   {
//     role: "toolResult",
//     toolCallId: call.id,      // 必须对上，否则会话历史里这个调用没有结果
//     toolName: call.name,
//     text: "...",
//     isError: true | false,
//   }
//
// 提示：第 2 步的"校验"就是 pi 里 validateToolArguments() 干的事。
//       你现在手写一遍，比读它十遍有用。
// ============================================================
async function runToolCall(call) {
	throw new Error("TODO: 实现 runToolCall，处理三种失败");
}

// ============================================================
// 循环（已写好，不用改）
// ============================================================
async function runLoop(msgs) {
	while (true) {
		const msg = callModel(msgs);
		msgs.push(msg);
		const calls = msg.content.filter((c) => c.type === "toolCall");
		if (calls.length === 0) return;
		for (const call of calls) {
			msgs.push(await runToolCall(call));
		}
	}
}

// ============================================================
// 判定（不用改）
// ============================================================

const messages = [{ role: "user", text: "统计 README.md 有多少行" }];

try {
	await runLoop(messages);
} catch (error) {
	console.error(`× 循环没有跑完：${error.message}`);
	process.exit(1);
}

const toolResults = messages.filter((m) => m.role === "toolResult");

console.log("");
console.log("工具结果：");
for (const result of toolResults) {
	const flag = result.isError ? "isError" : "ok     ";
	const text = String(result.text ?? "").slice(0, 46);
	console.log(`  ${flag}  ${String(result.toolCallId).padEnd(4)}  ${text}`);
}

const flags = toolResults.map((result) => result.isError === true);
const expected = [true, true, true, false];

// 每个 toolCall 是否都有对应的结果消息
const callIds = new Set();
for (const message of messages) {
	if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
	for (const block of message.content) {
		if (block.type === "toolCall") callIds.add(block.id);
	}
}
const allPaired = toolResults.every((result) => callIds.has(result.toolCallId));

const problems = [];
if (toolResults.length !== 4) {
	problems.push(`应该有 4 条工具结果，实际 ${toolResults.length} 条（是不是漏了回灌，或者多跑了一轮？）`);
}
if (toolResults.length === 4) {
	if (flags[0] !== expected[0]) {
		problems.push("第 1 条：不认识 read_fil，说明你没先查工具表就把调用当成功了");
	}
	if (flags[1] !== expected[1]) {
		problems.push("第 2 条：没给 path 却被当成成功，说明你在执行前没校验参数");
	}
	if (flags[2] !== expected[2]) {
		problems.push("第 3 条：工具抛出的 EACCES 没被接住（异常冒泡或被吞掉了）");
	}
	if (flags[3] !== expected[3]) {
		problems.push("第 4 条：成功的调用被标成了错误");
	}
	if (toolResults.some((result) => !result.text)) {
		problems.push("有结果的 text 是空的：错误文案必须写给模型看，不能留白");
	}
}
if (!allPaired) {
	problems.push("有 toolResult 的 toolCallId 对不上任何工具调用，会话历史会残缺");
}

console.log("");
if (problems.length === 0) {
	console.log("通过：三次失败全部以消息形式回灌，成功那条也没被误判。");
	console.log("再看一眼 messages 长度：" + messages.length + " 条。有没有哪条是多余的？");
	process.exit(0);
}

console.log("还没通过：");
for (const problem of problems) console.log(`  - ${problem}`);
process.exit(1);
