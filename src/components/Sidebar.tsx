"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight, 
  Settings,
  CheckCircle2,
  Cpu,
  MousePointer2,
  Eye,
  Code,
  MessageSquare,
  Palette,
  RotateCcw,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

type DemoType = "ide" | "reddit" | "figma";

interface SidebarProps {
  onStartGuidance: () => void;
  currentStep: number;
  totalSteps: number;
  onNextStep: () => void;
  isElectron?: boolean;
  currentDemo?: DemoType;
  onSwitchDemo?: (demo: DemoType) => void;
}

const DEMO_INFO: Record<DemoType, { name: string; icon: any; color: string; description: string }> = {
  ide: { name: "PyCharm", icon: Code, color: "#21D789", description: "代码开发引导" },
  reddit: { name: "Reddit", icon: MessageSquare, color: "#FF4500", description: "社区互动引导" },
  figma: { name: "Figma", icon: Palette, color: "#A259FF", description: "设计工具引导" },
};

const STEP_MESSAGES: Record<DemoType, Record<number, string>> = {
  ide: {
    0: "准备就绪，点击开始体验 IDE 操作引导",
    1: "请点击左侧高亮的 main.py 文件",
    2: "点击编辑器中高亮的函数定义",
    3: "点击高亮的 config.py 文件",
    4: "点击底部终端区域查看输出",
  },
  reddit: {
    0: "准备就绪，点击开始体验社区互动引导",
    1: "点击高亮的「Create Post」按钮",
    2: "点击高亮的帖子查看详情",
    3: "点击评论区域参与互动",
    4: "点击右侧社区信息卡片",
  },
  figma: {
    0: "准备就绪，点击开始体验设计工具引导",
    1: "点击左侧高亮的工具栏",
    2: "点击画布中高亮的卡片组件",
    3: "点击底部高亮的组件",
    4: "点击右侧高亮的属性面板",
  },
};

export const Sidebar = ({ 
  onStartGuidance, 
  currentStep, 
  totalSteps, 
  onNextStep, 
  isElectron = false,
  currentDemo = "ide",
  onSwitchDemo
}: SidebarProps) => {
  const [view, setView] = useState<"setup" | "active">("setup");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);

  const handleStart = () => {
    setView("active");
    onStartGuidance();
    setMessages([{ role: "assistant", content: `好的，我将引导你完成 ${DEMO_INFO[currentDemo].name} 的操作流程。请点击左侧高亮区域开始第一步。` }]);
  };

  const handleReset = () => {
    setView("setup");
    setMessages([]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    
    // 模拟 AI 回复
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "理解了。我会根据你的需求调整引导策略。请继续点击左侧高亮区域完成操作。" 
      }]);
    }, 800);
  };

  const demoInfo = DEMO_INFO[currentDemo];
  const stepMessage = STEP_MESSAGES[currentDemo][currentStep] || "进行中...";

  return (
    <div className="flex flex-col h-full text-[#1D1D1F] overflow-hidden">
      {/* 顶栏 */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-black/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#007AFF] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight">AI Navigator</span>
        </div>
        <button className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors">
          <Settings className="w-4 h-4 text-[#86868B]" />
        </button>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-4">
        <AnimatePresence mode="wait">
          {view === "setup" ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* 场景选择器 */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest px-1">
                  选择演示场景
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(DEMO_INFO) as DemoType[]).map((demo) => {
                    const info = DEMO_INFO[demo];
                    const Icon = info.icon;
                    return (
                      <button
                        key={demo}
                        onClick={() => onSwitchDemo?.(demo)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                          currentDemo === demo 
                            ? "bg-white border-[#007AFF] shadow-sm" 
                            : "border-transparent hover:bg-black/5"
                        )}
                      >
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${info.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: info.color }} />
                        </div>
                        <span className={cn(
                          "text-[11px] font-bold",
                          currentDemo === demo ? "text-[#007AFF]" : "text-[#86868B]"
                        )}>
                          {info.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 当前场景信息 */}
              <div className="p-4 bg-[#FBFBFD] rounded-2xl border border-black/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${demoInfo.color}20` }}
                  >
                    <demoInfo.icon className="w-5 h-5" style={{ color: demoInfo.color }} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">{demoInfo.name} 引导</h3>
                    <p className="text-[11px] text-[#86868B]">{demoInfo.description}</p>
                  </div>
                </div>
                <button 
                  onClick={handleStart}
                  className="w-full h-10 bg-[#007AFF] text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#0063CE] transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  开始引导演示
                </button>
              </div>

              {/* 特性说明 */}
              <div className="space-y-1.5 px-1">
                <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>点击高亮区域自动进入下一步</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>支持自然语言实时对话</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* 当前任务状态 */}
              <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${demoInfo.color}20` }}
                    >
                      <demoInfo.icon className="w-4 h-4" style={{ color: demoInfo.color }} />
                    </div>
                    <span className="text-[13px] font-bold">{demoInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#007AFF]/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#007AFF]">{currentStep}/{totalSteps}</span>
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed font-medium text-gray-700">
                  {stepMessage}
                </p>

                <div className="flex gap-2">
                  <button 
                    onClick={currentStep >= totalSteps ? handleReset : onNextStep}
                    className={cn(
                      "flex-1 h-10 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm",
                      currentStep >= totalSteps
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-[#007AFF] hover:bg-[#0063CE] text-white"
                    )}
                  >
                    {currentStep >= totalSteps ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        重新开始
                      </>
                    ) : (
                      <>
                        跳过此步
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI 对话区域 */}
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-3 rounded-2xl text-[12px] leading-relaxed",
                      msg.role === "user" 
                        ? "bg-[#007AFF] text-white ml-6 rounded-tr-sm" 
                        : "bg-[#F5F5F7] text-gray-700 mr-6 rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </motion.div>
                ))}
              </div>

              {/* AI 状态提示 */}
              <div className="flex gap-2 items-start px-1">
                <div className="w-5 h-5 rounded-md bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                  <MousePointer2 className="w-3 h-3 text-[#007AFF]" />
                </div>
                <span className="text-[10px] text-[#007AFF] font-medium">
                  💡 点击左侧蓝色高亮区域自动进入下一步
                </span>
              </div>

              {/* 切换场景 */}
              <button 
                onClick={handleReset}
                className="w-full py-2 text-[11px] text-[#86868B] font-medium hover:text-[#007AFF] transition-colors"
              >
                ← 返回选择其他场景
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部输入框 */}
      <footer className="p-4 border-t border-black/5 bg-white/80">
        <div className="relative flex items-center">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入你的问题或需求..."
            className="w-full h-10 pl-4 pr-12 bg-[#F5F5F7] rounded-xl text-[13px] outline-none border border-transparent focus:border-[#007AFF]/20 focus:bg-white transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1.5 w-7 h-7 bg-[#007AFF] rounded-lg flex items-center justify-center shadow-md shadow-[#007AFF]/20 hover:bg-[#0063CE] transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-[9px] font-bold text-[#86868B] uppercase tracking-[0.1em]">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" /> 
            AI 对话已就绪
          </span>
        </div>
      </footer>
    </div>
  );
};
