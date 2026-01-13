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
  const baseURL = process.env.DEEPSEEK_API_KEY
    ? "https://api.deepseek.com"
    : undefined;

  // 模型名称 - 确保使用正确的模型标识符
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
  // 注意：DeepSeek API 的完整路径是 https://api.deepseek.com/v1
  if (baseURL) {
    config.configuration = {
      baseURL: `${baseURL}/v1`,
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
    ["system", `你是一个专业的软件操作引导助手。基于用户提供的知识库文档，将任务拆解为清晰的操作步骤。

要求：
1. 步骤要具体、可操作
2. 每个步骤应该明确指出要点击/操作哪个UI元素
3. 步骤数量根据任务复杂度决定（简单任务3-5步，复杂任务6-10步）
4. 使用简洁的中文描述

返回JSON格式：
{{
  "steps": ["步骤1", "步骤2", ...],
  "estimatedTime": "预计完成时间（分钟）",
  "difficulty": "简单|中等|复杂"
}}

只返回JSON，不要其他文字。`],
    ["user", `任务：{task}

{contextText}

请基于以上知识库内容，生成详细的操作步骤。`],
  ]);
}

// 输出解析器
export const stringParser = new StringOutputParser();
