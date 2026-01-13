"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight, 
  Settings,
  CheckCircle2,
  MousePointer2,
  Eye,
  Code,
  MessageSquare,
  Palette,
  RotateCcw,
  Send,
  Loader2,
  Bot,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeUpload, UploadedDoc } from "./KnowledgeUpload";

type DemoType = "ide" | "reddit" | "figma";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [isKnowledgeExpanded, setIsKnowledgeExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = () => {
    setView("active");
    onStartGuidance();
    addAssistantMessage(`好的，我将引导你完成 ${DEMO_INFO[currentDemo].name} 的操作流程。请点击左侧高亮区域开始第一步。`);
  };

  const handleReset = () => {
    setView("setup");
    setMessages([]);
  };

  const addAssistantMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // 构建知识库上下文
      const knowledgeContext = documents.map(d => d.content).join('\n\n---\n\n');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          knowledge: knowledgeContext,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: `msg_${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        addAssistantMessage("抱歉，遇到了一些问题。请稍后再试。");
      }
    } catch (error) {
      console.error('Chat error:', error);
      addAssistantMessage("网络连接出现问题，请检查后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentAdd = (doc: UploadedDoc) => {
    setDocuments(prev => [...prev, doc]);
    addAssistantMessage(`✅ 已成功加载文档「${doc.name}」！现在你可以基于这个文档向我提问。`);
  };

  const handleDocumentRemove = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const demoInfo = DEMO_INFO[currentDemo];
  const stepMessage = STEP_MESSAGES[currentDemo][currentStep] || "进行中...";

  return (
    <div className="flex flex-col h-full bg-white text-[#1D1D1F] overflow-hidden rounded-[28px] shadow-2xl border border-black/5">
      {/* 顶栏 */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-black/[0.03] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-[16px] tracking-tight">AI Navigator</span>
            {documents.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#E8F2FF] text-[#007AFF] text-[10px] font-bold rounded-full uppercase tracking-wider">
                Cloud Synced
              </span>
            )}
          </div>
        </div>
        <button className="w-9 h-9 rounded-full hover:bg-black/[0.03] flex items-center justify-center transition-colors">
          <Settings className="w-4.5 h-4.5 text-[#86868B]" />
        </button>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
        {/* 知识库上传模块 */}
        <KnowledgeUpload
          documents={documents}
          onDocumentAdd={handleDocumentAdd}
          onDocumentRemove={handleDocumentRemove}
          isExpanded={isKnowledgeExpanded}
          onToggleExpand={() => setIsKnowledgeExpanded(!isKnowledgeExpanded)}
        />

        <AnimatePresence mode="wait">
          {view === "setup" ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* 场景选择器 */}
              <div className="space-y-4">
                <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.15em] px-1">
                  选择任务环境
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(DEMO_INFO) as DemoType[]).map((demo) => {
                    const info = DEMO_INFO[demo];
                    const Icon = info.icon;
                    return (
                      <button
                        key={demo}
                        onClick={() => onSwitchDemo?.(demo)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                          currentDemo === demo 
                            ? "bg-white border-[#007AFF] shadow-[0_8px_20px_rgba(0,122,255,0.12)] ring-1 ring-[#007AFF]" 
                            : "bg-[#F5F5F7] border-transparent hover:bg-[#E8E8ED]"
                        )}
                      >
                        <div 
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300",
                            currentDemo === demo ? "scale-110" : ""
                          )}
                          style={{ backgroundColor: currentDemo === demo ? '#007AFF10' : 'white' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: currentDemo === demo ? '#007AFF' : '#86868B' }} />
                        </div>
                        <span className={cn(
                          "text-[12px] font-bold",
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
              <div className="p-5 bg-white rounded-[24px] border border-black/[0.05] shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${demoInfo.color}10` }}
                  >
                    <demoInfo.icon className="w-6 h-6" style={{ color: demoInfo.color }} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1D1D1F]">{demoInfo.name} 辅助模式</h3>
                    <p className="text-[12px] text-[#86868B] mt-0.5">{demoInfo.description}</p>
                  </div>
                </div>
                <button 
                  onClick={handleStart}
                  className="w-full h-12 bg-[#007AFF] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#0063CE] active:scale-[0.98] transition-all shadow-lg shadow-[#007AFF]/20"
                >
                  <Eye className="w-4.5 h-4.5" />
                  开启智能引导
                </button>
              </div>

              {/* 特性说明 */}
              <div className="space-y-2.5 px-1">
                <div className="flex items-center gap-3 text-[12px] text-[#86868B] font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#E8F2FF] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#007AFF]" />
                  </div>
                  <span>交互式视觉高亮与路径导航</span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#86868B] font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#E8F2FF] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#007AFF]" />
                  </div>
                  <span>基于知识库的深度语义问答</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* 当前任务状态 */}
              <div className="p-4 bg-white rounded-[24px] border border-black/[0.05] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${demoInfo.color}10` }}
                    >
                      <demoInfo.icon className="w-4.5 h-4.5" style={{ color: demoInfo.color }} />
                    </div>
                    <span className="text-[13px] font-bold text-[#1D1D1F] uppercase tracking-wider">{demoInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F5F5F7] rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
                    <span className="text-[11px] font-bold text-[#1D1D1F]">{currentStep} / {totalSteps}</span>
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed font-semibold text-[#1D1D1F] px-1">
                  {stepMessage}
                </p>

                <div className="flex gap-2.5">
                  <button 
                    onClick={currentStep >= totalSteps ? handleReset : onNextStep}
                    className={cn(
                      "flex-1 h-10 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                      currentStep >= totalSteps
                        ? "bg-[#34C759] text-white shadow-lg shadow-[#34C759]/20"
                        : "bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/20"
                    )}
                  >
                    {currentStep >= totalSteps ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        重置任务
                      </>
                    ) : (
                      <>
                        继续下一步
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI 对话区域 */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
                      msg.role === "user" ? "bg-[#F5F5F7]" : "bg-[#007AFF]"
                    )}>
                      {msg.role === "user" ? (
                        <User className="w-4 h-4 text-[#86868B]" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[85%] p-3.5 rounded-[20px] text-[13px] leading-[1.6] shadow-sm",
                      msg.role === "user" 
                        ? "bg-[#007AFF] text-white rounded-tr-sm" 
                        : "bg-white text-[#1D1D1F] rounded-tl-sm border border-black/[0.03]"
                    )}>
                      <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                    </div>
                  </motion.div>
                ))}
                
                {/* 加载动画 */}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#007AFF] flex items-center justify-center shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-3.5 bg-white rounded-[20px] rounded-tl-sm border border-black/[0.03] shadow-sm">
                      <div className="flex items-center gap-1.5 px-1">
                        <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* AI 状态提示 */}
              <div className="flex gap-3 items-start px-2 py-3 bg-[#F5F5F7] rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <MousePointer2 className="w-3.5 h-3.5 text-[#007AFF]" />
                </div>
                <span className="text-[11px] text-[#1D1D1F] font-bold leading-relaxed">
                  提示：点击左侧蓝色高亮区域可直接完成当前步骤
                </span>
              </div>

              {/* 切换场景 */}
              <button 
                onClick={handleReset}
                className="w-full py-2 text-[11px] text-[#86868B] font-bold hover:text-[#007AFF] transition-all uppercase tracking-widest"
              >
                ← 返回主菜单
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部输入框 */}
      <footer className="p-6 border-t border-black/[0.03] bg-white">
        <div className="relative flex items-center gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={documents.length > 0 ? "向 AI 询问任何细节..." : "上传知识库以解锁高级对话..."}
            disabled={isLoading}
            className="flex-1 h-12 pl-5 pr-5 bg-[#F5F5F7] rounded-2xl text-[14px] font-medium outline-none border border-transparent focus:border-[#007AFF]/30 focus:bg-white transition-all disabled:opacity-50 placeholder:text-[#86868B]"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#007AFF]/20 hover:bg-[#0063CE] active:scale-[0.95] transition-all disabled:opacity-30 disabled:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]" /> 
            AI Engine Active
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" /> 
            {documents.length} Docs Synced
          </span>
        </div>
      </footer>
    </div>
  );
};
