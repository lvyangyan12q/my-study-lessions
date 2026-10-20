/**
 * Jev — structured decisions inside Pi.
 *
 * Jev is TypeSafe's System One model: it does not chat, it answers typed questions
 * about a piece of state and returns calibrated probabilities plus a confidence.
 * Pi already ships classifier support (`ctx.modelRegistry.classify()`); this
 * extension exposes it to the main agent as a `jev` tool so the model can call it
 * mid-task for routing, scoring, guardrails, yes/no checks, and so on.
 *
 * The `jev` tool accepts:
 *   - state:      the content to evaluate (string, object, or array)
 *   - questions:  one or more { id, type, instructions, criteria }
 *                 type "choice" -> criteria is { label: meaning, ... }
 *                 type "score"  -> criteria is [level0, level1, ...] (2..10)
 *                 type "bool"   -> criteria is { true, false } (optional)
 *   - model:      optional "provider/model" override
 *
 * Credentials come from whichever Jev-capable provider is configured:
 *   TYPESAFE_API_KEY                                    -> typesafe/jev-latest
 *   OPENROUTER_API_KEY (or /login)                      -> openrouter/~typesafe/jev-latest
 *   AI_GATEWAY_API_KEY                                  -> vercel-ai-gateway/typesafe-ai/jev
 *   CLOUDFLARE_API_KEY + CLOUDFLARE_ACCOUNT_ID          -> cloudflare-workers-ai/typesafe/jev
 *   OPENCODE_API_KEY                                    -> opencode/jev-1.13
 * Override discovery with the JEV_MODEL env var, e.g. JEV_MODEL=openrouter/~typesafe/jev-latest.
 *
 * Load it with:  pi -e ./pi/extensions/jev.ts
 * Or copy it to ~/.pi/agent/extensions/ to load it in every session.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ClassifierAnswer, ClassifierQuestion, JsonObject, JsonValue, Usage } from "@earendil-works/pi-ai";
import { StringEnum, Type } from "@earendil-works/pi-ai";
import { defineTool, type ExtensionAPI, type ExtensionContext } from "@earendil-works/pi-coding-agent";

/** Providers that serve Jev, most preferred first. */
const JEV_PROVIDERS = ["typesafe", "openrouter", "vercel-ai-gateway", "cloudflare-workers-ai", "opencode"] as const;

interface RawQuestion {
	id: string;
	type: "choice" | "score" | "bool";
	instructions: string;
	criteria?: unknown;
}

const QuestionSchema = Type.Object({
	id: Type.String({ description: "Key the answer is returned under. Use a short snake_case name." }),
	type: StringEnum(["choice", "score", "bool"] as const, {
		description: "choice: pick one label. score: rate on an ordered scale. bool: yes/no.",
	}),
	instructions: Type.String({
		description: "The question to ask about the state, e.g. 'Which team should handle this?'",
	}),
	criteria: Type.Optional(
		Type.Any({
			description:
				"choice: object mapping each label to what it means. score: array of level descriptions, lowest first (2-10). bool: {true, false} descriptions; optional.",
		}),
	),
});

const JevParams = Type.Object({
	state: Type.Any({
		description: "The content to evaluate. A string, or a JSON object/array for structured records.",
	}),
	questions: Type.Array(QuestionSchema, {
		minItems: 1,
		description: "Questions answered in one call. Batch related questions rather than calling repeatedly.",
	}),
	model: Type.Optional(
		Type.String({
			description: 'Optional "provider/model" override, e.g. "openrouter/~typesafe/jev-latest".',
		}),
	),
});

const JevOutput = Type.Object({
	provider: Type.String(),
	model: Type.String(),
	answers: Type.Any({ description: "Answers keyed by question id." }),
});

