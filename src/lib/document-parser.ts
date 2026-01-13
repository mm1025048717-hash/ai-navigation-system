/**
 * 文档解析器 - 将上传的文档解析为可用的知识块
 */

export interface ParsedDocument {
  id: string;
  name: string;
  type: string;
  chunks: DocumentChunk[];
  metadata: {
    pageCount?: number;
    wordCount?: number;
    createdAt: string;
  };
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    documentId: string;
    documentName: string;
    chunkIndex: number;
    pageNumber?: number;
  };
}

/**
 * 解析文本内容为块
 */
export function parseTextToChunks(
  text: string,
  documentId: string,
  documentName: string,
  chunkSize: number = 500,
  overlap: number = 50
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const line of lines) {
    // 如果当前块加上新行会超过大小，保存当前块
    if (currentChunk.length + line.length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `${documentId}-chunk-${chunkIndex}`,
        content: currentChunk.trim(),
        metadata: {
          documentId,
          documentName,
          chunkIndex: chunkIndex++,
        },
      });
      
      // 保留重叠部分
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(overlap / 10));
      currentChunk = overlapWords.join(' ') + ' ' + line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }
  
  // 添加最后一个块
  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `${documentId}-chunk-${chunkIndex}`,
      content: currentChunk.trim(),
      metadata: {
        documentId,
        documentName,
        chunkIndex: chunkIndex,
      },
    });
  }
  
  return chunks;
}

/**
 * 解析Markdown文档
 */
export function parseMarkdown(
  content: string,
  documentId: string,
  documentName: string
): DocumentChunk[] {
  // 按标题分割Markdown
  const sections = content.split(/(?=^#+\s)/m).filter(section => section.trim().length > 0);
  
  return sections.map((section, index) => ({
    id: `${documentId}-chunk-${index}`,
    content: section.trim(),
    metadata: {
      documentId,
      documentName,
      chunkIndex: index,
    },
  }));
}

/**
 * 提取操作步骤
 */
export function extractSteps(content: string): string[] {
  const stepPatterns = [
    /(?:步骤|Step)\s*(\d+)[:：]\s*(.+)/gi,
    /(?:①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)\s*(.+)/g,
    /^\d+\.\s*(.+)$/gm,
  ];
  
  const steps: string[] = [];
  
  for (const pattern of stepPatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const step = match[1] || match[0];
      if (step && step.length > 5 && step.length < 200) {
        steps.push(step.trim());
      }
    }
  }
  
  return steps;
}

/**
 * 提取UI元素映射
 */
export function extractUIElements(content: string): Array<{ element: string; description: string }> {
  const patterns = [
    /(?:点击|选择|找到)\s*[""](.+?)[""]/g,
    /(?:按钮|输入框|菜单|链接)\s*[:：]\s*(.+)/g,
  ];
  
  const elements: Array<{ element: string; description: string }> = [];
  
  for (const pattern of patterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      elements.push({
        element: match[1] || match[0],
        description: match[0],
      });
    }
  }
  
  return elements;
}
