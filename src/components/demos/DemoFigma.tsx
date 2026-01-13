"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface DemoFigmaProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoFigma = ({ currentStep, isActive, onStepClick, taskType = "basic", taskId, generatedSteps = [], totalSteps = 4 }: DemoFigmaProps) => {
  const isAdvanced = taskType === "advanced";
  const isBecomeExpert = taskId === "become-expert";
  const isDesignSystem = taskId === "design-system";
  const [selectedTool, setSelectedTool] = useState("frame");
  const [zoom, setZoom] = useState(100);
  
  // 根据步骤内容动态确定可点击元素
  const getStepTarget = (stepIndex: number) => {
    if (!isAdvanced || !generatedSteps.length) {
      return stepIndex;
    }
    const stepText = generatedSteps[stepIndex - 1]?.toLowerCase() || "";
    if (stepText.includes("理论") || stepText.includes("基础") || stepText.includes("学习")) return 1;
    if (stepText.includes("功能") || stepText.includes("组件") || stepText.includes("变体")) return 2;
    if (stepText.includes("项目") || stepText.includes("案例") || stepText.includes("完成")) return 3;
    if (stepText.includes("作品集") || stepText.includes("建立") || stepText.includes("个人")) return 4;
    if (stepText.includes("研究") || stepText.includes("交互") || stepText.includes("用户")) return 5;
    if (stepText.includes("社区") || stepText.includes("分享") || stepText.includes("经验")) return 6;
    return Math.min(stepIndex, 6);
  };
  
  return (
    <div className="h-full bg-[#2C2C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* 顶部菜单栏 */}
      <div className="h-10 bg-[#1E1E1E] flex items-center px-4 gap-4 border-b border-[#3C3C3C]">
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
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="hover:text-white cursor-pointer">File</span>
          <span className="hover:text-white cursor-pointer">Edit</span>
          <span className="hover:text-white cursor-pointer">Object</span>
          <span className="hover:text-white cursor-pointer">Text</span>
          <span className="hover:text-white cursor-pointer">Arrange</span>
          <span className="hover:text-white cursor-pointer">Plugins</span>
        </div>
        <button className="px-3 py-1 bg-[#0D99FF] text-white text-[11px] font-bold rounded hover:bg-[#0B8AE8]">
          Share
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧工具栏 - Step 1 */}
        <div 
          onClick={() => {
            if (isActive && currentStep === 1) {
              onStepClick(1);
            }
          }}
          className={`w-12 bg-[#2C2C2C] border-r border-[#3C3C3C] flex flex-col items-center py-3 gap-2 transition-all cursor-pointer ${
            isActive && currentStep === 1 
              ? "ring-2 ring-[#007AFF] ring-inset bg-[#007AFF]/10 animate-pulse" 
              : "hover:bg-white/5"
          }`}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedTool("frame"); }}
            className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
              selectedTool === "frame" ? "bg-[#0D99FF] text-white" : "text-white hover:bg-white/10"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3z"/>
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedTool("circle"); }}
            className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
              selectedTool === "circle" ? "bg-[#0D99FF] text-white" : "text-white hover:bg-white/10"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"/>
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedTool("plus"); }}
            className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
              selectedTool === "plus" ? "bg-[#0D99FF] text-white" : "text-white hover:bg-white/10"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedTool("text"); }}
            className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
              selectedTool === "text" ? "bg-[#0D99FF] text-white" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="text-[14px] font-bold">T</span>
          </button>
          <div className="w-6 h-px bg-[#3C3C3C] my-1" />
          <button className="w-8 h-8 rounded text-white hover:bg-white/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          <button className="w-8 h-8 rounded text-white hover:bg-white/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l18 18M3 21L21 3"/>
            </svg>
          </button>
        </div>

        {/* 左侧图层面板 */}
        <div className="w-64 bg-[#2C2C2C] border-r border-[#3C3C3C] flex flex-col">
          <div className="h-10 bg-[#1E1E1E] flex items-center px-3 border-b border-[#3C3C3C]">
            <span className="text-[11px] font-bold text-white">Layers</span>
            <div className="ml-auto flex gap-1">
              <button className="w-5 h-5 text-gray-400 hover:text-white hover:bg-[#3C3C3C] rounded text-[10px]">⚙️</button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 text-[11px] text-gray-300">
            <div className="space-y-1">
              <div className="px-2 py-1 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2">
                <span>📄</span> Page 1
              </div>
              <div className="ml-4 space-y-1">
                <div className="px-2 py-1 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2">
                  <span>📦</span> Frame 1
                </div>
                <div className="ml-4 space-y-1">
                  <div className="px-2 py-1 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2">
                    <span>⬜</span> Card Component
                  </div>
                  <div className="px-2 py-1 hover:bg-white/5 rounded cursor-pointer flex items-center gap-2">
                    <span>🔵</span> Button
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 画布区域 */}
        <div className="flex-1 bg-[#1E1E1E] relative overflow-hidden">
          {/* 顶部工具栏 */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 bg-[#2C2C2C] rounded-lg px-3 py-2 border border-[#3C3C3C]">
            <button className="px-2 py-1 text-white text-[11px] hover:bg-white/10 rounded">←</button>
            <button className="px-2 py-1 text-white text-[11px] hover:bg-white/10 rounded">→</button>
            <div className="w-px h-4 bg-[#3C3C3C] mx-1" />
            <button 
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="px-2 py-1 text-white text-[11px] hover:bg-white/10 rounded"
            >
              −
            </button>
            <span className="text-white text-[11px] font-medium min-w-[50px] text-center">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="px-2 py-1 text-white text-[11px] hover:bg-white/10 rounded"
            >
              +
            </button>
          </div>

          {/* 画布内容 */}
          <div className="absolute inset-0 p-8" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            {/* 卡片组件 - Step 2 */}
            <div 
              onClick={() => {
                if (isActive && currentStep === 2) {
                  onStepClick(2);
                }
              }}
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

            {isDesignSystem && (
              <>
                {/* Design System Components */}
                <div className="absolute top-20 left-96 w-48 h-48 bg-white rounded-2xl shadow-xl p-4">
                  <div className="text-[10px] font-bold text-gray-800 mb-2">Button Variants</div>
                  <div className="space-y-2">
                    <div className="h-8 bg-[#0D99FF] rounded flex items-center justify-center text-white text-[10px]">Primary</div>
                    <div className="h-8 bg-gray-200 rounded flex items-center justify-center text-gray-800 text-[10px]">Secondary</div>
                    <div className="h-8 bg-transparent border-2 border-gray-300 rounded flex items-center justify-center text-gray-800 text-[10px]">Outline</div>
                  </div>
                </div>
                <div className="absolute top-20 left-[28rem] w-40 h-40 bg-white rounded-xl shadow-xl p-4">
                  <div className="text-[10px] font-bold text-gray-800 mb-2">Color Palette</div>
                  <div className="grid grid-cols-4 gap-1">
                    {['#007AFF', '#34C759', '#FF9500', '#FF3B30'].map((color, i) => (
                      <div key={i} className="w-full h-8 rounded" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isDesignSystem && (
              <div className="absolute top-20 left-96 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-80"></div>
            )}

            {/* 底部组件 - Step 3 */}
            <div 
              onClick={() => {
                if (isActive && currentStep === 3) {
                  onStepClick(3);
                }
              }}
              className={`absolute bottom-16 left-24 w-56 h-32 bg-[#1A1A1A] rounded-lg p-3 transition-all cursor-pointer ${
                isActive && currentStep === 3 
                  ? "ring-4 ring-[#007AFF] animate-pulse" 
                  : "hover:ring-2 hover:ring-white/30"
              }`}
            >
              <div className="text-white text-[11px] font-bold mb-2">
                {isBecomeExpert ? "Design System" : "Component"}
              </div>
              <div className="space-y-1">
                <div className="w-full h-3 bg-white/20 rounded"></div>
                <div className="w-2/3 h-3 bg-white/20 rounded"></div>
              </div>
            </div>

            {isBecomeExpert && (
              <div className="absolute bottom-16 right-24 w-48 h-32 bg-white rounded-xl shadow-xl p-4">
                <div className="text-[10px] font-bold text-gray-800 mb-2">Portfolio Progress</div>
                <div className="text-[9px] text-gray-600 mb-2">Projects: 7/10</div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0D99FF] rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧属性面板 - Step 4 */}
        <div 
          onClick={() => {
            if (isActive && currentStep === 4) {
              onStepClick(4);
            }
          }}
          className={`w-64 bg-[#2C2C2C] border-l border-[#3C3C3C] flex flex-col transition-all cursor-pointer ${
            isActive && currentStep === 4 
              ? "ring-2 ring-[#007AFF] ring-inset bg-[#007AFF]/10 animate-pulse" 
              : "hover:bg-white/5"
          }`}
        >
          <div className="h-10 bg-[#1E1E1E] flex items-center px-3 border-b border-[#3C3C3C]">
            <span className="text-[11px] font-bold text-white">Design</span>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-2">Position</label>
              <div className="flex gap-2">
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px] border border-[#3C3C3C]" value="X: 120" readOnly />
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px] border border-[#3C3C3C]" value="Y: 80" readOnly />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-2">Size</label>
              <div className="flex gap-2">
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px] border border-[#3C3C3C]" value="W: 256" readOnly />
                <input className="w-1/2 h-7 bg-[#1E1E1E] rounded px-2 text-white text-[11px] border border-[#3C3C3C]" value="H: 160" readOnly />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-2">Fill</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white rounded border border-[#3C3C3C] cursor-pointer"></div>
                <span className="text-white text-[11px]">#FFFFFF</span>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-2">Stroke</label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-transparent border-2 border-[#3C3C3C] rounded cursor-pointer"></div>
                <span className="text-white text-[11px]">None</span>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block mb-2">Effects</label>
              <div className="space-y-1">
                <div className="text-white text-[11px]">Drop Shadow</div>
                <div className="text-gray-400 text-[10px]">0px 4px 8px rgba(0,0,0,0.1)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="h-8 bg-[#1E1E1E] border-t border-[#3C3C3C] flex items-center px-4 text-[10px] text-gray-400">
        <span>Ready</span>
        <div className="ml-auto flex items-center gap-4">
          <span>100%</span>
          <span>1920 × 1080</span>
        </div>
      </div>

      {/* 引导提示标签 */}
      {isActive && currentStep > 0 && currentStep <= totalSteps && (
        <StepLabel step={currentStep} totalSteps={totalSteps} />
      )}
    </div>
  );
};

const StepLabel = ({ step, totalSteps }: { step: number; totalSteps: number }) => {
  const labels: Record<number, { top: string; left: string; text: string }> = {
    1: { top: "100px", left: "20px", text: "点击工具栏" },
    2: { top: "60px", left: "300px", text: "点击此卡片" },
    3: { top: "calc(100% - 180px)", left: "300px", text: "点击此组件" },
    4: { top: "100px", left: "calc(100% - 240px)", text: "点击属性面板" },
  };

  const label = labels[step] || labels[4];
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
