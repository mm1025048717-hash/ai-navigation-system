# 🔗 LangChain 在项目中的使用位置

## 📍 LangChain 的核心体现

LangChain 在项目中主要在两个 API 路由中使用，用于处理 AI 对话和任务规划。

---

## 1. **AI 对话 API** (`src/app/api/chat/route.ts`)

### 使用位置
```typescript
// 第 18-44 行
try {
  // 使用 LangChain
  const model = getChatModel();              // ← LangChain ChatOpenAI 模型
  const prompt = createKnowledgePrompt();    // ← LangChain 提示模板
  const chain = prompt.pipe(model).pipe(stringParser);  // ← LangChain 链式调用
  
  // 转换消息格式为 LangChain 格式
  const { HumanMessage, AIMessage } = await import('@langchain/core/messages');
  const langchainMessages = messages.map((m: any) => {
    if (m.role === 'user') {
      return new HumanMessage(m.content);    // ← LangChain 消息类型
    } else if (m.role === 'assistant') {
      return new AIMessage(m.content);
    }
  });
  
  // 调用链
  const response = await chain.invoke({      // ← LangChain 链式调用
    knowledgeContext: knowledgeContext,
    messages: langchainMessages,
  });
}
```

### 作用
- ✅ **统一模型管理**：通过 `getChatModel()` 统一配置 DeepSeek/OpenAI
- ✅ **提示模板管理**：使用 `ChatPromptTemplate` 管理复杂的系统提示
- ✅ **消息格式转换**：自动将普通消息转换为 LangChain 的 `HumanMessage`/`AIMessage`
- ✅ **链式处理**：使用 `prompt.pipe(model).pipe(parser)` 实现流式处理

### 实际效果
当你发送消息时，LangChain 会：
1. 加载配置的模型（DeepSeek）
2. 应用提示模板（包含知识库上下文）
3. 处理消息历史
4. 返回格式化的响应

---

## 2. **任务规划 API** (`src/app/api/plan/route.ts`)

### 使用位置
```typescript
// 第 31-43 行
try {
  // 2. 使用 LangChain 生成引导步骤
  const model = getChatModel();              // ← LangChain ChatOpenAI 模型
  const prompt = createPlanPrompt();         // ← LangChain 任务规划提示模板
  
  // 构建链
  const chain = prompt.pipe(model).pipe(stringParser);  // ← LangChain 链式调用
  
  // 调用链
  const response = await chain.invoke({      // ← LangChain 链式调用
    task,
    contextText: contextText || "暂无相关文档内容",
  });
}
```

### 作用
- ✅ **RAG 集成**：结合向量检索（`vectorStore.search`）和 LangChain 生成步骤
- ✅ **结构化输出**：使用提示模板生成 JSON 格式的步骤列表
- ✅ **任务分解**：将复杂任务拆解为可操作的步骤

### 实际效果
当你选择软件并生成引导步骤时，LangChain 会：
1. 从知识库中检索相关内容（RAG）
2. 使用 LangChain 的提示模板生成结构化步骤
3. 解析 JSON 响应并返回步骤列表

---

## 3. **配置模块** (`src/lib/langchain-config.ts`)

### 核心功能

#### `getChatModel()` - 模型配置
```typescript
export function getChatModel() {
  // 创建 LangChain ChatOpenAI 实例
  return new ChatOpenAI({
    modelName: "deepseek-chat",
    openAIApiKey: apiKey,
    configuration: {
      baseURL: "https://api.deepseek.com/v1",  // DeepSeek API
    },
    temperature: 0.7,
    maxTokens: 2000,
  });
}
```

#### `createKnowledgePrompt()` - 对话提示模板
```typescript
export function createKnowledgePrompt() {
  return ChatPromptTemplate.fromMessages([
    ["system", "你是 AI Navigator 智能助手..."],
    new MessagesPlaceholder("messages"),  // ← LangChain 消息占位符
  ]);
}
```

#### `createPlanPrompt()` - 任务规划提示模板
```typescript
export function createPlanPrompt() {
  return ChatPromptTemplate.fromMessages([
    ["system", "你是一个专业的软件操作引导助手..."],
    ["user", "任务：{task}\n\n{contextText}"],
  ]);
}
```

---

## 🎯 LangChain 的优势体现

### 1. **统一接口**
- 所有 LLM 调用都通过 LangChain，便于切换模型
- 支持 DeepSeek、OpenAI 等多种模型

### 2. **提示模板管理**
- 复杂的系统提示被封装在模板中
- 易于维护和修改

### 3. **链式处理**
```typescript
const chain = prompt.pipe(model).pipe(stringParser);
```
- 清晰的数据流：提示 → 模型 → 解析器
- 易于扩展（可以添加更多中间步骤）

### 4. **错误处理**
- 自动检测 `MODEL_NOT_FOUND` 错误
- 降级到直接 API 调用，确保功能可用

---

## 🔍 如何验证 LangChain 正在工作

### 方法 1：查看控制台日志
```bash
# 如果 LangChain 正常工作，不会有错误
# 如果出错，会看到：
# "LangChain error: ..."
# 然后自动降级到直接 API 调用
```

### 方法 2：检查网络请求
1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 发送一条消息
4. 查看 `/api/chat` 请求
5. 如果使用 LangChain，响应会更快且格式更统一

### 方法 3：查看代码执行流程
在 `src/app/api/chat/route.ts` 第 50 行添加日志：
```typescript
console.log('Using LangChain:', !langchainError);
```

---

## 📊 LangChain vs 直接 API 调用

| 特性 | LangChain | 直接 API 调用 |
|------|-----------|--------------|
| **代码组织** | ✅ 更清晰，链式调用 | ❌ 嵌套的 fetch 调用 |
| **提示管理** | ✅ 模板化，易维护 | ❌ 字符串拼接 |
| **错误处理** | ✅ 统一处理 | ❌ 分散处理 |
| **扩展性** | ✅ 易于添加中间件 | ❌ 需要修改多处代码 |
| **降级方案** | ✅ 自动降级 | ✅ 直接可用 |

---

## 🚀 未来可以扩展的 LangChain 功能

1. **RAG 链**：使用 `RetrievalQAChain` 进行更智能的文档检索
2. **Agents**：使用 LangChain Agents 处理复杂任务
3. **Memory**：使用 LangChain Memory 管理对话历史
4. **Tools**：集成外部工具（如文件操作、API 调用）
5. **Streaming**：使用 LangChain 的流式输出功能

---

## 📝 总结

LangChain 在项目中的体现：
- ✅ **后端 API**：`/api/chat` 和 `/api/plan` 使用 LangChain
- ✅ **配置模块**：`src/lib/langchain-config.ts` 统一管理
- ✅ **提示模板**：使用 `ChatPromptTemplate` 管理提示
- ✅ **链式处理**：使用 `pipe()` 实现数据流
- ✅ **错误处理**：自动降级机制确保可用性

虽然用户界面看不到 LangChain，但它**在后台处理所有的 AI 对话和任务规划**，提供了更稳定、更易维护的代码结构。
