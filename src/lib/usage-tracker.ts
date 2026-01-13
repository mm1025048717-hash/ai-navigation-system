/**
 * 使用量追踪器
 * 用于实现按次收费、免费额度管理等商业模式
 */

interface UsageRecord {
  date: string; // YYYY-MM-DD
  taskPlans: number; // 任务规划次数
  apiCalls: number; // API 调用次数
  visionCalls: number; // 视觉 AI 调用次数
}

class UsageTracker {
  private storageKey = "ai_nav_usage";
  private maxFreePlans = 50; // 每月免费任务规划次数
  private maxFreeApiCalls = 200; // 每月免费 API 调用次数

  /**
   * 记录任务规划
   */
  recordTaskPlan(): boolean {
    const usage = this.getUsage();
    const today = new Date().toISOString().split("T")[0];
    
    if (!usage[today]) {
      usage[today] = { date: today, taskPlans: 0, apiCalls: 0, visionCalls: 0 };
    }

    // 检查是否超过免费额度
    const monthlyPlans = this.getMonthlyUsage("taskPlans");
    if (monthlyPlans >= this.maxFreePlans) {
      return false; // 超过免费额度
    }

    usage[today].taskPlans++;
    this.saveUsage(usage);
    return true;
  }

  /**
   * 记录 API 调用
   */
  recordApiCall(): boolean {
    const usage = this.getUsage();
    const today = new Date().toISOString().split("T")[0];
    
    if (!usage[today]) {
      usage[today] = { date: today, taskPlans: 0, apiCalls: 0, visionCalls: 0 };
    }

    // 检查是否超过免费额度
    const monthlyCalls = this.getMonthlyUsage("apiCalls");
    if (monthlyCalls >= this.maxFreeApiCalls) {
      return false; // 超过免费额度
    }

    usage[today].apiCalls++;
    this.saveUsage(usage);
    return true;
  }

  /**
   * 记录视觉 AI 调用
   */
  recordVisionCall(): void {
    const usage = this.getUsage();
    const today = new Date().toISOString().split("T")[0];
    
    if (!usage[today]) {
      usage[today] = { date: today, taskPlans: 0, apiCalls: 0, visionCalls: 0 };
    }

    usage[today].visionCalls++;
    this.saveUsage(usage);
  }

  /**
   * 获取使用量统计
   */
  getUsageStats() {
    const usage = this.getUsage();
    const monthlyPlans = this.getMonthlyUsage("taskPlans");
    const monthlyCalls = this.getMonthlyUsage("apiCalls");
    const monthlyVision = this.getMonthlyUsage("visionCalls");

    return {
      monthly: {
        taskPlans: monthlyPlans,
        apiCalls: monthlyCalls,
        visionCalls: monthlyVision,
      },
      limits: {
        taskPlans: this.maxFreePlans,
        apiCalls: this.maxFreeApiCalls,
      },
      remaining: {
        taskPlans: Math.max(0, this.maxFreePlans - monthlyPlans),
        apiCalls: Math.max(0, this.maxFreeApiCalls - monthlyCalls),
      },
      isOverLimit: {
        taskPlans: monthlyPlans >= this.maxFreePlans,
        apiCalls: monthlyCalls >= this.maxFreeApiCalls,
      },
    };
  }

  /**
   * 获取月度使用量
   */
  private getMonthlyUsage(type: keyof Omit<UsageRecord, "date">): number {
    const usage = this.getUsage();
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    return Object.values(usage)
      .filter(record => record.date.startsWith(currentMonth))
      .reduce((sum, record) => sum + record[type], 0);
  }

  /**
   * 获取所有使用记录
   */
  private getUsage(): Record<string, UsageRecord> {
    if (typeof window === "undefined") return {};
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * 保存使用记录
   */
  private saveUsage(usage: Record<string, UsageRecord>): void {
    if (typeof window === "undefined") return;
    
    try {
      // 只保留最近 90 天的记录
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const cutoffStr = cutoff.toISOString().split("T")[0];
      
      const filtered: Record<string, UsageRecord> = {};
      for (const [date, record] of Object.entries(usage)) {
        if (date >= cutoffStr) {
          filtered[date] = record;
        }
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to save usage:", error);
    }
  }

  /**
   * 清除使用记录（用于测试或重置）
   */
  clearUsage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.storageKey);
  }

  /**
   * 检查订阅状态（企业版/Pro版）
   */
  checkSubscription(): {
    isPro: boolean;
    isEnterprise: boolean;
    unlimited: boolean;
  } {
    // 这里可以集成实际的订阅检查逻辑
    // 目前返回默认值
    return {
      isPro: false,
      isEnterprise: false,
      unlimited: false,
    };
  }
}

// 单例模式
export const usageTracker = new UsageTracker();
