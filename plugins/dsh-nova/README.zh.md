<p align="center">
  <img src="icon.svg" width="96" alt="Nova 图标">
</p>

<h1 align="center">Nova · 推理星轨</h1>

<p align="center">
  在 DeepSeek Harness 输入框里，把四档推理强度做成一片可以拖动的小宇宙。
  <br>
  <a href="README.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/FanXi1230/fanxi/actions/workflows/dsh-nova.yml"><img alt="CI" src="https://github.com/FanXi1230/fanxi/actions/workflows/dsh-nova.yml/badge.svg"></a>
  <img alt="DSH 0.2.1-rc.2" src="https://img.shields.io/badge/DSH-0.2.1--rc.2-4d6bfe">
  <a href="LICENSE"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-2ea44f"></a>
</p>

![Nova 的 Max 档](assets/screenshots/max.png)

## 输入框里的小宇宙

Nova 把原本的推理强度菜单换成一条可拖拽的四档滑轨，并为每一档准备了一套不同的宇宙场景：

| 档位 | 场景 |
| --- | --- |
| `Off` | 最淡的星尘和一条缓慢漂移的微光 |
| `Low` | 蓝色极光缓慢唤醒，星辰开始变密 |
| `High` | 靛紫极光更强，多一条穿行光点和能量光线 |
| `Max` | 深空星场、六色星云带循环推挤、蓝白闪电、紫色横向闪光和缓慢白色扫光 |

档位之间不是硬切换：滑块越过某个档位后，旧场景淡出、新场景淡入，星辰、极光、光晕和填充色一起过渡。拖动时只有真正越过下一档刻度，场景才会开始切换。

## 功能

- 鼠标拖动、点击轨道或使用方向键均可切换，松手后吸附到 `Off` / `Low` / `High` / `Max`。
- 右侧模型菜单与 Nova 共享同一份真实状态，任意一边改变，另一边同步。
- 选中的档位通过 DSH 官方 `session.selectModel({ provider, model, reasoningEffort })` 写入当前会话，是下一条请求真实使用的推理参数。
- 空白新会话和已有会话都会显示；控件注册在输入框模型行的 `conversation.input.right`。
- 裁剪边界是整个控件模块的圆角边框：特效可以越过蓝色进度条，但不能画到模块外。
- 样式跟随当前 DSH 主题，支持 `prefers-reduced-motion`。

## 环境要求

- DeepSeek Harness Web UI `0.2.1-rc.2` 或同版本线中更新的 `0.2.1` 构建。
- 使用默认 Web profile 自带的 `ui-conversation`、`ui-model-selection` 插件。
- 当前模型必须声明全部四个原生档位。DeepSeek 账号 / API Key 路由满足；其他模型不满足时滑轨自动隐藏。

## 安装

### 从插件市场安装

Nova 已提交到 DSH 插件市场 / Discover 目录，上架后可在插件市场一键安装。

### 从 GitHub Release 安装

```sh
dsh plugin --profile web add \
  https://github.com/FanXi1230/fanxi/releases/latest/download/dsh-nova.tgz
```

如果安装后没有立即出现，重启 `dsh web`。

### 开发时从仓库目录安装

```sh
git clone https://github.com/FanXi1230/fanxi.git
cd fanxi/plugins/dsh-nova
node scripts/validate.mjs
```

然后用 DSH 插件管理器添加这个本地包目录，或执行 `dsh plugin --profile <profile> add <package-directory>`。

## 实现方式

这是一个标准 DSH bundle：Host 半侧为空；Client 半侧读取 `ctx.modelDirectories.directoryFor(sessionId)` 的会话模型目录，并调用与 DSH 自己模型菜单相同的 `directory.select(...)`。插件不额外存会话状态、不发起网络请求、不保存凭据。

宇宙效果由 CSS 和 SVG 组成。星辰是真实的 React 节点，会在闪烁周期之间换位置、换颜色；每个档位保留自己的星层，所以切换时是交叉淡化而不是突然替换。整个模块根节点会把所有图层裁剪在圆角边框内。

## 校验

仓库自带无外部依赖的校验脚本：

```sh
node scripts/validate.mjs
```

它会检查 bundle 清单、patch、模块标识、locale JSON、截图、许可证与 JavaScript 语法。插件目录变更时，GitHub Actions 会运行同一命令。

## 许可证

本插件使用 [MIT License](LICENSE)。

外层 `fanxi` 仓库有自己的 AGPL-3.0 许可证；本插件位于独立包目录中，单独使用 MIT。
