"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, SkipForward, ArrowLeft, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ErrorRecoveryProps {
  errorType: "ui_not_found" | "step_failed" | "timeout" | "api_error";
  currentStep: number;
  onRetry: () => void;
  onSkip: () => void;
  onBack: () => void;
  onManualHelp: () => void;
  errorMessage?: string;
}

export const ErrorRecovery = ({
  errorType,
  currentStep,
  onRetry,
  onSkip,
  onBack,
  onManualHelp,
  errorMessage,
}: ErrorRecoveryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const errorConfig = {
    ui_not_found: {
      title: "未找到目标元素",
      description: "AI 无法识别当前步骤的目标 UI 元素",
      suggestions: [
        "检查软件版本是否与知识库匹配",
        "尝试手动点击目标元素",
        "切换到手动模式继续操作",
      ],
    },
    step_failed: {
      title: "步骤执行失败",
      description: "当前步骤可能未正确执行",
      suggestions: [
        "检查操作是否正确完成",
        "查看是否有错误提示",
        "尝试重新执行此步骤",
      ],
    },
    timeout: {
      title: "操作超时",
      description: "等待时间过长，可能界面未响应",
      suggestions: [
        "检查软件是否正常运行",
        "尝试刷新或重启软件",
        "跳过此步骤继续",
      ],
    },
    api_error: {
      title: "AI 服务异常",
      description: "无法连接到 AI 服务",
      suggestions: [
        "检查网络连接",
        "切换到离线模式",
        "使用基于知识库的规则匹配",
      ],
    },
  };

  const config = errorConfig[errorType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-[#FFF3CD] border border-[#FFC107]/30 rounded-xl space-y-3"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#FF9800] shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-1">
            {config.title}
          </h4>
          <p className="text-[11px] text-[#86868B] mb-2">
            {config.description}
          </p>
          {errorMessage && (
            <p className="text-[10px] text-[#FF9800] font-mono bg-white/50 px-2 py-1 rounded mb-2">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* 建议操作 */}
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-[11px] text-[#007AFF] font-semibold hover:text-[#0063CE]"
        >
          <span>查看建议解决方案</span>
          <span className={cn("transition-transform", isExpanded && "rotate-180")}>
            ▼
          </span>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-1.5 overflow-hidden"
            >
              {config.suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-[11px] text-[#1D1D1F] pl-4"
                >
                  <span className="text-[#007AFF] mt-0.5">•</span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 pt-2 border-t border-[#FFC107]/20">
        <button
          onClick={onRetry}
          className="flex-1 h-9 bg-[#007AFF] text-white rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#0063CE] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重试
        </button>
        <button
          onClick={onBack}
          className="h-9 px-3 bg-white border border-[#E8E8ED] text-[#1D1D1F] rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#F5F5F7] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          上一步
        </button>
        <button
          onClick={onSkip}
          className="h-9 px-3 bg-white border border-[#E8E8ED] text-[#1D1D1F] rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#F5F5F7] transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5" />
          跳过
        </button>
        <button
          onClick={onManualHelp}
          className="h-9 px-3 bg-white border border-[#E8E8ED] text-[#1D1D1F] rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#F5F5F7] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          帮助
        </button>
      </div>
    </motion.div>
  );
};
