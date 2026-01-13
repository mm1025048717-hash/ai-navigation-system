import { NextRequest, NextResponse } from "next/server";
import { vectorStore } from "@/lib/vector-store";
import { getKnowledgeContext } from "@/lib/knowledge-store";

/**
 * 任务规划器 API - 基于知识库生成引导步骤
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

    // 1. 从知识库中检索相关内容
    const relevantChunks = await vectorStore.search(task, 10);
    
    // 2. 构建上下文
    const knowledgeContext = getKnowledgeContext();
    const contextText = relevantChunks
      .map(chunk => chunk.content)
      .join("\n\n---\n\n");

    // 3. 调用AI生成引导步骤
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_KEY 
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

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

    const userPrompt = `任务：${task}

${contextText ? `相关文档内容：\n${contextText}\n\n` : ""}
请基于以上知识库内容，生成详细的操作步骤。`;

    let steps: string[] = [];
    let estimatedTime = "5";
    let difficulty = "中等";

    if (apiKey) {
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
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content || "{}";
          
          try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const result = JSON.parse(jsonMatch[0]);
              steps = result.steps || [];
              estimatedTime = result.estimatedTime || "5";
              difficulty = result.difficulty || "中等";
            }
          } catch (parseError) {
            console.error("Parse AI response error:", parseError);
          }
        }
      } catch (apiError) {
        console.error("AI API error:", apiError);
      }
    }

    // 如果没有生成步骤或API失败，使用基于知识库的简单生成
    if (steps.length === 0) {
      // 从相关文档块中提取步骤
      steps = relevantChunks
        .slice(0, 6)
        .map((chunk, index) => {
          // 尝试从内容中提取步骤
          const stepMatch = chunk.content.match(/(?:步骤|Step|①|②|③|④|⑤|⑥)\s*[：:]\s*(.+?)(?:\n|$)/);
          if (stepMatch) {
            return stepMatch[1].trim();
          }
          // 如果没有找到步骤格式，使用前50个字符作为步骤
          return chunk.content.slice(0, 50).trim() + "...";
        })
        .filter(step => step.length > 10);
      
      // 如果还是没有步骤，生成默认步骤
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
