import { NextRequest, NextResponse } from 'next/server';

// 知识库上下文存储（在实际生产中应使用数据库）
let knowledgeContext: string = '';

export async function POST(request: NextRequest) {
  try {
    const { messages, knowledge } = await request.json();
    
    // 更新知识上下文
    if (knowledge) {
      knowledgeContext = knowledge;
    }
    
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // 构建系统提示
    const systemPrompt = `你是 AI Navigator 智能助手，专门帮助用户学习和操作软件。

你的核心能力：
1. 基于用户上传的知识库文档，提供精准的操作指导
2. 将复杂的软件操作分解为简单的步骤
3. 实时回答用户的问题，提供视觉引导建议
4. 当用户遇到错误时，提供修正方案

${knowledgeContext ? `## 用户知识库内容\n${knowledgeContext}\n` : ''}

请基于以上知识库内容（如果有的话）回答用户问题。如果问题超出知识库范围，请诚实说明并提供通用建议。

回复格式要求：
- 使用简洁的中文
- 如果涉及操作步骤，使用有序列表
- 突出关键操作和注意事项
- 适当使用 emoji 增强可读性`;

    // 使用 DeepSeek API（兼容 OpenAI 格式）
    // 文档: https://api-docs.deepseek.com/zh-cn/
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (apiKey) {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat', // DeepSeek-V3.2 非思考模式
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', errorText);
        throw new Error('DeepSeek API error');
      }

      const data = await response.json();
      return NextResponse.json({
        role: 'assistant',
        content: data.choices[0].message.content,
      });
    }
    
    // 如果没有 API 密钥，使用智能模拟回复
    const simulatedResponse = generateSmartResponse(lastMessage, knowledgeContext);
    
    return NextResponse.json({
      role: 'assistant',
      content: simulatedResponse,
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 智能模拟回复（当没有 API 密钥时）
function generateSmartResponse(userMessage: string, knowledge: string): string {
  const msg = userMessage.toLowerCase();
  
  // 如果有知识库内容，尝试从中提取相关信息
  if (knowledge) {
    const knowledgeLines = knowledge.split('\n').filter(l => l.trim());
    
    // 关键词匹配
    const keywords = msg.split(/\s+/).filter(k => k.length > 1);
    const relevantLines = knowledgeLines.filter(line => 
      keywords.some(kw => line.toLowerCase().includes(kw))
    );
    
    if (relevantLines.length > 0) {
      return `📚 根据你上传的知识库，我找到了相关信息：

${relevantLines.slice(0, 3).map((l, i) => `${i + 1}. ${l}`).join('\n')}

💡 建议操作步骤：
1. 首先确认当前界面位置
2. 按照上述指引进行操作
3. 如有疑问，随时向我提问

需要我进一步解释某个步骤吗？`;
    }
  }

  // 通用回复模式
  if (msg.includes('怎么') || msg.includes('如何') || msg.includes('怎样')) {
    return `🎯 关于你的问题，我来帮你分析：

**建议操作步骤：**
1. 首先，请确认你当前所在的界面
2. 点击左侧高亮区域开始引导流程
3. 跟随蓝色高亮框和箭头进行操作

💡 **提示**：如果你上传了软件说明文档，我可以提供更精准的指导！

还有其他问题吗？`;
  }
  
  if (msg.includes('错误') || msg.includes('失败') || msg.includes('不行')) {
    return `⚠️ 遇到问题了？让我帮你排查：

**常见解决方案：**
1. 检查是否点击了正确的目标区域
2. 确认当前步骤是否已完成
3. 尝试点击"跳过此步"继续

🔧 如果问题持续，请描述具体错误信息，我会提供针对性帮助。`;
  }
  
  if (msg.includes('上传') || msg.includes('文档') || msg.includes('知识库')) {
    return `📁 关于知识库上传：

**支持的文档格式：**
- 📄 TXT 文本文件
- 📝 Markdown 文件
- 📋 其他纯文本格式

**上传后我能做什么：**
1. 解析文档内容，建立知识图谱
2. 基于文档回答你的具体问题
3. 生成针对性的操作引导步骤

点击上方「上传知识库」按钮开始上传！`;
  }

  // 默认回复
  return `👋 收到你的消息！

我是 AI Navigator 智能助手，可以帮助你：
- 📖 解析上传的软件文档
- 🎯 提供逐步操作引导
- ❓ 回答软件使用问题
- 🔧 排查操作中的错误

${knowledge ? '✅ 已检测到知识库内容，可以开始提问！' : '💡 建议先上传软件说明文档，我能提供更精准的帮助。'}

请告诉我你想了解什么？`;
}
