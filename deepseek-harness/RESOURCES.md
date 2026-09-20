# DeepSeek Harness 可信资料

## Knowledge

本轮以本地提交 `ddefc45fbc7f8e46dd73185e68295696d1297887` 为源码依据；以下文档链接全部固定到该提交。访问于 2026-09-20。出现文档与实现不一致时，记录分歧并核对实现和行为测试，不能直接拼接不同版本的说明。

- [架构总览](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/architecture.md)：Cordis、组合层次、Turn flow、Session log 与扩展入口；第一课的主依据。
- [架构总览中文版](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/architecture.zh.md)：阅读便利入口；关键顺序仍与同提交英文及源码交叉核对。
- [Cordis primer](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cordis-primer.md)：复习 ctx、inject、事件 dispatch mode、effect 和 waterfall 的 next()。
- [Cordis 动手教程](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cordis-tutorial/index.md)：按章节练习生命周期、服务、事件和配置；框架练习无需 API key。
- [第一个 Harness 插件](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/user/develop/basic/index.md)：通过 dsh profile 与 patch 装入应用；注意绝对插件路径与依赖声明。
- [第一个工具](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/user/develop/basic/tool.md)：parameters → execute → canonical value → output.render；进入插件实践时读。
- [能力分层](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/user/develop/practice/index.md)：Definition / Provider / Consumer 的职责，以及何时值得拆成独立包。
- [工具作者参考](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cookbook/adding-a-tool.md)：取消、输入输出验证、策略和展示规则；写真实工具时查。
- [扩展 cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cookbook/extension-cookbook.md)：按需求挑工具、事件、服务、UI 或协议入口。
- [Session 格式与发布状态](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/session-format-status.md)：区分产品版本、当前 writer 和已发布 Session 格式；不能把 pre-stable 当成可随意破坏数据。
- [持久化类型变更审查](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/cookbook/reviewing-persistence-type-changes.md)：修改持久化数据时查类型确认和迁移义务。
- [开发指南](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/development.md)：将来运行与构建时核实环境、工作区与依赖，而不从旧课猜命令。
- [测试策略](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/docs/testing.md)：依据变更选行为测试、快照与其他检查；不能用“能加载”代替完整行为验证。

源码精读入口：

- [agent.ts](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/core/agent-loop/src/agent.ts)：先找 `turn` / `step`，随后才读 `prepareRequest`、`buildRequest`；观察继续与结束条件。
- [Session](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/core/session/src/index.ts)：`append` 是日志提交，`deriveMessages` 是模型历史投影，二者不是磁盘刷新。
- [tool-ask-user](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/interaction/tool-ask-user/src/index.ts)：真实工具插件的 name / inject / apply、输入输出及委托服务。
- [工具注册器](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/core/tools/src/index.ts)：`register` 自带 effect 管理；`execute` 执行管线比直接调用工具函数多出策略与校验。
- [checkpoint-policy](https://github.com/deepseek-ai/deepseek-harness/blob/ddefc45fbc7f8e46dd73185e68295696d1297887/packages/session/session-checkpoint-policy/src/index.ts)：示范通过事件插件给执行过程增加持久化刷新策略。

## Wisdom (Communities)

- [官方 GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)：官方 README 指定的反馈与讨论入口；遇到设计取舍或待确认接口时，可整理最小复现和提交 SHA 再提问。
- [dsh-plugin 话题](https://github.com/topics/dsh-plugin)：官方 README 建议插件作者使用的发现入口；其中第三方仓库尚未逐个评估，不能作为接口权威。

本次在线核对了 [官方仓库 README](https://github.com/deepseek-ai/deepseek-harness)，确认开发预览及可能不兼容变化的说明。没有把在线分支与本地基线混为同一版本；没有核实所有社区内容或最新 release。

## Gaps

- 尚未明确用户要做的第一个插件业务场景；进入阶段 2 前再确定。
- 尚未实际运行 Harness、调用模型或执行插件；第一课是基于源码的机制演示。
- 尚未验证更新后的版本及迁移行为；当前事实只对应记录的本地基线。
- SDK、PTC、UI 插件、Session 恢复将在相关课前重新读对应源码，不提前给出未经核实的细节。
- agent-loop README 的部分 stream 描述与当前 assistant-stream.ts 有差异；第一课不教授逐 chunk 落盘，按 architecture 与实现区分临时 chunk 和最终结算。
