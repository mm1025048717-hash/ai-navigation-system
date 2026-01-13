import { NextRequest, NextResponse } from 'next/server';
import { parseTextToChunks, parseMarkdown, extractSteps, extractUIElements } from '@/lib/document-parser';
import { vectorStore } from '@/lib/vector-store';
import { storeDocument } from '@/lib/knowledge-store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const content = await file.text();
    
    // 生成文档 ID
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const name = file.name;
    
    // 解析文档为块
    const isMarkdown = name.endsWith('.md') || name.endsWith('.markdown');
    const chunks = isMarkdown 
      ? parseMarkdown(content, id, name)
      : parseTextToChunks(content, id, name);
    
    // 提取操作步骤和UI元素
    const steps = extractSteps(content);
    const uiElements = extractUIElements(content);
    
    // 存储到向量数据库
    await vectorStore.addChunks(chunks);
    
    // 存储文档元数据
    const document = {
      id,
      name,
      content,
      type: file.type || 'text/plain',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      preview: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
      chunksCount: chunks.length,
      stepsCount: steps.length,
      uiElementsCount: uiElements.length,
    };
    
    storeDocument(document);
    
    // 返回解析后的文档信息
    return NextResponse.json({
      ...document,
      steps: steps.slice(0, 10), // 返回前10个步骤作为预览
      uiElements: uiElements.slice(0, 10), // 返回前10个UI元素作为预览
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
