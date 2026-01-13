/**
 * LangChain 配置
 * 用于统一管理 LLM 模型配置
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// 获取配置的模型
export function getChatModel() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("未配置 API Key，请在 .env.local 中设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY");
  }

  // DeepSeek 使用 OpenAI 兼容接口
  // 根据官方文档：https://api-docs.deepseek.com/zh-cn/
  // base_url 可以是 https://api.deepseek.com 或 https://api.deepseek.com/v1
  const baseURL = process.env.DEEPSEEK_API_KEY
    ? "https://api.deepseek.com"  // 官方推荐使用不带 /v1 的版本
    : undefined;

  // 模型名称 - 确保使用正确的模型标识符
  // deepseek-chat: DeepSeek-V3.2 非思考模式
  // deepseek-reasoner: DeepSeek-V3.2 思考模式
  const modelName = process.env.DEEPSEEK_API_KEY
    ? "deepseek-chat"  // DeepSeek 的模型名称
    : "gpt-4o-mini";   // OpenAI 的模型名称

  // 构建配置对象
  const config: any = {
    modelName,
    openAIApiKey: apiKey,
    temperature: 0.7,
    maxTokens: 2000,
  };

  // 如果使用 DeepSeek，需要设置 baseURL
  // 根据官方文档：https://api-docs.deepseek.com/zh-cn/
  // base_url 可以是 https://api.deepseek.com 或 https://api.deepseek.com/v1
  // 为了兼容 LangChain，我们使用 https://api.deepseek.com/v1
  if (baseURL) {
    config.configuration = {
      baseURL: `${baseURL}/v1`,  // LangChain 需要完整的 /v1 路径
    };
  }

  try {
    return new ChatOpenAI(config);
  } catch (error: any) {
    // 如果配置失败，尝试不使用 configuration 对象
    console.warn("LangChain config error, trying alternative:", error.message);
    return new ChatOpenAI({
      modelName,
      openAIApiKey: apiKey,
      temperature: 0.7,
      maxTokens: 2000,
      ...(baseURL && { configuration: { baseURL: `${baseURL}/v1` } }),
    });
  }
}

// 创建带知识库的提示模板
export function createKnowledgePrompt() {
  return ChatPromptTemplate.fromMessages([
    ["system", `你是 AI Navigator 智能助手，专门帮助用户学习和操作软件。

你的核心能力：
1. 基于用户上传的知识库文档，提供精准的操作指导
2. 将复杂的软件操作分解为简单的步骤
3. 实时回答用户的问题，提供视觉引导建议
4. 当用户遇到错误时，提供修正方案

{knowledgeContext}

请基于以上知识库内容（如果有的话）回答用户问题。如果问题超出知识库范围，请诚实说明并提供通用建议。

回复格式要求：
- 使用简洁的中文
- 如果涉及操作步骤，使用有序列表
- 突出关键操作和注意事项
- 适当使用 emoji 增强可读性`],
    new MessagesPlaceholder("messages"),
  ]);
}

// 创建任务规划提示模板
export function createPlanPrompt() {
  return ChatPromptTemplate.fromMessages([
    ["system", `你是一个专业的软件操作引导助手。基于用户提供的知识库文档，将复杂任务拆解为详细、可执行的操作步骤。

**核心要求：**
1. **详细程度**：每个步骤必须明确指出：
   - 具体要操作的UI元素（按钮名称、菜单路径、输入框位置等）
   - 操作方式（点击、输入、选择、拖拽等）
   - 预期结果或验证方法
   
2. **步骤数量**：
   - 简单任务：5-8步
   - 中等任务：8-12步
   - 复杂任务：12-20步
   - 企业级复杂流程：20-30步
   
3. **复杂场景处理**：
   - 包含条件分支说明（如果出现X情况，则执行Y）
   - 包含错误处理步骤（如果操作失败，如何回退或修正）
   - 包含数据验证步骤（如何确认操作成功）
   - 包含多系统集成步骤（需要跨软件操作时）
   
4. **企业级流程**：
   - 支持多角色协作流程
   - 支持审批和审核环节
   - 支持数据同步和备份
   - 支持合规性检查

5. **步骤描述格式**：
   - 使用动作词开头（点击、输入、选择、打开、配置等）
   - 明确指出UI元素位置（顶部菜单、左侧面板、右侧属性等）
   - 包含参数说明（输入什么值、选择什么选项）
   - 包含验证方法（如何确认操作成功）

返回JSON格式：
{{
  "steps": ["详细步骤1", "详细步骤2", ...],
  "estimatedTime": "预计完成时间（分钟）",
  "difficulty": "简单|中等|复杂|企业级",
  "requiresApproval": true/false,
  "hasErrorHandling": true/false,
  "subTasks": [
    {{
      "name": "子任务名称",
      "steps": ["子步骤1", "子步骤2"]
    }}
  ]
}}

只返回JSON，不要其他文字。`],
    ["user", `任务：{task}

相关文档内容：
{contextText}

请基于以上知识库内容，生成详细、可执行的操作步骤。对于复杂任务，请拆解为尽可能详细的步骤，确保用户可以按照步骤完成整个流程。`],
  ]);
}

// 输出解析器
export const stringParser = new StringOutputParser();
