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
    let requiresApproval = false;
    let hasErrorHandling = false;
    let subTasks: any[] = [];

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
          requiresApproval = result.requiresApproval || false;
          hasErrorHandling = result.hasErrorHandling || false;
          subTasks = result.subTasks || [];
          
          // 如果有子任务，将子任务的步骤也合并到主步骤中
          if (subTasks.length > 0) {
            const allSubSteps: string[] = [];
            subTasks.forEach((subTask: any) => {
              allSubSteps.push(`【${subTask.name}】`);
              if (subTask.steps && Array.isArray(subTask.steps)) {
                allSubSteps.push(...subTask.steps);
              }
            });
            if (allSubSteps.length > 0) {
              steps = [...steps, ...allSubSteps];
            }
          }
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
        requiresApproval = fallbackResult.requiresApproval || false;
        hasErrorHandling = fallbackResult.hasErrorHandling || false;
        subTasks = fallbackResult.subTasks || [];
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
      requiresApproval,
      hasErrorHandling,
      subTasks,
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

  const systemPrompt = `你是一个专业的软件操作引导助手。基于用户提供的知识库文档，将复杂任务拆解为详细、可执行的操作步骤。

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
{
  "steps": ["详细步骤1", "详细步骤2", ...],
  "estimatedTime": "预计完成时间（分钟）",
  "difficulty": "简单|中等|复杂|企业级",
  "requiresApproval": true/false,
  "hasErrorHandling": true/false,
  "subTasks": [
    {
      "name": "子任务名称",
      "steps": ["子步骤1", "子步骤2"]
    }
  ]
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
