"use client";

import { motion } from "framer-motion";

interface DemoRedditProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoReddit = ({ currentStep, isActive, onStepClick, taskType = "basic", taskId, generatedSteps = [], totalSteps = 4 }: DemoRedditProps) => {
  const isAdvanced = taskType === "advanced";
  const isGainFollowers = taskId === "gain-followers";
  
  // 根据步骤内容动态确定可点击元素
  const getStepTarget = (stepIndex: number) => {
    if (!isAdvanced || !generatedSteps.length) {
      // 基础任务：固定 4 步
      return stepIndex;
    }
    
    // 复杂任务：根据步骤内容映射
    const stepText = generatedSteps[stepIndex - 1]?.toLowerCase() || "";
    if (stepText.includes("社区") || stepText.includes("选择") || stepText.includes("垂直")) return 1;
    if (stepText.includes("发布") || stepText.includes("内容") || stepText.includes("原创")) return 2;
    if (stepText.includes("评论") || stepText.includes("互动") || stepText.includes("深度")) return 3;
    if (stepText.includes("数据") || stepText.includes("分析") || stepText.includes("优化")) return 4;
    if (stepText.includes("品牌") || stepText.includes("持续") || stepText.includes("建立")) return 5;
    return Math.min(stepIndex, 6);
  };
  
