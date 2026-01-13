# 🧭 AI Navigation System | 智能软件导航系统

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.1.0-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-lightgrey?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Alpha-orange?style=flat-square" />
</p>

<p align="center">
  <strong>覆盖在操作系统之上的智能引导层，让每个人都能零摩擦地掌握复杂软件。</strong>
</p>

<p align="center">
  <a href="#-愿景">愿景</a> •
  <a href="#-核心能力">核心能力</a> •
  <a href="#-技术架构">技术架构</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-加入我们">加入我们</a>
</p>

---

## 🌟 愿景

> **"消除人与软件之间的最后一道鸿沟。"**

我们相信，未来的人机交互不应该让用户去"学习"软件，而是让软件"理解"用户。

AI Navigation System 是一个革命性的概念验证项目：**一个浮动在任何软件之上的智能引导层**。它能够：
- 📸 **实时感知屏幕** — 理解你当前正在使用的软件界面
- 🧠 **解析操作逻辑** — 将说明书转化为可执行的知识图谱
- 🎯 **动态视觉引导** — 用高亮框和箭头直接在屏幕上指引你的下一步操作

这不是一个教程网站，不是一个聊天机器人，而是一个**真正"看得见"你屏幕的 AI 助手**。

---

## 💼 工作流程

```
┌──────────────────────────────────────────────────────────────────┐
│  ① 上传知识库                                                      │
│     企业/用户上传软件说明书、操作手册、内部文档                         │
│                              ↓                                     │
│  ② AI 解析生成知识图谱                                              │
│     自动提取操作步骤、UI 元素映射、异常处理逻辑                         │
│                              ↓                                     │
│  ③ 用户提出需求                                                     │
│     "帮我在这个 CRM 系统中创建一个客户档案"                            │
│                              ↓                                     │
│  ④ AI 实时引导                                                      │
│     屏幕上叠加高亮框 + 箭头，一步步指引操作                            │
│                              ↓                                     │
│  ⑤ 任务完成 / 异常修正                                              │
│     自动检测错误操作，即时提供修正引导                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎬 产品预览

<p align="center">
  <img src="./docs/preview.png" alt="Product Preview" width="800" />
</p>

*右侧为 AI 指令中心，可实时读取左侧的任意软件界面，并进行视觉引导。*

---

## 🚀 核心能力

### 1. 企业知识库上传系统 (Enterprise Knowledge Upload)
- **📚 文档智能解析**：上传企业内部软件说明书、操作手册、SOP 文档
- **🔄 自动知识图谱生成**：将非结构化文档转化为可执行的操作逻辑树
- **🏢 私有化部署支持**：企业可部署专属知识库，保障数据安全
- **📖 多格式支持**：PDF、Word、Markdown、Confluence 等主流文档格式

### 2. 屏幕感知引擎 (Visual Perception Engine)
- 基于 Electron `desktopCapturer` 实现真实的全屏捕获
- 实时帧率监控（可达 2+ FPS 持续刷新）
- 未来计划接入视觉大模型（GPT-4V / Claude Vision）进行 UI 元素识别

### 3. 任务规划器 (Task Planner)
- 将模糊的自然语言（如"帮我做一个登录页"）拆解为结构化步骤
- **基于用户上传的知识库**动态生成引导路径
- 动态调整引导路径，支持异常拦截与修正
- 基于 RAG（检索增强生成）快速定位文档中的操作指南

### 4. 沉浸式交互层 (Immersive UX Layer)
- **非侵入式高亮框**：精准标记目标 UI 元素
- **动态箭头指引**：实时引导用户视线
- **悬浮指令面板**：苹果级设计，可随时与 AI 对话

### 5. 跨软件通用架构
- 适配从设计工具（Figma）到开发 IDE（PyCharm）的不同界面风格
- **知识库可扩展**：支持上传任意软件的说明书，AI 即刻生成专属引导

---

## 🏗️ 技术架构

```
┌──────────────────────────────────────────────────────────────────┐
│                      AI Navigation System                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   📁 知识库上传入口                                                 │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  PDF / Word / Markdown / Confluence / 内部文档            │    │
│   └───────────────────────────┬─────────────────────────────┘    │
│                               ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │           Document Parser + Knowledge Graph Builder       │    │
│   │          (文档解析 → 向量化 → 知识图谱 → 操作逻辑树)         │    │
│   └───────────────────────────┬─────────────────────────────┘    │
│                               ▼                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐       │
│  │   Electron  │  │   Next.js   │  │   Framer Motion     │       │
│  │   (桌面壳)   │  │   (渲染层)   │  │   (动画引擎)         │       │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘       │
│         │                │                    │                   │
│         ▼                ▼                    ▼                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │              Screen Perception Engine                    │     │
│  │         (desktopCapturer + 视觉感知逻辑)                  │     │
│  └─────────────────────────────────────────────────────────┘     │
│                          │                                        │
│                          ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                   Task Planner (RAG)                     │     │
│  │    (基于用户知识库的检索增强 + 动态引导路径生成 + 异常拦截)    │     │
│  └─────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

**技术栈**：
- **框架**: Next.js 16 + TypeScript
- **桌面**: Electron 39
- **样式**: Tailwind CSS 4.0
- **动画**: Framer Motion
- **图标**: Lucide React

---

## 📦 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/mm1025048717-hash/ai-navigation-system.git
cd ai-navigation-system

# 安装依赖
npm install

# 启动开发模式（浏览器预览）
npm run dev

# 启动桌面应用（真实屏幕读取）
npm run app
```

### 构建生产版本

```bash
npm run build
```

---

## 🤝 加入我们

这是一个**早期概念验证项目**，我们正在寻找志同道合的开发者共同打造下一代人机交互范式。

### 我们需要你，如果你：
- 🎨 **前端工程师** — 对极致交互体验有执念
- 🧠 **AI/ML 工程师** — 熟悉视觉大模型（GPT-4V, Claude Vision）
- 🖥️ **桌面应用开发者** — 精通 Electron / Tauri
- 📐 **产品设计师** — 热爱苹果级的简约美学

### 如何贡献
1. Fork 本仓库
2. 创建你的 Feature 分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 联系方式
- **GitHub**: [@mm1025048717-hash](https://github.com/mm1025048717-hash)
- **X (Twitter)**: [@chenxuanren4](https://x.com/chenxuanren4)
- **YouTube**: [@web3scholar_cn](https://youtube.com/@web3scholar_cn)

---

## 📄 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

---

## 🙏 致谢

感谢所有相信"AI 应该服务于人，而不是让人去适应 AI"的理想主义者。

> *"The best interface is no interface."*  
> *— Golden Krishna*

---

<p align="center">
  <strong>⭐ 如果这个项目启发了你，请给我们一颗星！</strong>
</p>
