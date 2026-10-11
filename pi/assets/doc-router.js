/* ============================================================
   组件：doc-router.js —— 「需求 → 文档」高亮路由

   用途：把「我想做 X」映射到该读哪几篇文档。点一个需求按钮，
   对应的文档 chip 高亮并脉冲一次。

   HTML：
   <div class="doc-router">
     <div class="doc-router__needs">
       <button class="doc-router__need"
               data-docs="doc-sdk,doc-json"
               data-note="嵌入程序用 sdk.md，消费事件流用 json.md">嵌进我的程序</button>
     </div>
     <div class="doc-router__docs">
       <span class="chip doc-chip" id="doc-sdk">sdk.md</span>
       <span class="chip doc-chip" id="doc-json">json.md</span>
     </div>
     <p class="doc-router__note"></p>
   </div>

   data-docs：逗号分隔的目标 chip 的 id。样式见 assets/course.css。
   ============================================================ */

(() => {
	function initRouter(root) {
		if (root.dataset.routerReady === "1") return;
		root.dataset.routerReady = "1";

		const needs = Array.from(root.querySelectorAll(".doc-router__need"));
		const chips = Array.from(root.querySelectorAll(".doc-chip"));
		const note = root.querySelector(".doc-router__note");
		const byId = new Map(chips.map((chip) => [chip.id, chip]));

		for (const need of needs) {
			need.setAttribute("aria-pressed", "false");
			need.addEventListener("click", () => {
				for (const other of needs) {
					other.setAttribute("aria-pressed", other === need ? "true" : "false");
				}
				for (const chip of chips) chip.classList.remove("is-target");

				const ids = (need.dataset.docs || "")
					.split(",")
					.map((id) => id.trim())
					.filter(Boolean);
				for (const id of ids) {
					const chip = byId.get(id);
					if (!chip) continue;
					chip.classList.remove("is-target");
					// 重新触发动画
					void chip.offsetWidth;
					chip.classList.add("is-target");
				}
				if (note) note.textContent = need.dataset.note || "";
			});
		}
	}

	function enhance(root) {
		root.querySelectorAll(".doc-router").forEach(initRouter);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => enhance(document));
	} else {
		enhance(document);
	}
})();