  return (
    <div className="h-full bg-[#0E0E0F] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* 浏览器顶栏 */}
      <div className="h-10 bg-[#1A1A1B] flex items-center px-4 gap-2 border-b border-[#343536]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
        <div className="ml-4 flex-1 h-7 bg-[#272729] rounded-full flex items-center px-3">
          <span className="text-[11px] text-gray-400">🔒 reddit.com/r/programming</span>
        </div>
      </div>

      {/* Reddit Header */}
      <div className="h-12 bg-[#1A1A1B] flex items-center px-4 gap-4 border-b border-[#343536]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center text-white font-bold text-[14px]">r/</div>
          <span className="text-white font-bold text-[14px]">r/programming</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* Create Post - Step 1 (基础任务) 或 选择社区 (复杂任务) */}
          <button 
            onClick={() => {
              const targetStep = isAdvanced ? getStepTarget(1) : 1;
              if (isActive && (currentStep === 1 || (isAdvanced && getStepTarget(currentStep) === 1))) {
                onStepClick(1);
              }
            }}
            className={`px-4 py-1.5 bg-white text-[#1A1A1B] rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              isActive && (currentStep === 1 || (isAdvanced && getStepTarget(currentStep) === 1))
                ? "ring-2 ring-[#007AFF] ring-offset-2 ring-offset-[#1A1A1B] animate-pulse bg-[#007AFF] text-white" 
                : "hover:bg-gray-200"
            }`}
          >
            {isAdvanced && isGainFollowers ? "选择社区" : "+ Create Post"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Feed */}
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {/* Post 1 - Step 2 (发布内容) */}
          <div 
            onClick={() => {
              const targetStep = isAdvanced ? getStepTarget(2) : 2;
              if (isActive && (currentStep === 2 || (isAdvanced && getStepTarget(currentStep) === 2))) {
                onStepClick(2);
              }
            }}
            className={`bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] transition-all cursor-pointer ${
              isActive && (currentStep === 2 || (isAdvanced && getStepTarget(currentStep) === 2))
                ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse" 
                : "hover:border-[#545456]"
            }`}
          >
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <button className="hover:text-[#FF4500] transition-colors">▲</button>
                <span className="text-[12px] font-bold text-white">2.4k</span>
                <button className="hover:text-blue-400 transition-colors">▼</button>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 mb-1">
                  Posted by {isGainFollowers ? "u/your_username" : "u/developer_alex"} • {isGainFollowers ? "2h" : "3h"}
                </div>
                <h3 className="text-white font-medium text-[15px] mb-2">
                  {isGainFollowers 
                    ? "How I Gained 1000 Followers in 3 Months: A Complete Reddit Strategy Guide"
                    : "AI-Powered Code Navigation is the Future of Development"}
                </h3>
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  {/* Comment - Step 3 (互动评论) */}
                  <span 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const targetStep = isAdvanced ? getStepTarget(3) : 3;
                      if (isActive && (currentStep === 3 || (isAdvanced && getStepTarget(currentStep) === 3))) {
                        onStepClick(3);
                      }
                    }}
                    className={`flex items-center gap-1 cursor-pointer transition-all ${
                      isActive && (currentStep === 3 || (isAdvanced && getStepTarget(currentStep) === 3))
                        ? "text-[#007AFF] font-bold bg-[#007AFF]/20 px-2 py-1 rounded animate-pulse" 
                        : "hover:text-white"
                    }`}
                  >
                    💬 {isGainFollowers ? "1.2k" : "324"} Comments
                  </span>
                  <span className="hover:text-white cursor-pointer">🔗 Share</span>
                  <span className="hover:text-white cursor-pointer">⭐ Save</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post 2 */}
          <div className="bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] hover:border-[#545456] cursor-pointer">
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <button className="hover:text-[#FF4500] transition-colors">▲</button>
                <span className="text-[12px] font-bold text-white">891</span>
                <button className="hover:text-blue-400 transition-colors">▼</button>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 mb-1">Posted by u/tech_insider • 5h</div>
                <h3 className="text-white font-medium text-[15px] mb-2">Show HN: Built an AI that watches your screen and guides you</h3>
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span>💬 156 Comments</span>
                  <span>🔗 Share</span>
                </div>
              </div>
            </div>
          </div>

          {isGainFollowers && (
            <>
              {/* Post 3 - Advanced Strategy */}
              <div className="bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] hover:border-[#545456] cursor-pointer">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <button className="hover:text-[#FF4500] transition-colors">▲</button>
                    <span className="text-[12px] font-bold text-white">3.1k</span>
                    <button className="hover:text-blue-400 transition-colors">▼</button>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-500 mb-1">Posted by u/your_username • 1d</div>
                    <h3 className="text-white font-medium text-[15px] mb-2">Daily Engagement Thread: Share Your Latest Project!</h3>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <span>💬 847 Comments</span>
                      <span>🔗 Share</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 数据分析区域 - Step 4/5 (分析数据优化) */}
              {(currentStep === 4 || currentStep === 5) && isActive && (
                <div 
                  onClick={() => {
                    if (isActive && (currentStep === 4 || currentStep === 5)) {
                      onStepClick(currentStep);
                    }
                  }}
                  className={`bg-[#1A1A1B] rounded-lg p-4 border transition-all cursor-pointer ${
                    isActive && (currentStep === 4 || currentStep === 5)
                      ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse border-[#007AFF]" 
                      : "border-[#343536] hover:border-[#545456]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#007AFF] text-lg">📊</span>
                    <h4 className="text-white font-bold text-[14px]">数据分析中心</h4>
                  </div>
                  <div className="space-y-2 text-[12px] text-gray-400">
                    <div>最佳发布时间: 14:00 - 18:00</div>
                    <div>平均互动率: 12.3% ↑</div>
                    <div>热门话题: #AI #Programming #WebDev</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar - Step 4/5/6 (数据分析/社区信息) */}
        <div className="w-72 p-4 border-l border-[#343536] hidden lg:block">
          <div 
            onClick={() => {
              // 对于复杂任务，步骤 4-6 都可能点击这里
              const targetStep = isAdvanced ? getStepTarget(currentStep) : 4;
              if (isActive && (currentStep === 4 || (isAdvanced && (currentStep >= 4 && currentStep <= totalSteps)))) {
                onStepClick(currentStep);
              }
            }}
            className={`bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] transition-all cursor-pointer ${
              isActive && (currentStep === 4 || (isAdvanced && (currentStep >= 4 && currentStep <= totalSteps)))
                ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse" 
                : "hover:border-[#545456]"
            }`}
          >
            <h4 className="text-white font-bold text-[14px] mb-2">About Community</h4>
            <p className="text-gray-400 text-[12px] mb-3">Computer Programming discussion and news</p>
            <div className="text-[12px] text-gray-400 space-y-1 mb-3">
              <div>👥 5.2m Members</div>
              <div>🟢 12.3k Online</div>
            </div>
            {isGainFollowers && (
              <div className="mb-3 p-2 bg-[#FF4500]/10 border border-[#FF4500]/30 rounded text-[11px] text-[#FF4500]">
                <div className="font-bold mb-1">📈 Your Growth</div>
                <div>Followers: 847/1000</div>
                <div className="mt-1 h-1.5 bg-[#343536] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF4500] rounded-full" style={{ width: '84.7%' }} />
                </div>
              </div>
            )}
            <button className="w-full mt-3 py-2 bg-[#FF4500] text-white rounded-full text-[12px] font-bold hover:bg-[#FF5722] transition-colors">
              {isGainFollowers ? "Joined ✓" : "Join"}
            </button>
          </div>
        </div>
      </div>

      {/* 引导提示标签 */}
      {isActive && currentStep > 0 && currentStep <= 4 && (
        <StepLabel step={currentStep} />
      )}
    </div>
  );
};

const StepLabel = ({ step }: { step: number }) => {
  const labels: Record<number, { top: string; left: string; text: string }> = {
    1: { top: "58px", left: "calc(100% - 200px)", text: "点击此按钮" },
    2: { top: "140px", left: "50px", text: "点击此帖子" },
    3: { top: "255px", left: "120px", text: "点击评论" },
    4: { top: "140px", left: "calc(100% - 260px)", text: "点击此卡片" },
  };

  const label = labels[step];
  if (!label) return null;

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute z-20 px-4 py-2 bg-white text-[#007AFF] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#007AFF]/20 text-[12px] font-bold flex items-center gap-2 whitespace-nowrap"
      style={{ top: label.top, left: label.left }}
    >
      <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-pulse" />
      {label.text}
    </motion.div>
  );
};
