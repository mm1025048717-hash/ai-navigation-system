import { NextRequest, NextResponse } from 'next/server';

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
    
    // 返回解析后的文档信息
    return NextResponse.json({
      id,
      name: file.name,
      content,
      type: file.type || 'text/plain',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      preview: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
