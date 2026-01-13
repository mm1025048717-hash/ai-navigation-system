/**
 * 向量数据库 - 用于RAG（检索增强生成）
 * 当前使用内存存储，生产环境应使用专业的向量数据库（如 Pinecone、Weaviate、Qdrant）
 */

export interface DocumentChunk {
  id: string;
  content: string;
  embedding?: number[];
  metadata: {
    documentId: string;
    documentName: string;
    chunkIndex: number;
    pageNumber?: number;
  };
}

class VectorStore {
  private chunks: DocumentChunk[] = [];
  private embeddings: Map<string, number[]> = new Map();

  /**
   * 添加文档块
   */
  async addChunks(chunks: DocumentChunk[]): Promise<void> {
    this.chunks.push(...chunks);
    
    // 生成嵌入向量（简化版：使用文本哈希作为模拟向量）
    // 生产环境应使用真实的embedding模型（如 OpenAI text-embedding-3-small）
    for (const chunk of chunks) {
      if (!chunk.embedding) {
        chunk.embedding = this.generateSimpleEmbedding(chunk.content);
      }
      this.embeddings.set(chunk.id, chunk.embedding);
    }
  }

  /**
   * 语义搜索 - 查找最相关的文档块
   */
  async search(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    if (this.chunks.length === 0) {
      return [];
    }

    // 生成查询向量
    const queryEmbedding = this.generateSimpleEmbedding(query);

    // 计算相似度（余弦相似度）
    const similarities = this.chunks.map(chunk => {
      const chunkEmbedding = chunk.embedding || this.embeddings.get(chunk.id) || [];
      const similarity = this.cosineSimilarity(queryEmbedding, chunkEmbedding);
      return { chunk, similarity };
    });

    // 排序并返回top-k
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.chunk);
  }

  /**
   * 根据文档ID获取所有块
   */
  getChunksByDocument(documentId: string): DocumentChunk[] {
    return this.chunks.filter(chunk => chunk.metadata.documentId === documentId);
  }

  /**
   * 清空存储
   */
  clear(): void {
    this.chunks = [];
    this.embeddings.clear();
  }

  /**
   * 生成简单的嵌入向量（模拟）
   * 生产环境应调用真实的embedding API
   */
  private generateSimpleEmbedding(text: string): number[] {
    // 简化版：基于字符频率的向量
    // 生产环境应使用 OpenAI text-embedding-3-small 或其他embedding模型
    const vector = new Array(128).fill(0);
    const normalized = text.toLowerCase();
    
    for (let i = 0; i < normalized.length; i++) {
      const charCode = normalized.charCodeAt(i);
      vector[charCode % 128] += 1;
    }
    
    // 归一化
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => magnitude > 0 ? val / magnitude : 0);
  }

  /**
   * 计算余弦相似度
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator > 0 ? dotProduct / denominator : 0;
  }
}

// 单例
export const vectorStore = new VectorStore();
