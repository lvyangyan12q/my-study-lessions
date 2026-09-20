/* ============================================================
   组件：loop-stepper.js —— 逐帧播放 agent 循环与 messages 数组的生长

   作者用法（样式见 assets/course.css）：

   <loop-stepper>
     <script type="application/json">
     {
       "code": ["while (true) {", "  ..."],
       "steps": [
         { "line": 0, "note": "这一步在做什么", "messages": [ { "role": "user", "text": "..." } ] }
       ]
     }
     </script>
   </loop-stepper>

   每个 step 里的 messages 是**完整快照**，不是增量。
   组件会把比上一步新增的消息高亮出来。
   ============================================================ */

class LoopStepper extends HTMLElement {
	connectedCallback() {
		const source = this.querySelector('script[type="application/json"]');
		if (!source) return;

		let data;
		try {
			data = JSON.parse(source.textContent || "{}");
		} catch (error) {
			this.textContent = "loop-stepper: JSON 解析失败";
			return;
		}

		this.data = data;
		this.index = 0;
		this.render();
		this.showStep(0);
	}

	render() {
		this.innerHTML = "";

		const root = document.createElement("div");
		root.className = "stepper";

		const grid = document.createElement("div");
		grid.className = "stepper__grid";

		const codePanel = document.createElement("div");
		const codeTitle = document.createElement("p");
		codeTitle.className = "stepper__panel-title";
		codeTitle.textContent = this.dataset.codeTitle || "最小循环";
		this.codeEl = document.createElement("pre");
		this.codeEl.className = "stepper__code";
		this.lines = (this.data.code || []).map((text) => {
			const span = document.createElement("span");
			span.className = "stepper__line";
			span.textContent = text;
			this.codeEl.appendChild(span);
			return span;
		});
		codePanel.append(codeTitle, this.codeEl);

		const msgPanel = document.createElement("div");
		const msgTitle = document.createElement("p");
		msgTitle.className = "stepper__panel-title";
		msgTitle.textContent = this.dataset.messagesTitle || "messages（状态）";
		this.msgsEl = document.createElement("ul");
		this.msgsEl.className = "stepper__msgs";
		this.msgsEl.setAttribute("aria-live", "polite");
		msgPanel.append(msgTitle, this.msgsEl);

		grid.append(codePanel, msgPanel);
		root.appendChild(grid);

		this.noteEl = document.createElement("p");
		this.noteEl.className = "stepper__note";
		root.appendChild(this.noteEl);

		const controls = document.createElement("div");
		controls.className = "stepper__controls";
		this.prevButton = this.makeButton("上一步", "prev", () => this.showStep(this.index - 1));
		this.nextButton = this.makeButton("下一步", "next", () => this.showStep(this.index + 1));
		this.resetButton = this.makeButton("重来", "reset", () => this.showStep(0));
		this.counter = document.createElement("span");
		this.counter.className = "stepper__counter";
		controls.append(this.prevButton, this.nextButton, this.resetButton, this.counter);
		root.appendChild(controls);

		this.appendChild(root);
	}

	makeButton(label, act, onClick) {
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = label;
		button.dataset.act = act;
		button.addEventListener("click", onClick);
		return button;
	}

	showStep(index) {
		const steps = this.data.steps || [];
		if (steps.length === 0) return;
		const clamped = Math.max(0, Math.min(index, steps.length - 1));
		const step = steps[clamped];
		// 只有前进一步时才高亮新消息。回退或重来时不猜，全部不高亮。
		const previousCount =
			clamped > this.index ? (steps[this.index].messages || []).length : -1;

		this.lines.forEach((line, lineIndex) => {
			line.classList.toggle("is-active", lineIndex === step.line);
		});

		this.msgsEl.innerHTML = "";
		const messages = step.messages || [];
		if (messages.length === 0) {
			const empty = document.createElement("li");
			empty.className = "stepper__empty";
			empty.textContent = "（空）";
			this.msgsEl.appendChild(empty);
		}

		messages.forEach((message, messageIndex) => {
			const item = document.createElement("li");
			item.className = "stepper__msg";
			if (previousCount >= 0 && messageIndex >= previousCount) item.classList.add("is-new");

			const role = document.createElement("span");
			role.className = "stepper__role";
			role.textContent = message.role;

			const text = document.createElement("span");
			text.textContent = message.text;

			item.append(role, text);
			this.msgsEl.appendChild(item);
		});

		this.noteEl.textContent = step.note || "";
		this.index = clamped;
		this.counter.textContent = `${clamped + 1} / ${steps.length}`;
		this.prevButton.disabled = clamped === 0;
		this.nextButton.disabled = clamped === steps.length - 1;
	}
}

customElements.define("loop-stepper", LoopStepper);