/** Validate and normalize the model-supplied questions into Pi's classifier shape. */
function normalizeQuestions(raw: RawQuestion[]): Record<string, ClassifierQuestion> {
	const questions: Record<string, ClassifierQuestion> = {};
	for (const question of raw) {
		if (questions[question.id]) throw new Error(`Duplicate question id "${question.id}"`);
		if (question.type === "choice") {
			const criteria = question.criteria;
			if (typeof criteria !== "object" || criteria === null || Array.isArray(criteria)) {
				throw new Error(`choice question "${question.id}" needs criteria as an object of label -> meaning`);
			}
			const entries = Object.entries(criteria as Record<string, unknown>);
			if (entries.length < 2) throw new Error(`choice question "${question.id}" needs at least two labels`);
			questions[question.id] = {
				type: "choice",
				instructions: question.instructions,
				criteria: Object.fromEntries(entries.map(([label, meaning]) => [label, String(meaning ?? label)])),
			};
		} else if (question.type === "score") {
			const criteria = question.criteria;
			if (!Array.isArray(criteria) || criteria.length < 2) {
				throw new Error(`score question "${question.id}" needs criteria as an array of at least two levels`);
			}
			if (criteria.length > 10) {
				throw new Error(`score question "${question.id}" has ${criteria.length} levels; the maximum is 10`);
			}
			questions[question.id] = {
				type: "score",
				instructions: question.instructions,
				criteria: criteria.map((level) => String(level)),
			};
		} else {
			const criteria =
				typeof question.criteria === "object" && question.criteria !== null && !Array.isArray(question.criteria)
					? (question.criteria as Record<string, unknown>)
					: {};
			questions[question.id] = {
				type: "bool",
				instructions: question.instructions,
				criteria: { true: String(criteria.true ?? "Yes"), false: String(criteria.false ?? "No") },
			};
		}
	}
	return questions;
}

/** Jev evaluates a single state value; wrap scalars so Pi's classifier shape stays an object. */
function normalizeState(state: unknown): JsonObject {
	if (state === null || state === undefined) throw new Error("state is required");
	if (typeof state === "string") return { text: state };
	if (Array.isArray(state)) return { items: state };
	if (typeof state === "object") return state as JsonObject;
	return { value: state };
}

/** Find a Jev-capable classifier model among the providers with working credentials. */
async function resolveJev(ctx: ExtensionContext, override?: string) {
	const wanted = override ?? process.env.JEV_MODEL;
	if (wanted) {
		const slash = wanted.indexOf("/");
		if (slash <= 0 || slash === wanted.length - 1) {
			throw new Error(`Expected "provider/model", got "${wanted}"`);
		}
		const model = ctx.modelRegistry.findOfType("classifier", wanted.slice(0, slash), wanted.slice(slash + 1));
		if (!model) throw new Error(`Classifier model "${wanted}" is not in the catalog`);
		return model;
	}

	const available = await ctx.modelRegistry.getAvailableOfType("classifier");
	const jev = available.filter((model) => /jev/i.test(model.id));
	const pool = jev.length > 0 ? jev : available;
	for (const provider of JEV_PROVIDERS) {
		const hit = pool.find((model) => model.provider === provider);
		if (hit) return hit;
	}
	if (pool[0]) return pool[0];

	throw new Error(
		"No classifier credentials found. Set TYPESAFE_API_KEY (or OPENROUTER_API_KEY / AI_GATEWAY_API_KEY / " +
			"CLOUDFLARE_API_KEY + CLOUDFLARE_ACCOUNT_ID / OPENCODE_API_KEY), or pick a model with JEV_MODEL.",
	);
}

function formatAnswer(answer: ClassifierAnswer): string {
	switch (answer.type) {
		case "choice": {
			const distribution = Object.entries(answer.probabilities)
				.sort((a, b) => b[1] - a[1])
				.map(([label, probability]) => `${label} ${probability.toFixed(2)}`)
				.join(", ");
			return `${answer.choice} (confidence ${answer.confidence.toFixed(2)}; ${distribution})`;
		}
		case "score":
			return `${answer.score.toFixed(2)} (confidence ${answer.confidence.toFixed(2)})`;
		case "bool":
			return `${answer.probability >= 0.5 ? "yes" : "no"} (probability ${answer.probability.toFixed(2)})`;
	}
}

