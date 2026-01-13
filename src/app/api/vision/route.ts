import { NextRequest, NextResponse } from "next/server";

/**
 * 视觉AI API - 识别屏幕上的UI元素
 * 集成视觉大模型（GPT-4V / Claude Vision / DeepSeek-Vision）
 */
export async function POST(request: NextRequest) {
  try {
    const { imageBase64, prompt } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "缺少图片数据" },
        { status: 400 }
      );
    }

    // 使用 DeepSeek Vision API（如果可用）或 OpenAI Vision API
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_KEY 
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

    if (!apiKey) {
      // 如果没有API Key，返回模拟数据用于开发
      return NextResponse.json({
        elements: [
          {
            type: "button",
            text: "Create Post",
            bounds: { x: 1200, y: 60, width: 120, height: 36 },
            confidence: 0.95,
          },
          {
            type: "input",
            text: "Search Reddit",
            bounds: { x: 400, y: 60, width: 600, height: 36 },
            confidence: 0.92,
          },
        ],
        detectedApp: "Reddit",
        timestamp: new Date().toISOString(),
      });
    }

    const systemPrompt = `你是一个专业的UI元素识别助手。分析用户提供的屏幕截图，识别出所有可交互的UI元素（按钮、输入框、链接、菜单等）。

返回JSON格式，包含：
- elements: 数组，每个元素包含 { type, text, bounds: {x, y, width, height}, confidence }
- detectedApp: 检测到的应用名称
- timestamp: 时间戳

只返回JSON，不要其他文字。`;

    const userPrompt = prompt || "识别屏幕上的所有可交互UI元素，返回它们的类型、文本内容和位置坐标。";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") 
                    ? imageBase64 
                    : `data:image/png;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Vision API error:", error);
      
      // 返回模拟数据作为降级方案
      return NextResponse.json({
        elements: [
          {
            type: "button",
            text: "Create Post",
            bounds: { x: 1200, y: 60, width: 120, height: 36 },
            confidence: 0.95,
          },
        ],
        detectedApp: "Unknown",
        timestamp: new Date().toISOString(),
        fallback: true,
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "{}";
    
    // 尝试解析JSON响应
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // 如果解析失败，尝试提取JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("无法解析AI响应");
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Vision API error:", error);
    
    // 返回模拟数据作为降级方案
    return NextResponse.json({
      elements: [],
      detectedApp: "Unknown",
      timestamp: new Date().toISOString(),
      error: error.message,
      fallback: true,
    });
  }
}
