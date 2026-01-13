# 🔗 LangChain 集成说明

## 已完成的集成

### 1. **安装 LangChain 包**
```bash
npm install @langchain/core @langchain/openai langchain
```

### 2. **LangChain 配置** (`src/lib/langchain-config.ts`)
- ✅ 统一管理 LLM 模型配置
- ✅ 支持 DeepSeek 和 OpenAI
- ✅ 正确的 baseURL 配置（避免 MODEL_NOT_FOUND 错误）
- ✅ 提示模板管理

### 3. **重构的 API**

#### Chat API (`src/app/api/chat/route.ts`)
- ✅ 使用 LangChain 的 ChatOpenAI
- ✅ 支持知识库上下文注入
- ✅ 自动降级到直接 API 调用（如果 LangChain 失败）

#### Plan API (`src/app/api/plan/route.ts`)
- ✅ 使用 LangChain 进行任务规划
- ✅ RAG 集成（向量检索 + LangChain）
- ✅ JSON 输出解析
- ✅ 错误处理和降级方案

## MODEL_NOT_FOUND 错误处理

根据 [LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/errors/MODEL_NOT_FOUND)，我们已经实现了：

1. **正确的模型名称**：
   - DeepSeek: `deepseek-chat`
   - OpenAI: `gpt-4o-mini`

2. **正确的 baseURL 配置**：
   ```typescript
   configuration: {
     baseURL: "https://api.deepseek.com/v1"
   }
   ```

3. **错误检测和降级**：
   - 检测 MODEL_NOT_FOUND 错误
   - 自动降级到直接 API 调用
   - 确保功能始终可用

## 使用方式

### 环境变量
```env
# DeepSeek（推荐）
DEEPSEEK_API_KEY=sk-your-key-here

# 或 OpenAI
OPENAI_API_KEY=sk-your-key-here
```

### 代码示例

```typescript
import { getChatModel, createKnowledgePrompt, stringParser } from '@/lib/langchain-config';

// 获取模型
const model = getChatModel();

// 创建提示
const prompt = createKnowledgePrompt();

// 构建链
const chain = prompt.pipe(model).pipe(stringParser);

// 调用
const response = await chain.invoke({
  knowledgeContext: "知识库内容...",
  messages: [["user", "用户问题"]],
});
```

## 优势

1. **统一的接口**：所有 LLM 调用通过 LangChain
2. **更好的错误处理**：自动检测和处理 MODEL_NOT_FOUND
3. **易于扩展**：可以轻松添加更多 LangChain 功能（RAG、Agents 等）
4. **降级方案**：即使 LangChain 失败，也能正常工作

## 故障排查

如果遇到 MODEL_NOT_FOUND 错误：

1. **检查模型名称**：确保使用 `deepseek-chat`（不是 `deepseek-v2` 或其他）
2. **检查 baseURL**：应该是 `https://api.deepseek.com/v1`
3. **检查 API Key**：确保正确配置
4. **查看日志**：系统会自动降级到直接 API 调用

## 下一步

可以进一步集成：
- LangChain RAG（RetrievalQAChain）
- LangChain Agents（用于复杂任务）
- LangChain Memory（对话历史管理）
- LangChain Tools（外部工具集成）
