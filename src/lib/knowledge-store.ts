// 知识库存储服务
// 在实际生产中，这应该连接到向量数据库（如 Pinecone、Weaviate）

export interface KnowledgeDocument {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
  uploadedAt: string;
  preview?: string;
  chunksCount?: number;
  stepsCount?: number;
  uiElementsCount?: number;
}

class KnowledgeStore {
  private documents: Map<string, KnowledgeDocument> = new Map();

  // 添加文档
  addDocument(doc: KnowledgeDocument) {
    this.documents.set(doc.id, doc);
    return doc;
  }

  // 存储文档（兼容新接口）
  storeDocument(doc: KnowledgeDocument) {
    this.documents.set(doc.id, doc);
    return doc;
  }

  // 获取所有文档
  getAllDocuments(): KnowledgeDocument[] {
    return Array.from(this.documents.values());
  }

  // 删除文档
  removeDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  // 搜索相关内容（简化版，实际应使用向量相似度搜索）
  searchRelevantContent(query: string, topK: number = 3): string[] {
    const results: string[] = [];
    const queryLower = query.toLowerCase();
    
    for (const doc of this.documents.values()) {
      const contentLower = doc.content.toLowerCase();
      if (contentLower.includes(queryLower) || this.hasKeywordMatch(queryLower, contentLower)) {
        results.push(`[来源: ${doc.name}]\n${doc.preview || doc.content.slice(0, 500)}`);
        if (results.length >= topK) break;
      }
    }
    
    // 如果没有精确匹配，返回所有文档的摘要
    if (results.length === 0) {
      for (const doc of this.documents.values()) {
        results.push(`[来源: ${doc.name}]\n${doc.preview || doc.content.slice(0, 500)}`);
        if (results.length >= topK) break;
      }
    }
    
    return results;
  }

  // 获取完整上下文
  getFullContext(): string {
    const contexts: string[] = [];
    for (const doc of this.documents.values()) {
      contexts.push(`### ${doc.name}\n${doc.content}`);
    }
    return contexts.join('\n\n---\n\n');
  }

  // 简单关键词匹配
  private hasKeywordMatch(query: string, text: string): boolean {
    const keywords = query.split(/\s+/).filter(k => k.length > 2);
    return keywords.some(keyword => text.includes(keyword));
  }

  // 获取知识上下文（用于RAG）
  getKnowledgeContext(): string {
    const contexts: string[] = [];
    for (const doc of this.documents.values()) {
      contexts.push(`### ${doc.name}\n${doc.content}`);
    }
    return contexts.join('\n\n---\n\n');
  }

  // 清空所有文档
  clear() {
    this.documents.clear();
  }
}

// 全局单例
export const knowledgeStore = new KnowledgeStore();

// 导出便捷函数
export function storeDocument(doc: KnowledgeDocument) {
  return knowledgeStore.storeDocument(doc);
}

export function getKnowledgeContext(): string {
  return knowledgeStore.getKnowledgeContext();
}

export function getAllDocuments(): KnowledgeDocument[] {
  return knowledgeStore.getAllDocuments();
}
