"use client";

import { motion } from "framer-motion";

interface DemoIDEProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
}

export const DemoIDE = ({ currentStep, isActive, onStepClick, taskType = "basic", taskId }: DemoIDEProps) => {
  const isAdvanced = taskType === "advanced";
  const isBuildAPI = taskId === "build-api";
  const isDebugComplex = taskId === "debug-complex";

  return (
    <div className="h-full bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* 标题栏 */}
      <div className="h-10 bg-[#323233] flex items-center px-4 gap-2 border-b border-[#3C3C3C]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
        <span className="ml-4 text-[12px] text-gray-400 font-medium">PyCharm Professional - my_project</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="px-2 py-0.5 bg-[#007ACC]/20 text-[#007ACC] text-[10px] font-bold rounded">Python 3.11</div>
        </div>
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
                {isActive && currentStep === 1 && <span className="ml-auto w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-pulse" />}
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
                {isActive && currentStep === 3 && <span className="ml-auto w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-pulse" />}
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 rounded cursor-pointer">
                <span className="text-purple-400">📄</span> utils.py
              </div>
              {isAdvanced && (
                <>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 rounded cursor-pointer">
                    <span className="text-orange-400">📄</span> models.py
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 rounded cursor-pointer">
                    <span className="text-pink-400">📄</span> routes.py
                  </div>
                  {isBuildAPI && (
                    <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 rounded cursor-pointer">
                      <span className="text-cyan-400">📄</span> auth.py
                    </div>
                  )}
                </>
              )}
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
          <div className="flex-1 p-4 font-mono text-[13px] overflow-auto bg-[#1E1E1E]">
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8 text-right">1</div>
              <div><span className="text-purple-400">from</span> <span className="text-green-400">flask</span> <span className="text-purple-400">import</span> Flask</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8 text-right">2</div>
              <div><span className="text-purple-400">from</span> <span className="text-green-400">config</span> <span className="text-purple-400">import</span> settings</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8 text-right">3</div>
              <div></div>
            </div>
            {/* Function definition - Step 2 */}
            <div 
              onClick={() => onStepClick(2)}
              className={`flex rounded transition-all cursor-pointer px-1 -mx-1 ${
                isActive && currentStep === 2 
                  ? "bg-[#007AFF]/30 ring-2 ring-[#007AFF] animate-pulse" 
                  : "hover:bg-white/5"
              }`}
            >
              <div className="text-gray-600 pr-4 select-none w-8 text-right">4</div>
              <div><span className="text-purple-400">def</span> <span className="text-yellow-300">create_app</span>():</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8 text-right">5</div>
              <div className="pl-8"><span className="text-gray-500"># TODO: 初始化应用</span></div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8 text-right">6</div>
              <div className="pl-8">app = <span className="text-yellow-300">Flask</span>(__name__)</div>
            </div>
            <div className="flex">
              <div className="text-gray-600 pr-4 select-none w-8 text-right">7</div>
              <div className="pl-8"><span className="text-purple-400">return</span> app</div>
            </div>
            {isAdvanced && isBuildAPI && (
              <>
                <div className="flex mt-4">
                  <div className="text-gray-600 pr-4 select-none w-8 text-right">8</div>
                  <div></div>
                </div>
                <div className="flex">
                  <div className="text-gray-600 pr-4 select-none w-8 text-right">9</div>
                  <div><span className="text-purple-400">from</span> <span className="text-green-400">flask_restful</span> <span className="text-purple-400">import</span> Api, Resource</div>
                </div>
                <div className="flex">
                  <div className="text-gray-600 pr-4 select-none w-8 text-right">10</div>
                  <div><span className="text-purple-400">from</span> <span className="text-green-400">models</span> <span className="text-purple-400">import</span> db</div>
                </div>
              </>
            )}
          </div>

          {/* 终端 - Step 4 */}
          <div 
            onClick={() => onStepClick(4)}
            className={`h-32 border-t border-[#3C3C3C] bg-[#1E1E1E] p-3 font-mono text-[11px] transition-all cursor-pointer relative ${
              isActive && currentStep === 4 
                ? "ring-2 ring-[#007AFF] ring-inset bg-[#007AFF]/10 animate-pulse" 
                : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-500 font-medium">终端</div>
              {isActive && currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-4 top-3"
                >
                  <div className="px-3 py-1 bg-white text-[#007AFF] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#007AFF]/20 text-[11px] font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-pulse" />
                    点击此处
                  </div>
                </motion.div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-green-400">$ python main.py</div>
              {isAdvanced && isDebugComplex ? (
                <>
                  <div className="text-red-400">Traceback (most recent call last):</div>
                  <div className="text-red-400 ml-4">File "main.py", line 6, in create_app</div>
                  <div className="text-red-400 ml-8">AttributeError: module 'flask' has no attribute 'Flask'</div>
                </>
              ) : (
                <div className="text-gray-400">* Running on http://127.0.0.1:5000</div>
              )}
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
