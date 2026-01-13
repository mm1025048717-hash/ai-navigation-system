"use client";

import { motion } from "framer-motion";

interface DemoFigmaProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
}

export const DemoFigma = ({ currentStep, isActive, onStepClick }: DemoFigmaProps) => {
  return (
    <div className="h-full bg-[#2C2C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* 顶部工具栏 */}
      <div className="h-12 bg-[#1E1E1E] flex items-center px-4 gap-4 border-b border-[#3C3C3C]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <svg className="w-5 h-5" viewBox="0 0 38 57" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
          </svg>
          <span className="text-white text-[13px] font-medium">Design System</span>
        </div>
        <div className="flex-1" />
        <button className="px-3 py-1 bg-[#0D99FF] text-white text-[11px] font-bold rounded hover:bg-[#0B8AE8]">
          Share
        </button>
      </div>

      <div className="flex-1 flex">
        {/* 左侧工具栏 - Step 1 */}
        <div 
          onClick={() => onStepClick(1)}
          className={`w-12 bg-[#2C2C2C] border-r border-[#3C3C3C] flex flex-col items-center py-3 gap-2 transition-all cursor-pointer ${
            isActive && currentStep === 1 
              ? "ring-2 ring-[#007AFF] ring-inset bg-[#007AFF]/10 animate-pulse" 
              : "hover:bg-white/5"
          }`}
        >
          <button className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3z"/></svg>
          </button>
          <button className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>
          </button>
          <button className="w-8 h-8 rounded bg-[#0D99FF] flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <button className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center text-white">T</button>
        </div>

        {/* 画布区域 */}
        <div className="flex-1 bg-[#1E1E1E] relative overflow-hidden p-8">
          {/* 卡片组件 - Step 2 */}
          <div 
            onClick={() => onStepClick(2)}
            className={`absolute top-16 left-16 w-64 h-40 bg-white rounded-xl shadow-xl transition-all cursor-pointer ${
              isActive && currentStep === 2 
                ? "ring-4 ring-[#007AFF] animate-pulse" 
                : "hover:ring-2 hover:ring-white/30"
            }`}
          >
            <div className="p-4">
              <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
              <div className="w-20 h-8 bg-[#0D99FF] rounded flex items-center justify-center text-white text-[11px] font-bold">
                Button
              </div>
            </div>
          </div>

          <div className="absolute top-20 left-96 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-80"></div>

          {/* 底部组件 - Step 3 */}
          <div 
            onClick={() => onStepClick(3)}
            className={`absolute bottom-16 left-24 w-56 h-32 bg-[#1A1A1A] rounded-lg p-3 transition-all cursor-pointer ${
              isActive && currentStep === 3 
                ? "ring-4 ring-[#007AFF] animate-pulse" 
                : "hover:ring-2 hover:ring-white/30"
            }`}
          >
            <div className="text-white text-[11px] font-bold mb-2">Component</div>
            <div className="space-y-1">
              <div className="w-full h-3 bg-white/20 rounded"></div>
              <div className="w-2/3 h-3 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>

        {/* 右侧属性面板 - Step 4 */}
        <div 
          onClick={() => onStepClick(4)}
          className={`w-64 bg-[#2C2C2C] border-l border-[#3C3C3C] p-4 transition-all cursor-pointer ${
            isActive && currentStep === 4 
              ? "ring-2 ring-[#007AFF] ring-inset bg-[#007AFF]/10 animate-pulse" 
              : "hover:bg-white/5"
          }`}
        >
          <div className="text-white text-[12px] font-bold mb-4">Design</div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider">Position</label>
              <div className="flex gap-2 mt-1">
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px]" value="X: 120" readOnly />
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px]" value="Y: 80" readOnly />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider">Size</label>
              <div className="flex gap-2 mt-1">
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px]" value="W: 256" readOnly />
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px]" value="H: 160" readOnly />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider">Fill</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 bg-white rounded border border-[#3C3C3C]"></div>
                <span className="text-white text-[11px]">#FFFFFF</span>
              </div>
            </div>
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
    1: { top: "100px", left: "20px", text: "点击工具栏" },
    2: { top: "60px", left: "300px", text: "点击此卡片" },
    3: { top: "calc(100% - 180px)", left: "300px", text: "点击此组件" },
    4: { top: "100px", left: "calc(100% - 240px)", text: "点击属性面板" },
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
