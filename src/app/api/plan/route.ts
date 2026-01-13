import { NextRequest, NextResponse } from "next/server";
import { vectorStore } from "@/lib/vector-store";
import { getKnowledgeContext } from "@/lib/knowledge-store";
import { getChatModel, createPlanPrompt, stringParser } from "@/lib/langchain-config";

/**
 * 任务规划器 API - 基于知识库生成引导步骤
 * 使用 LangChain 进行 RAG 和任务规划
 */
export async function POST(request: NextRequest) {
  try {
    const { task, currentDemo, documents } = await request.json();

    if (!task) {
      return NextResponse.json(
        { error: "缺少任务描述" },
        { status: 400 }
      );
    }

    // 1. 从知识库中检索相关内容（RAG）
    const relevantChunks = await vectorStore.search(task, 10);
    const contextText = relevantChunks
      .map(chunk => chunk.content)
      .join("\n\n---\n\n");

    let steps: string[] = [];
    let estimatedTime = "5";
    let difficulty = "中等";

    try {
      // 2. 使用 LangChain 生成引导步骤
      const model = getChatModel();
      const prompt = createPlanPrompt();
      
      // 构建链
      const chain = prompt.pipe(model).pipe(stringParser);
      
      // 调用链
      const response = await chain.invoke({
        task,
        contextText: contextText || "暂无相关文档内容",
      });
      
      // 解析 JSON 响应
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          steps = result.steps || [];
          estimatedTime = result.estimatedTime || "5";
          difficulty = result.difficulty || "中等";
        } else {
          // 如果找不到 JSON，尝试从文本中提取步骤
          steps = extractStepsFromText(response);
        }
      } catch (parseError) {
        console.error("Parse LangChain response error:", parseError);
        // 如果解析失败，尝试从文本中提取步骤
        steps = extractStepsFromText(response);
      }
    } catch (langchainError: any) {
      console.error("LangChain error:", langchainError);
      
      // 检查是否是 MODEL_NOT_FOUND 错误
      if (langchainError.message?.includes('MODEL_NOT_FOUND') || 
          langchainError.message?.includes('model_not_found')) {
        console.warn('MODEL_NOT_FOUND error, falling back to direct API');
      }
      
      // 降级到直接 API 调用
      const fallbackResult = await fallbackToDirectAPI(task, contextText);
      if (fallbackResult) {
        steps = fallbackResult.steps;
        estimatedTime = fallbackResult.estimatedTime;
        difficulty = fallbackResult.difficulty;
      }
    }

    // 3. 如果没有生成步骤，使用基于知识库的简单生成
    if (steps.length === 0) {
      steps = relevantChunks
        .slice(0, 6)
        .map((chunk, index) => {
          const stepMatch = chunk.content.match(/(?:步骤|Step|①|②|③|④|⑤|⑥)\s*[：:]\s*(.+?)(?:\n|$)/);
          if (stepMatch) {
            return stepMatch[1].trim();
          }
          return chunk.content.slice(0, 50).trim() + "...";
        })
        .filter(step => step.length > 10);
      
      if (steps.length === 0) {
        steps = [
          "打开目标软件",
          "定位相关功能模块",
          "执行主要操作",
          "验证操作结果",
        ];
      }
    }

    return NextResponse.json({
      steps,
      estimatedTime,
      difficulty,
      relevantChunksCount: relevantChunks.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Plan API error:", error);
    return NextResponse.json(
      {
        steps: ["打开软件", "执行操作", "完成任务"],
        estimatedTime: "5",
        difficulty: "简单",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// 从文本中提取步骤
function extractStepsFromText(text: string): string[] {
  const stepPatterns = [
    /(?:步骤|Step)\s*(\d+)[:：]\s*(.+)/gi,
    /(?:①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)\s*(.+)/g,
    /^\d+\.\s*(.+)$/gm,
  ];
  
  const steps: string[] = [];
  
  for (const pattern of stepPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const step = match[1] || match[0];
      if (step && step.length > 5 && step.length < 200) {
        steps.push(step.trim());
      }
    }
  }
  
  return steps.length > 0 ? steps : [];
}

// 降级方案：直接 API 调用
async function fallbackToDirectAPI(task: string, contextText: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `你是一个专业的软件操作引导助手。基于用户提供的知识库文档，将任务拆解为清晰的操作步骤。

要求：
1. 步骤要具体、可操作
2. 每个步骤应该明确指出要点击/操作哪个UI元素
3. 步骤数量根据任务复杂度决定（简单任务3-5步，复杂任务6-10步）
4. 使用简洁的中文描述

返回JSON格式：
{
  "steps": ["步骤1", "步骤2", ...],
  "estimatedTime": "预计完成时间（分钟）",
  "difficulty": "简单|中等|复杂"
}

只返回JSON，不要其他文字。`;

  // 根据 DeepSeek 官方文档：https://api-docs.deepseek.com/zh-cn/
  // API 端点：https://api.deepseek.com/chat/completions
  const apiUrl = process.env.DEEPSEEK_API_KEY 
    ? "https://api.deepseek.com/chat/completions"
    : "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `任务：${task}\n\n${contextText ? `相关文档内容：\n${contextText}\n\n` : ""}请基于以上知识库内容，生成详细的操作步骤。` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0]?.message?.content || "{}";
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error("Fallback API error:", error);
  }
  
  return null;
}