const jevTool = defineTool({
	name: "jev",
	label: "Jev",
	description:
		"Ask Jev, TypeSafe's System One classifier, several typed questions about one piece of state. " +
		"Use it to route input to a fixed set of options (choice), rate something on an ordered rubric (score), " +
		"or check a yes/no condition (bool). Answers carry probabilities and a confidence value; " +
		"when confidence is low, treat the answer as uncertain instead of acting on it.",
	promptSnippet: "jev: ask a decision model typed choice/score/bool questions about any state.",
	parameters: JevParams,
	outputSchema: JevOutput,
	annotations: { readOnlyHint: true, openWorldHint: true },
	async execute(_toolCallId, params, signal, _onUpdate, ctx) {
		const questions = normalizeQuestions(params.questions as RawQuestion[]);
		const state = normalizeState(params.state);
		const model = await resolveJev(ctx, params.model);
		const result = await ctx.modelRegistry.classify(model, { state, questions }, { signal });

		if (result.stopReason !== "stop") {
			return {
				content: [
					{
						type: "text" as const,
						text: `Jev failed (${result.stopReason}): ${result.errorMessage ?? "unknown error"}`,
					},
				],
				details: { error: result.errorMessage, stopReason: result.stopReason },
				isError: true,
			};
		}

		const lines = [`${result.provider}/${result.model}`];
		for (const [id, answer] of Object.entries(result.answers)) {
			lines.push(`${id}: ${formatAnswer(answer)}`);
		}

		return {
			content: [{ type: "text" as const, text: lines.join("\n") }],
			structuredContent: {
				provider: result.provider,
				model: result.model,
				answers: result.answers,
			} as unknown as JsonValue,
			details: {
				provider: result.provider,
				model: result.model,
				answers: result.answers,
			},
			usage: result.usage as Usage | undefined,
		};
	},
});

// ---------------------------------------------------------------------------
// score_lesson — weighted quality score for a lesson file
// ---------------------------------------------------------------------------

/**
 * Default rubric for this repo's lessons. Instructions and criteria are English on purpose:
 * English is Jev's primary training language and where accuracy is best. The state (the lesson)
 * stays in Chinese; the labels are Chinese only for the report.
 *
 * Keep every question narrow and literal, and put the boundary cases in the levels.
 */
const LESSON_DIMENSIONS = [
	{
		id: "takeaway",
		label: "核心收获",
		instructions: "Does the material deliver exactly one clear takeaway the learner can restate afterwards?",
		criteria: [
			"No clear takeaway; a grab bag of facts",
			"A topic is covered, but the takeaway stays vague",
			"A takeaway is stated, but the material does not reinforce it",
			"Exactly one takeaway, stated early and reinforced throughout",
		],
	},
	{
		id: "visual_density",
		label: "视觉密度",
		instructions:
			"Is the information carried by visuals (diagrams, animations, interactive widgets) rather than by text volume?",
		criteria: [
			"Walls of text; no diagrams or interactive elements",
			"Mostly text; visuals, if any, are decoration",
			"Some diagrams or interactive parts, but text still dominates",
			"Visuals carry the core idea; prose is minimal",
		],
	},
	{
		id: "zpd",
		label: "最近发展区",
		instructions:
			"Is the difficulty pitched just beyond the learner's current ability, rather than overwhelming or trivial?",
		criteria: [
			"Far too advanced or far too basic for the stated learner",
			"Mostly mismatched with the learner's level",
			"Roughly appropriate, but uneven across the material",
			"Clearly at the edge of the learner's current ability",
		],
	},
	{
		id: "mission_fit",
		label: "使命相关性",
		instructions:
			"Does the material directly advance the stated mission (Pi extensions, SDK/RPC, and building an agent from scratch)?",
		criteria: [
			"Unrelated to the mission",
			"Tangential; the connection must be inferred",
			"Related to the mission, but not actionable",
			"Directly advances a concrete mission goal",
		],
	},
	{
		id: "self_check",
		label: "练习可自判",
		instructions:
			"Do the exercises or checks give built-in feedback, so the learner can judge success without external tools?",
		criteria: [
			"No exercise or check at all",
			"A check exists, but needs an external command or grader",
			"A self-check exists, but it is shallow or unrelated to the takeaway",
			"A self-judgeable check tests the exact takeaway",
		],
	},
	{
		id: "mechanism",
		label: "讲透机制",
		instructions:
			"Does the material explain the mechanism and the judgment chain, rather than only stating conclusions?",
		criteria: [
			"Only conclusions or facts, with no reasoning",
			"A little reasoning, but the chain has gaps",
			"Reasoning is present, but it stops short of the mechanism",
			"A full chain from principle to consequence, with the why made explicit",
		],
	},
] as const;

/** Weights for the default rubric. They do not have to sum to 1; the composite normalizes by their sum. */
const LESSON_WEIGHTS: Record<string, number> = {
	takeaway: 0.25,
	visual_density: 0.15,
	zpd: 0.15,
	mission_fit: 0.2,
	self_check: 0.1,
	mechanism: 0.15,
};

