// 练习 0001 · 最小 agent 循环
//
// 运行：  node exercises/0001-agent-loop.mjs
// 位置：  D:/learning-lessons/pi/exercises/0001-agent-loop.mjs
//
// 目标：让你自己写的 runLoop() 自然退出，并且 messages 的最终形状正确。
// 反馈是自动的：循环停不下来会被守卫打断，形状不对会报"还没通过"。
//
// 这个练习不接真模型，不需要 API key。callModel 和 runTool 是写死的假实现，
// 你只需要补 runLoop()。

const MAX_MODEL_CALLS = 10;

const messages = [{ role: "user", text: "统计 README.md 有多少行" }];

let modelCalls = 0;

// —— 假模型 ——
// 规则：messages 里还没有工具结果，就要一次 read_file；
//       已经有工具结果了，就直接给最终答案。
function callModel(msgs) {
	modelCalls += 1;
	if (modelCalls > MAX_MODEL_CALLS) {
		throw new Error(`callModel 已被调用 ${modelCalls} 次：循环停不下来，检查退出条件`);
	}
	const hasToolResult = msgs.some((m) => m.role === "toolResult");
	if (hasToolResult) {
		return { role: "assistant", content: [{ type: "text", text: "README.md 有 128 行。" }] };
	}
	return {
		role: "assistant",
		content: [
			{ type: "toolCall", id: "call_1", name: "read_file", arguments: { path: "README.md" } },
		],
	};
}

// —— 假工具 ——
async function runTool(call) {
	if (call.name !== "read_file") {
		throw new Error(`未知工具: ${call.name}`);
	}
	return {
		role: "toolResult",
		toolCallId: call.id,
		toolName: call.name,
		text: "128 行",
	};
}

// ============================================================
// 你要写的就是这个函数。
//
// 提示（不要往下看答案，先自己写一遍）：
//   1. 把消息发给模型
//   2. 把模型这条消息 push 进 msgs
//   3. 从消息内容里过滤出 toolCall
//   4. 没有 toolCall 就 return
//   5. 有就把每个工具跑一遍，结果 push 进 msgs，回到第 1 步
// ============================================================
async function runLoop(msgs) {
	throw new Error("TODO: 在这里实现最小 agent 循环");
}

// ============================================================
// 以下是判定，不用改。
// ============================================================

try {
	await runLoop(messages);
} catch (error) {
	console.error(`× 循环没有跑完：${error.message}`);
	process.exit(1);
}

console.log("");
console.log("messages 最终状态：");
messages.forEach((message, index) => {
	const label = message.name ? `${message.role} (${message.name})` : message.role;
	console.log(`  ${index + 1}. ${label}`);
});

const roles = messages.map((message) => message.role).join(" → ");
const last = messages[messages.length - 1];
const passed =
	messages.length === 4 &&
	roles === "user → assistant → toolResult → assistant" &&
	Array.isArray(last.content) &&
	last.content.some((block) => block.type === "text");

console.log("");
console.log(`实际形状：${roles}`);
console.log(
	passed
		? "通过：循环自己停下来了，messages 形状也对。"
		: "还没通过。对照第 1 课的 7 行伪代码，看少了哪一步。",
);
process.exit(passed ? 0 : 1);
