/* ============================================================
   组件：quiz.js —— 两类练习卡片的即时反馈
   1) <div class="recall">  回忆卡：先自己想，再展开答案（检索练习）
   2) <div class="mcq">     选择题：点选项，立刻判定对错并解释

   作者用法（HTML，样式见 assets/course.css）：

   <div class="recall">
     <p class="q">问题</p>
     <button class="reveal">想好了，看答案</button>
     <div class="answer" hidden><p>答案</p></div>
   </div>

   <div class="mcq" data-answer="0" data-explain="为什么">
     <p class="q">问题</p>
     <ul class="mcq-options">
       <li>选项一</li>
       <li>选项二</li>
     </ul>
   </div>

   data-answer 是正确项的下标（从 0 开始）。
   ============================================================ */

(() => {
	function enhanceRecall(el) {
		if (el.dataset.quizReady === "1") return;
		el.dataset.quizReady = "1";
		const button = el.querySelector("button.reveal");
		const answer = el.querySelector(".answer");
		if (!button || !answer) return;
		button.addEventListener("click", () => {
			const open = !answer.hidden;
			answer.hidden = open;
			button.textContent = open ? "想好了，看答案" : "收起答案";
		});
	}

	function enhanceMcq(el) {
		if (el.dataset.quizReady === "1") return;
		el.dataset.quizReady = "1";
		const options = Array.from(el.querySelectorAll(".mcq-options li"));
		const correctIndex = Number(el.dataset.answer);
		if (options.length === 0 || Number.isNaN(correctIndex)) return;

		const explain = document.createElement("div");
		explain.className = "quiz-explain";
		explain.hidden = true;
		explain.textContent = el.dataset.explain || "";

		const buttons = options.map((li, index) => {
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = li.textContent.trim();
			button.addEventListener("click", () => {
				buttons.forEach((other, otherIndex) => {
					other.disabled = true;
					if (otherIndex === correctIndex) other.classList.add("is-correct");
					else if (otherIndex === index) other.classList.add("is-wrong");
				});
				explain.hidden = false;
			});
			li.textContent = "";
			li.appendChild(button);
			return button;
		});

		el.appendChild(explain);
	}

	function enhance(root) {
		root.querySelectorAll(".recall").forEach(enhanceRecall);
		root.querySelectorAll(".mcq").forEach(enhanceMcq);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => enhance(document));
	} else {
		enhance(document);
	}
})();