/** Below this, the answer is treated as "not sure": review it by hand instead of acting on it. */
const LOW_CONFIDENCE = 0.5;
/** Keep the state inside Jev's per-request budget for the state plus the longest question. */
const MAX_STATE_CHARS = 24_000;
const MAX_FILE_BYTES = 2_000_000;

/** Strip a lesson HTML file down to readable text: tags are noise to Jev. */
function extractText(html: string): string {
	return html
		.replace(/<!--[\s\S]*?-->/gu, " ")
		.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, " ")
		.replace(/<br\s*\/?>/giu, "\n")
		.replace(/<\/(p|div|li|tr|h[1-6]|section|article|blockquote|pre)>/giu, "\n")
		.replace(/<[^>]+>/gu, " ")
		.replace(/&nbsp;/giu, " ")
		.replace(/&amp;/giu, "&")
		.replace(/&lt;/giu, "<")
		.replace(/&gt;/giu, ">")
		.replace(/&quot;/giu, '"')
		.replace(/&#39;|&apos;/giu, "'")
		.replace(/&#(\d+);/gu, (_match, code: string) => String.fromCodePoint(Number(code)))
		.replace(/[ \t\f\v]+/gu, " ")
		.replace(/\s*\n\s*/gu, "\n")
		.replace(/\n{3,}/gu, "\n\n")
		.trim();
}

async function readLesson(
	ctx: ExtensionContext,
	file: string,
): Promise<{ path: string; text: string; truncated: boolean }> {
	const resolved = path.isAbsolute(file) ? file : path.resolve(ctx.cwd, file);
	let html: string;
	try {
		html = await readFile(resolved, "utf8");
	} catch (error) {
		throw new Error(`Cannot read "${resolved}": ${error instanceof Error ? error.message : String(error)}`);
	}
	if (html.length > MAX_FILE_BYTES) {
		throw new Error(`"${resolved}" is larger than ${MAX_FILE_BYTES} bytes; extract the text first`);
	}
	const text = extractText(html);
	const truncated = text.length > MAX_STATE_CHARS;
	return { path: resolved, text: truncated ? text.slice(0, MAX_STATE_CHARS) : text, truncated };
}

const LessonDimensionSchema = Type.Object({
	id: Type.String({ description: "Short snake_case dimension id." }),
	label: Type.Optional(Type.String({ description: "Display label for the report." })),
	instructions: Type.String({ description: "The score question, phrased so Jev can judge it literally." }),
	criteria: Type.Array(Type.String(), {
		minItems: 2,
		maxItems: 10,
		description: "Ordered level descriptions, lowest first.",
	}),
});

const ScoreLessonParams = Type.Object({
	file: Type.String({
		description: "Path to the lesson HTML file, absolute or relative to the working directory.",
	}),
	dimensions: Type.Optional(
		Type.Array(LessonDimensionSchema, { description: "Override the default rubric." }),
	),
	weights: Type.Optional(Type.Record(Type.String(), Type.Number(), { description: "Weight per dimension id." })),
	model: Type.Optional(Type.String({ description: 'Optional "provider/model" override.' })),
});

const ScoreLessonOutput = Type.Object({
	file: Type.String(),
	composite: Type.Number({ description: "Weighted score, 0-100." }),
	truncated: Type.Boolean(),
	dimensions: Type.Array(
		Type.Object({
			id: Type.String(),
			label: Type.String(),
			score: Type.Number(),
			normalized: Type.Number(),
			confidence: Type.Number(),
			weight: Type.Number(),
			lowConfidence: Type.Boolean(),
		}),
	),
});

const scoreLessonTool = defineTool({
	name: "score_lesson",
	label: "Score lesson",
	description:
		"Score a lesson HTML file against a weighted rubric with Jev. It extracts the text, asks every dimension " +
		"in one classifier call, normalizes each score and returns a weighted composite from 0 to 100 along with " +
		"per-dimension confidence. The default rubric matches this repo's teaching rules; pass `dimensions` and " +
		"`weights` to override it. Treat the result as a first-pass filter, not ground truth, and review " +
		"low-confidence dimensions by hand.",
	promptSnippet: "score_lesson: weighted quality score for a lesson file, with per-dimension confidence.",
	parameters: ScoreLessonParams,
	outputSchema: ScoreLessonOutput,
	annotations: { readOnlyHint: true, openWorldHint: true },
	async execute(_toolCallId, params, signal, _onUpdate, ctx) {
		const lesson = await readLesson(ctx, params.file);
		const dimensions =
			params.dimensions && params.dimensions.length > 0
				? params.dimensions.map((dimension) => ({
						id: dimension.id,
						label: dimension.label ?? dimension.id,
						instructions: dimension.instructions,
						criteria: [...dimension.criteria],
					}))
				: LESSON_DIMENSIONS.map((dimension) => ({
						id: dimension.id,
						label: dimension.label,
						instructions: dimension.instructions,
						criteria: [...dimension.criteria],
					}));

		const questions: Record<string, ClassifierQuestion> = {};
		for (const dimension of dimensions) {
			questions[dimension.id] = {
				type: "score",
				instructions: dimension.instructions,
				criteria: dimension.criteria,
			};
		}

		const model = await resolveJev(ctx, params.model);
		const result = await ctx.modelRegistry.classify(model, { state: { lesson: lesson.text }, questions }, { signal });

		if (result.stopReason !== "stop") {
			return {
				content: [
					{
						type: "text" as const,
						text: `Jev failed (${result.stopReason}): ${result.errorMessage ?? "unknown error"}`,
					},
				],
				details: { error: result.errorMessage, stopReason: result.stopReason },
				isError: true,
			};
		}

		const rows = dimensions.map((dimension) => {
			const answer = result.answers[dimension.id];
			const levels = dimension.criteria.length;
			const score = answer?.type === "score" ? answer.score : 0;
			const confidence = answer?.type === "score" ? answer.confidence : 0;
			const normalized = levels > 1 ? Math.min(1, Math.max(0, score / (levels - 1))) : 0;
			const weight = params.weights?.[dimension.id] ?? LESSON_WEIGHTS[dimension.id] ?? 1;
			return {
				id: dimension.id,
				label: dimension.label,
				levels,
				score,
				confidence,
				normalized,
				weight,
				lowConfidence: confidence < LOW_CONFIDENCE,
			};
		});

		const weightSum = rows.reduce((sum, row) => sum + row.weight, 0) || 1;
		const composite = (rows.reduce((sum, row) => sum + row.weight * row.normalized, 0) / weightSum) * 100;

		const lines = [
			`课程评分: ${lesson.path}`,
			`综合: ${composite.toFixed(1)} / 100${lesson.truncated ? `（文本已截断，仅评前 ${MAX_STATE_CHARS} 字）` : ""}`,
			"",
			"| 维度 | 原分 | 归一 | confidence | 权重 | 贡献 |",
			"|---|---|---|---|---|---|",
			...rows.map(
				(row) =>
					`| ${row.label}${row.lowConfidence ? " ⚠" : ""} | ${row.score.toFixed(2)}/${row.levels - 1} | ` +
					`${row.normalized.toFixed(2)} | ${row.confidence.toFixed(2)} | ${row.weight} | ` +
					`${(row.weight * row.normalized).toFixed(3)} |`,
			),
		];
		const low = rows.filter((row) => row.lowConfidence).map((row) => row.label);
		if (low.length > 0) lines.push("", `⚠ 低置信（<${LOW_CONFIDENCE}，需人工复核）: ${low.join("、")}`);
		lines.push("", "提示: 初筛结果，不是 ground truth；事实准确性不由 Jev 判定。");

		return {
			content: [{ type: "text" as const, text: lines.join("\n") }],
			structuredContent: {
				file: lesson.path,
				composite: Number(composite.toFixed(2)),
				truncated: lesson.truncated,
				dimensions: rows.map(({ levels: _levels, ...rest }) => rest),
			} as unknown as JsonValue,
			details: {
				file: lesson.path,
				composite: Number(composite.toFixed(2)),
				truncated: lesson.truncated,
				dimensions: rows,
			},
			usage: result.usage as Usage | undefined,
		};
	},
});

export default function (pi: ExtensionAPI) {
	pi.registerTool(jevTool);
	pi.registerTool(scoreLessonTool);

	pi.registerCommand("jev-models", {
		description: "List the classifier models the jev tool can use",
		handler: async (_args, ctx) => {
			const available = await ctx.modelRegistry.getAvailableOfType("classifier");
			if (available.length === 0) {
				ctx.ui.notify(
					"No classifier credentials. Set TYPESAFE_API_KEY (or another Jev provider key).",
					"warning",
				);
				return;
			}
			const lines = available.map((model) => `${/jev/i.test(model.id) ? "*" : " "} ${model.provider}/${model.id}`);
			ctx.ui.notify(lines.join("\n"), "info");
		},
	});
}
