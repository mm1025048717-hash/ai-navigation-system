"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface DemoIDEProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoIDE = ({ currentStep, isActive, onStepClick, taskType = "basic", taskId, generatedSteps = [], totalSteps = 4 }: DemoIDEProps) => {
  const isAdvanced = taskType === "advanced";
  const isBuildAPI = taskId === "build-api";
  const isDebugComplex = taskId === "debug-complex";
  const [activeTab, setActiveTab] = useState("main.py");
  const [activeBottomTab, setActiveBottomTab] = useState("terminal");
  const [codeContent, setCodeContent] = useState({
    "main.py": `from flask import Flask
from config import settings

def create_app():
    # TODO: 初始化应用
    app = Flask(__name__)
    return app`,
    "config.py": `class Config:
    SECRET_KEY = 'your-secret-key'`,
    "utils.py": `def helper_function():
    pass`,
  });
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // 根据步骤内容动态确定可点击元素
  const getStepTarget = (stepIndex: number) => {
    if (!isAdvanced || !generatedSteps.length) {
      return stepIndex;
    }
    const stepText = generatedSteps[stepIndex - 1]?.toLowerCase() || "";
    if (stepText.includes("项目") || stepText.includes("创建") || stepText.includes("结构")) return 1;
    if (stepText.includes("模型") || stepText.includes("数据") || stepText.includes("数据库")) return 2;
    if (stepText.includes("认证") || stepText.includes("中间件") || stepText.includes("auth")) return 3;
    if (stepText.includes("路由") || stepText.includes("控制器") || stepText.includes("api")) return 4;
    if (stepText.includes("文档") || stepText.includes("测试") || stepText.includes("用例")) return 5;
    if (stepText.includes("部署") || stepText.includes("生产") || stepText.includes("环境")) return 6;
    return Math.min(stepIndex, 6);
  };

  const files = [
    { name: "main.py", icon: "📄", color: "text-green-400", isActive: activeTab === "main.py" },
    { name: "config.py", icon: "📄", color: "text-blue-400", isActive: activeTab === "config.py" },
    { name: "utils.py", icon: "📄", color: "text-purple-400", isActive: activeTab === "utils.py" },
    ...(isAdvanced ? [
      { name: "models.py", icon: "📄", color: "text-orange-400", isActive: activeTab === "models.py" },
      { name: "routes.py", icon: "📄", color: "text-pink-400", isActive: activeTab === "routes.py" },
      ...(isBuildAPI ? [{ name: "auth.py", icon: "📄", color: "text-cyan-400", isActive: activeTab === "auth.py" }] : []),
    ] : []),
  ];
  
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
          <div className="w-6 h-6 rounded bg-[#3C3C3C] flex items-center justify-center text-gray-400 text-[10px] cursor-pointer hover:bg-[#454545]">
            ⚙️
          </div>
        </div>
      </div>

      {/* 顶部菜单栏 */}
      <div className="h-8 bg-[#2D2D2D] flex items-center px-4 gap-4 border-b border-[#3C3C3C] text-[11px] text-gray-300">
        <span className="hover:text-white cursor-pointer">File</span>
        <span className="hover:text-white cursor-pointer">Edit</span>
        <span className="hover:text-white cursor-pointer">View</span>
        <span className="hover:text-white cursor-pointer">Navigate</span>
        <span className="hover:text-white cursor-pointer">Code</span>
        <span className="hover:text-white cursor-pointer">Refactor</span>
        <span className="hover:text-white cursor-pointer">Run</span>
        <span className="hover:text-white cursor-pointer">Tools</span>
        <span className="hover:text-white cursor-pointer">VCS</span>
        <span className="hover:text-white cursor-pointer">Window</span>
        <span className="hover:text-white cursor-pointer">Help</span>
      </div>

      {/* 工具栏 */}
      <div className="h-10 bg-[#2D2D2D] flex items-center px-4 gap-2 border-b border-[#3C3C3C]">
        <button 
          onClick={() => {
            if (isActive && currentStep === 5) {
              onStepClick(5);
            }
            // 运行代码
            setIsRunning(true);
            setActiveBottomTab("terminal");
            setTerminalOutput([]);
            setErrors([]);
            
            // 模拟运行过程
            setTimeout(() => {
              setTerminalOutput([
                "$ python main.py",
                " * Running on http://127.0.0.1:5000",
                " * Press CTRL+C to quit"
              ]);
              setIsRunning(false);
            }, 1000);
          }}
          disabled={isRunning}
          className={`px-3 py-1.5 text-white text-[11px] font-bold rounded flex items-center gap-1 transition-all ${
            isActive && currentStep === 5
              ? "bg-[#007AFF] ring-2 ring-[#007AFF] ring-offset-1 animate-pulse"
              : isRunning
              ? "bg-[#007ACC]/50 cursor-not-allowed"
              : "bg-[#007ACC] hover:bg-[#0066AA] active:scale-95"
          }`}
        >
          {isRunning ? "⏳ Running..." : "▶️ Run"}
        </button>
        <button 
          onClick={() => {
            // Debug 按钮交互
            setActiveBottomTab("debug");
          }}
          className="px-3 py-1.5 bg-[#2D2D2D] text-gray-300 text-[11px] font-medium rounded hover:bg-[#3C3C3C] active:scale-95 transition-all flex items-center gap-1"
        >
          🐛 Debug
        </button>
        <div className="w-px h-6 bg-[#3C3C3C] mx-2" />
        <button 
          onClick={() => {
            // 搜索功能
          }}
          className="px-2 py-1.5 text-gray-400 text-[11px] hover:text-white hover:bg-[#3C3C3C] active:scale-95 rounded transition-all"
        >
          🔍
        </button>
        <button 
          onClick={() => {
            // 设置功能
          }}
          className="px-2 py-1.5 text-gray-400 text-[11px] hover:text-white hover:bg-[#3C3C3C] active:scale-95 rounded transition-all"
        >
          🔧
        </button>
        <button 
          onClick={() => {
            // 包管理
          }}
          className="px-2 py-1.5 text-gray-400 text-[11px] hover:text-white hover:bg-[#3C3C3C] active:scale-95 rounded transition-all"
        >
          📦
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧项目树 */}
        <div className="w-64 bg-[#252526] border-r border-[#3C3C3C] flex flex-col">
          {/* 项目树标签 */}
          <div className="h-8 bg-[#2D2D2D] flex items-center px-3 border-b border-[#3C3C3C]">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">项目</span>
            <div className="ml-auto flex gap-1">
              <button className="w-5 h-5 text-gray-400 hover:text-white hover:bg-[#3C3C3C] rounded text-[10px]">⚙️</button>
              <button className="w-5 h-5 text-gray-400 hover:text-white hover:bg-[#3C3C3C] rounded text-[10px]">×</button>
            </div>
          </div>
          
          {/* 项目树内容 */}
          <div className="flex-1 overflow-auto p-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] text-gray-300 cursor-pointer hover:bg-white/5 rounded">
                <span className="text-yellow-500">▼</span>
                <span className="text-blue-400">📁</span> my_project
              </div>
              <div className="ml-4 space-y-0.5">
                {files.map((file, index) => (
                  <div
                    key={file.name}
                    onClick={() => {
                      setActiveTab(file.name);
                      if (isActive && ((index === 0 && currentStep === 1) || (index === 1 && currentStep === 3))) {
                        onStepClick(index === 0 ? 1 : 3);
                      }
                    }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-all cursor-pointer ${
                      isActive && ((index === 0 && currentStep === 1) || (index === 1 && currentStep === 3))
                        ? "bg-[#007AFF]/30 ring-2 ring-[#007AFF] text-white animate-pulse" 
                        : file.isActive
                        ? "bg-[#37373D] text-white"
                        : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <span className={file.color}>{file.icon}</span>
                    <span>{file.name}</span>
                    {file.isActive && <span className="ml-auto text-[10px] text-gray-500">●</span>}
                  </div>
                ))}
                <div 
                  onClick={() => {
                    // 文件夹点击交互
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 active:bg-white/10 rounded cursor-pointer transition-all"
                >
                  <span className="text-blue-400">📁</span> templates
                </div>
                <div 
                  onClick={() => {
                    // 文件夹点击交互
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 active:bg-white/10 rounded cursor-pointer transition-all"
                >
                  <span className="text-blue-400">📁</span> static
                </div>
                <div 
                  onClick={() => {
                    // 文件夹点击交互
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-gray-400 hover:bg-white/5 active:bg-white/10 rounded cursor-pointer transition-all"
                >
                  <span className="text-blue-400">📁</span> tests
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主编辑区 */}
        <div className="flex-1 flex flex-col">
          {/* 文件标签栏 */}
          <div className="h-9 bg-[#2D2D2D] flex items-center px-2 border-b border-[#3C3C3C] overflow-x-auto">
            {files.filter(f => f.isActive || files.indexOf(f) < 3).map((file) => (
              <div
                key={file.name}
                onClick={() => setActiveTab(file.name)}
                className={`px-3 py-1.5 text-[12px] rounded-t flex items-center gap-2 cursor-pointer transition-all ${
                  file.isActive
                    ? "bg-[#1E1E1E] text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#37373D]"
                }`}
              >
                <span className={file.color}>{file.icon}</span>
                <span>{file.name}</span>
                {file.isActive && <span className="ml-2 text-[10px] text-gray-500 hover:text-white">×</span>}
              </div>
            ))}
          </div>
          
          {/* 代码编辑区 */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-4 font-mono text-[13px] overflow-auto bg-[#1E1E1E]">
              {activeTab === "main.py" && (
                <div className="space-y-0">
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
                  <div 
                    onClick={() => {
                      if (isActive && currentStep === 2) {
                        onStepClick(2);
                      }
                    }}
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
              )}
              {activeTab === "config.py" && (
                <div className="space-y-0">
                  <div className="flex">
                    <div className="text-gray-600 pr-4 select-none w-8 text-right">1</div>
                    <div><span className="text-purple-400">class</span> <span className="text-yellow-300">Config</span>:</div>
                  </div>
                  <div className="flex">
                    <div className="text-gray-600 pr-4 select-none w-8 text-right">2</div>
                    <div className="pl-8">SECRET_KEY = <span className="text-green-400">'your-secret-key'</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧工具窗口 */}
            <div className="w-64 bg-[#252526] border-l border-[#3C3C3C] flex flex-col">
              <div className="h-8 bg-[#2D2D2D] flex items-center px-3 border-b border-[#3C3C3C]">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">结构</span>
              </div>
              <div className="flex-1 overflow-auto p-2 text-[11px] text-gray-400">
                <div className="space-y-1">
                  <div 
                    onClick={() => {
                      // 结构视图点击
                      if (activeTab === "main.py") {
                        // 跳转到对应代码行
                      }
                    }}
                    className="px-2 py-1 hover:bg-white/5 active:bg-white/10 rounded cursor-pointer transition-all"
                  >
                    create_app()
                  </div>
                  <div 
                    onClick={() => {
                      // 结构视图点击
                    }}
                    className="px-2 py-1 hover:bg-white/5 active:bg-white/10 rounded cursor-pointer ml-4 transition-all"
                  >
                    Flask
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部面板 */}
          <div className="h-40 border-t border-[#3C3C3C] bg-[#1E1E1E] flex flex-col">
            {/* 底部标签栏 */}
            <div className="h-8 bg-[#2D2D2D] flex items-center px-2 border-b border-[#3C3C3C]">
              {["终端", "问题", "调试", "TODO"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveBottomTab(tab.toLowerCase())}
                  className={`px-3 py-1 text-[11px] rounded-t transition-all ${
                    activeBottomTab === tab.toLowerCase()
                      ? "bg-[#1E1E1E] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* 底部内容区 - Step 4 */}
            <div 
              onClick={() => {
                if (isActive && currentStep === 4) {
                  onStepClick(4);
                }
              }}
              className={`flex-1 p-3 font-mono text-[11px] transition-all cursor-pointer relative overflow-auto ${
                isActive && currentStep === 4 
                  ? "ring-2 ring-[#007AFF] ring-inset bg-[#007AFF]/10 animate-pulse" 
                  : "hover:bg-white/5"
              }`}
            >
              {activeBottomTab === "terminal" && (
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
              )}
              {activeBottomTab === "问题" && (
                <div className="text-gray-400">No problems found</div>
              )}
              {activeBottomTab === "调试" && (
                <div className="text-gray-400">No active debug session</div>
              )}
              {activeBottomTab === "todo" && (
                <div className="text-gray-400">main.py:5 - TODO: 初始化应用</div>
              )}
            </div>
          </div>
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
    1: { top: "115px", left: "60px", text: "点击此处" },
    2: { top: "195px", left: "280px", text: "点击此处" },
    3: { top: "150px", left: "60px", text: "点击此处" },
    4: { top: "calc(100% - 140px)", left: "280px", text: "点击此处" },
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
