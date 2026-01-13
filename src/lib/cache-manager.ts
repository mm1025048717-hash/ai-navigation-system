/**
 * 缓存管理器
 * 用于减少 API 调用，提升性能和降低成本
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize = 100; // 最大缓存条目数

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl: number = 3600000): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * 检查缓存是否存在且有效
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * 清除缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清除过期缓存
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// 单例模式
export const cacheManager = new CacheManager();

// 定期清理过期缓存
if (typeof window !== "undefined") {
  setInterval(() => {
    cacheManager.cleanExpired();
  }, 60000); // 每分钟清理一次
}

/**
 * 生成缓存键
 */
export function generateCacheKey(prefix: string, ...args: any[]): string {
  return `${prefix}_${args.map(arg => 
    typeof arg === "object" ? JSON.stringify(arg) : String(arg)
  ).join("_")}`;
}
