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
    <div className="flex flex-col h-full text-[#1D1D1F] overflow-hidden">
      {/* 顶栏 */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-black/5 shrink-0 bg-white/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shadow-lg shadow-[#007AFF]/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-[14px] tracking-tight">AI Navigator</span>
            {documents.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full">
                知识库已就绪
              </span>
            )}
          </div>
        </div>
        <button className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors">
          <Settings className="w-4 h-4 text-[#86868B]" />
        </button>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* 场景选择器 */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest px-1">
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
                          "text-[10px] font-bold",
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
              <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${demoInfo.color}20` }}
                  >
                    <demoInfo.icon className="w-5 h-5" style={{ color: demoInfo.color }} />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold">{demoInfo.name} 引导</h3>
                    <p className="text-[10px] text-[#86868B]">{demoInfo.description}</p>
                  </div>
                </div>
                <button 
                  onClick={handleStart}
                  className="w-full h-10 bg-gradient-to-r from-[#007AFF] to-[#5856D6] text-white rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-[#007AFF]/20"
                >
                  <Eye className="w-4 h-4" />
                  开始引导演示
                </button>
              </div>

              {/* 特性说明 */}
              <div className="space-y-1.5 px-1">
                <div className="flex items-center gap-2 text-[10px] text-[#86868B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>点击高亮区域自动进入下一步</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#86868B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>上传文档启用智能问答</span>
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
              <div className="p-3 bg-white rounded-2xl border border-black/5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${demoInfo.color}20` }}
                    >
                      <demoInfo.icon className="w-4 h-4" style={{ color: demoInfo.color }} />
                    </div>
                    <span className="text-[12px] font-bold">{demoInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#007AFF]/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
                    <span className="text-[9px] font-bold text-[#007AFF]">{currentStep}/{totalSteps}</span>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed font-medium text-gray-700">
                  {stepMessage}
                </p>

                <div className="flex gap-2">
                  <button 
                    onClick={currentStep >= totalSteps ? handleReset : onNextStep}
                    className={cn(
                      "flex-1 h-9 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm",
                      currentStep >= totalSteps
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-[#007AFF] hover:bg-[#0063CE] text-white"
                    )}
                  >
                    {currentStep >= totalSteps ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        重新开始
                      </>
                    ) : (
                      <>
                        跳过此步
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI 对话区域 */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                      msg.role === "user" ? "bg-gray-200" : "bg-gradient-to-br from-[#007AFF] to-[#5856D6]"
                    )}>
                      {msg.role === "user" ? (
                        <User className="w-3 h-3 text-gray-600" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={cn(
                      "flex-1 p-2.5 rounded-2xl text-[11px] leading-relaxed",
                      msg.role === "user" 
                        ? "bg-gray-100 text-gray-800 rounded-tl-sm" 
                        : "bg-[#007AFF]/5 text-gray-700 rounded-tl-sm border border-[#007AFF]/10"
                    )}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </motion.div>
                ))}
                
                {/* 加载动画 */}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="p-2.5 bg-[#007AFF]/5 rounded-2xl rounded-tl-sm border border-[#007AFF]/10">
                      <div className="flex items-center gap-1">
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
              <div className="flex gap-2 items-start px-1">
                <div className="w-5 h-5 rounded-md bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                  <MousePointer2 className="w-3 h-3 text-[#007AFF]" />
                </div>
                <span className="text-[9px] text-[#007AFF] font-medium">
                  💡 点击左侧蓝色高亮区域自动进入下一步
                </span>
              </div>

              {/* 切换场景 */}
              <button 
                onClick={handleReset}
                className="w-full py-2 text-[10px] text-[#86868B] font-medium hover:text-[#007AFF] transition-colors"
              >
                ← 返回选择其他场景
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部输入框 */}
      <footer className="p-4 border-t border-black/5 bg-white/90 backdrop-blur-sm">
        <div className="relative flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={documents.length > 0 ? "基于知识库提问..." : "上传文档后开始对话..."}
            disabled={isLoading}
            className="flex-1 h-10 pl-4 pr-4 bg-[#F5F5F7] rounded-xl text-[12px] outline-none border border-transparent focus:border-[#007AFF]/20 focus:bg-white transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-gradient-to-r from-[#007AFF] to-[#5856D6] rounded-xl flex items-center justify-center shadow-lg shadow-[#007AFF]/20 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-[8px] font-bold text-[#86868B] uppercase tracking-[0.1em]">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" /> 
            {documents.length > 0 ? `${documents.length} 文档已加载` : 'AI 对话已就绪'}
          </span>
        </div>
      </footer>
    </div>
  );
};
