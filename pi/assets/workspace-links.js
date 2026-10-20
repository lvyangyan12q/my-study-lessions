/* ============================================================
   组件：workspace-links.js —— 让源码链接跨机器可用

   问题：课程里指向 pi 源码的链接，写死本机路径后换台电脑就废了。
   做法：
     1. HTML 里一律写 GitHub 地址（任何机器、任何浏览器都能点开）
     2. 带 data-pi="<仓库内相对路径>" 的链接，如果本机配了 pi 源码位置，
        就在页面加载时改写成 file:// 本地路径

   配置来源：仓库根的 workspace.config.js（未入库，每台机器一份）
     window.LEARNING_WORKSPACE = { piSourceRoot: "D:/programming/workspace/pi" };

   没配置 -> 保持 GitHub 链接。配置了 -> 本地文件直达。
   ============================================================ */

(() => {
	const config = window.LEARNING_WORKSPACE || {};
	const configured = typeof config.piSourceRoot === "string" ? config.piSourceRoot.trim() : "";
	if (!configured) return;

	// 统一成 file:/// 前缀，去掉多余斜杠，反斜杠一律换正斜杠
	const base = `file:///${configured
		.replace(/\\/g, "/")
		.replace(/^file:\/*/i, "")
		.replace(/^\/+/, "")
		.replace(/\/+$/, "")}`;

	const links = document.querySelectorAll("a[data-pi]");
	for (const link of links) {
		const relative = (link.getAttribute("data-pi") || "").replace(/^\/+/, "");
		if (!relative) continue;
		link.href = `${base}/${relative}`;
		link.setAttribute("data-resolved", "local");
	}

	// 图片同理：<img data-pi="packages/.../images/x.png" src="https://raw.githubusercontent.com/...">
	// 没配置就保留远程 src；配置了就读本地。
	const images = document.querySelectorAll("img[data-pi]");
	for (const img of images) {
		const relative = (img.getAttribute("data-pi") || "").replace(/^\/+/, "");
		if (!relative) continue;
		img.src = `${base}/${relative}`;
		img.setAttribute("data-resolved", "local");
	}
})();
