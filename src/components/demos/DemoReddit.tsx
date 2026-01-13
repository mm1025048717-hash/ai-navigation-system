"use client";

import { motion } from "framer-motion";

interface DemoRedditProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
}

export const DemoReddit = ({ currentStep, isActive, onStepClick }: DemoRedditProps) => {
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
          {/* Create Post - Step 1 */}
          <button 
            onClick={() => onStepClick(1)}
            className={`px-4 py-1.5 bg-white text-[#1A1A1B] rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              isActive && currentStep === 1 
                ? "ring-2 ring-[#007AFF] ring-offset-2 ring-offset-[#1A1A1B] animate-pulse bg-[#007AFF] text-white" 
                : "hover:bg-gray-200"
            }`}
          >
            + Create Post
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Feed */}
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {/* Post 1 - Step 2 */}
          <div 
            onClick={() => onStepClick(2)}
            className={`bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] transition-all cursor-pointer ${
              isActive && currentStep === 2 
                ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse" 
                : "hover:border-[#545456]"
            }`}
          >
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <button className="hover:text-[#FF4500]">▲</button>
                <span className="text-[12px] font-bold text-white">2.4k</span>
                <button className="hover:text-blue-400">▼</button>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 mb-1">Posted by u/developer_alex • 3h</div>
                <h3 className="text-white font-medium text-[15px] mb-2">AI-Powered Code Navigation is the Future of Development</h3>
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  {/* Comment - Step 3 */}
                  <span 
                    onClick={(e) => { e.stopPropagation(); onStepClick(3); }}
                    className={`flex items-center gap-1 cursor-pointer transition-all ${
                      isActive && currentStep === 3 
                        ? "text-[#007AFF] font-bold bg-[#007AFF]/20 px-2 py-1 rounded animate-pulse" 
                        : "hover:text-white"
                    }`}
                  >
                    💬 324 Comments
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
                <button className="hover:text-[#FF4500]">▲</button>
                <span className="text-[12px] font-bold text-white">891</span>
                <button className="hover:text-blue-400">▼</button>
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
        </div>

        {/* Sidebar - Step 4 */}
        <div className="w-72 p-4 border-l border-[#343536] hidden lg:block">
          <div 
            onClick={() => onStepClick(4)}
            className={`bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] transition-all cursor-pointer ${
              isActive && currentStep === 4 
                ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse" 
                : "hover:border-[#545456]"
            }`}
          >
            <h4 className="text-white font-bold text-[14px] mb-2">About Community</h4>
            <p className="text-gray-400 text-[12px] mb-3">Computer Programming discussion and news</p>
            <div className="text-[12px] text-gray-400 space-y-1">
              <div>👥 5.2m Members</div>
              <div>🟢 12.3k Online</div>
            </div>
            <button className="w-full mt-3 py-2 bg-[#FF4500] text-white rounded-full text-[12px] font-bold hover:bg-[#FF5722]">
              Join
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute z-20 px-3 py-1.5 bg-[#007AFF] text-white rounded-full shadow-xl text-[11px] font-bold flex items-center gap-1.5"
      style={{ top: label.top, left: label.left }}
    >
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
      {label.text}
    </motion.div>
  );
};
