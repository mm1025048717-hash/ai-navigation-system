"use client";

import { motion } from "framer-motion";

interface DemoIDEProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
}

export const DemoIDE = ({ currentStep, isActive, onStepClick }: DemoIDEProps) => {
  return (
    <div className="h-full bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* 标题栏 */}
      <div className="h-10 bg-[#323233] flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
        <span className="ml-4 text-[12px] text-gray-400 font-medium">PyCharm Professional - my_project</span>
      </div>

      <div className="flex-1 flex">
        {/* 侧边栏 */}
        <div className="w-56 bg-[#252526] border-r border-[#3C3C3C] p-3">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">项目</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-300">
              <span className="text-yellow-500">▼</span>
              <span className="text-blue-400">📁</span> my_project
            </div>
            <div className="ml-4 space-y-0.5">
              {/* main.py - Step 1 */}
              <div 
                onClick={() => onStepClick(1)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-all cursor-pointer ${
                  isActive && currentStep === 1 
                    ? "bg-[#007AFF]/30 ring-2 ring-[#007AFF] text-white animate-pulse" 
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <span className="text-green-400">📄</span> main.py
              </div>
              {/* config.py - Step 3 */}
              <div 
                onClick={() => onStepClick(3)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-all cursor-pointer ${
                  isActive && currentStep === 3 
                    ? "bg-[#007AFF]/30 ring-2 ring-[#007AFF] text-white animate-pulse" 
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <span className="text-blue-400">📄</span> config.py
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 rounded cursor-pointer">
                <span className="text-purple-400">📄</span> utils.py
              </div>
            </div>
          </div>
        </div>

        {/* 代码编辑区 */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-9 bg-[#2D2D2D] flex items-center px-2 border-b border-[#3C3C3C]">
            <div className="px-3 py-1.5 bg-[#1E1E1E] text-[12px] text-white rounded-t flex items-center gap-2">
              <span className="text-green-400">●</span> main.py
            </div>
          </div>
          
          {/* Code Area */}
          <div className="flex-1 p-4 font-mono text-[13px] overflow-auto">
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8">1</div>
              <div><span className="text-purple-400">from</span> <span className="text-green-400">flask</span> <span className="text-purple-400">import</span> Flask</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8">2</div>
              <div><span className="text-purple-400">from</span> <span className="text-green-400">config</span> <span className="text-purple-400">import</span> settings</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8">3</div>
              <div></div>
            </div>
            {/* Function definition - Step 2 */}
            <div 
              onClick={() => onStepClick(2)}
              className={`flex rounded transition-all cursor-pointer ${
                isActive && currentStep === 2 
                  ? "bg-[#007AFF]/30 ring-2 ring-[#007AFF] animate-pulse" 
                  : "hover:bg-white/5"
              }`}
            >
              <div className="text-gray-600 pr-4 select-none w-8">4</div>
              <div><span className="text-purple-400">def</span> <span className="text-yellow-300">create_app</span>():</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8">5</div>
              <div className="pl-8"><span className="text-gray-500"># TODO: 初始化应用</span></div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8">6</div>
              <div className="pl-8">app = Flask(__name__)</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8">7</div>
              <div className="pl-8"><span className="text-purple-400">return</span> app</div>
            </div>
          </div>

          {/* 终端 - Step 4 */}
          <div 
            onClick={() => onStepClick(4)}
            className={`h-28 border-t border-[#3C3C3C] bg-[#1E1E1E] p-3 font-mono text-[11px] transition-all cursor-pointer ${
              isActive && currentStep === 4 
                ? "ring-2 ring-[#007AFF] ring-inset bg-[#007AFF]/10 animate-pulse" 
                : "hover:bg-white/5"
            }`}
          >
            <div className="text-gray-500 mb-2">终端</div>
            <div className="text-green-400">$ python main.py</div>
            <div className="text-gray-400">* Running on http://127.0.0.1:5000</div>
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
    1: { top: "115px", left: "60px", text: "点击此处" },
    2: { top: "195px", left: "280px", text: "点击此处" },
    3: { top: "150px", left: "60px", text: "点击此处" },
    4: { top: "calc(100% - 140px)", left: "280px", text: "点击此处" },
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
