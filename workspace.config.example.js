// 本机配置模板。
//
// 用法：把本文件复制成同目录下的 workspace.config.js，改成你自己机器上的路径。
// workspace.config.js 已被 .gitignore 忽略，不会上传，所以每台机器各写一份。
//
// 不做这步也能用：课程里的链接会保持指向 GitHub，只是点开时走网络。

window.LEARNING_WORKSPACE = {
	// pi 源码仓库在本机的位置。
	// 课程里所有带 data-pi 属性的链接（指向 packages/... 的那些）会指向它。
	// 留空字符串或删掉整个配置 = 一律使用 GitHub 链接。
	piSourceRoot: "D:/programming/workspace/pi",
};
