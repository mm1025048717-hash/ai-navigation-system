"use client";

import { AlertCircle, Zap, Crown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { usageTracker } from "@/lib/usage-tracker";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const UsageLimit = () => {
  const [stats, setStats] = useState(usageTracker.getUsageStats());
  const [subscription, setSubscription] = useState(usageTracker.checkSubscription());

  useEffect(() => {
    // 定期更新使用量统计
    const interval = setInterval(() => {
      setStats(usageTracker.getUsageStats());
      setSubscription(usageTracker.checkSubscription());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 如果是 Pro 或 Enterprise，不显示限制
  if (subscription.unlimited) {
    return null;
  }

  const isNearLimit = 
    stats.remaining.taskPlans < 10 || 
    stats.remaining.apiCalls < 50;

  const isOverLimit = 
    stats.isOverLimit.taskPlans || 
    stats.isOverLimit.apiCalls;

  if (!isNearLimit && !isOverLimit) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border",
        isOverLimit
          ? "bg-[#FF3B30]/10 border-[#FF3B30]/30"
          : "bg-[#FF9500]/10 border-[#FF9500]/30"
      )}
    >
      <div className="flex items-start gap-3">
        {isOverLimit ? (
          <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
        ) : (
          <Zap className="w-5 h-5 text-[#FF9500] shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-2">
            {isOverLimit ? "免费额度已用完" : "免费额度即将用完"}
          </h4>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#86868B]">任务规划</span>
              <span className={cn(
                "font-semibold",
                isOverLimit ? "text-[#FF3B30]" : "text-[#1D1D1F]"
              )}>
                {stats.monthly.taskPlans} / {stats.limits.taskPlans}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  isOverLimit ? "bg-[#FF3B30]" : "bg-[#FF9500]"
                )}
                style={{
                  width: `${Math.min(100, (stats.monthly.taskPlans / stats.limits.taskPlans) * 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#86868B]">API 调用</span>
              <span className={cn(
                "font-semibold",
                isOverLimit ? "text-[#FF3B30]" : "text-[#1D1D1F]"
              )}>
                {stats.monthly.apiCalls} / {stats.limits.apiCalls}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  isOverLimit ? "bg-[#FF3B30]" : "bg-[#FF9500]"
                )}
                style={{
                  width: `${Math.min(100, (stats.monthly.apiCalls / stats.limits.apiCalls) * 100)}%`,
                }}
              />
            </div>
          </div>

          {isOverLimit && (
            <div className="pt-3 border-t border-[#E8E8ED]">
              <p className="text-[11px] text-[#86868B] mb-3">
                升级到 Pro 版可享受无限使用
              </p>
              <div className="flex gap-2">
                <button className="flex-1 h-9 bg-[#007AFF] text-white rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#0063CE] transition-colors">
                  <Crown className="w-3.5 h-3.5" />
                  升级 Pro
                </button>
                <button className="h-9 px-3 bg-white border border-[#E8E8ED] text-[#1D1D1F] rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#F5F5F7] transition-colors">
                  <TrendingUp className="w-3.5 h-3.5" />
                  查看详情
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
