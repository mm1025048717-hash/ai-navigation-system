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
  User,
  Navigation,
  MessagesSquare,
  Upload,
  FileText,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedDoc } from "./KnowledgeUpload";
import { GuidanceFlow } from "./GuidanceFlow";

type DemoType = "ide" | "reddit" | "figma";
type TabType = "guidance" | "chat";

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
  const [activeTab, setActiveTab] = useState<TabType>("guidance");
  const [view, setView] = useState<"setup" | "active">("setup");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = () => {
    setView("active");
    onStartGuidance();
  };

  const handleReset = () => {
    setView("setup");
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

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    for (const file of Array.from(files)) {
      if (!file.type.includes('text') && !file.name.endsWith('.md') && !file.name.endsWith('.txt') && !file.name.endsWith('.html')) {
        continue;
      }
      
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const doc = await response.json();
          handleDocumentAdd(doc);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
    setIsUploadMenuOpen(false);
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

      {/* Tab 切换器 */}
      <div className="px-6 py-4 border-b border-black/[0.03] shrink-0">
        <div className="flex gap-2 bg-[#F5F5F7] rounded-xl p-1">
          <button
            onClick={() => setActiveTab("guidance")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all",
              activeTab === "guidance"
                ? "bg-white text-[#007AFF] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            <Navigation className="w-4 h-4" />
            智能引导
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all",
              activeTab === "chat"
                ? "bg-white text-[#007AFF] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            )}
          >
            <MessagesSquare className="w-4 h-4" />
            AI 对话
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "guidance" ? (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {view === "setup" ? (
                <GuidanceFlow
                  documents={documents}
                  currentDemo={currentDemo}
                  onDemoSelect={(demo) => {
                    onSwitchDemo?.(demo);
                  }}
                  onStart={handleStart}
                />
              ) : (
                <div className="space-y-5">
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

                  {/* AI 状态提示 */}
                  <div className="flex gap-3 items-start px-2 py-3 bg-[#F5F5F7] rounded-2xl">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <MousePointer2 className="w-3.5 h-3.5 text-[#007AFF]" />
                    </div>
                    <span className="text-[11px] text-[#1D1D1F] font-bold leading-relaxed">
                      提示：点击左侧蓝色高亮区域可直接完成当前步骤
                    </span>
                  </div>

                  {/* 返回 */}
                  <button 
                    onClick={handleReset}
                    className="w-full py-2 text-[11px] text-[#86868B] font-bold hover:text-[#007AFF] transition-all uppercase tracking-widest"
                  >
                    ← 返回主菜单
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* 已上传文档显示（如果有） */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider px-1">
                    已加载文档 ({documents.length})
                  </p>
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-black/[0.03] group">
                      <FileText className="w-4 h-4 text-[#007AFF] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1D1D1F] truncate flex-1">{doc.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                      <button
                        onClick={() => handleDocumentRemove(doc.id)}
                        className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* AI 对话区域 */}
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-[#86868B]" />
                    </div>
                    <p className="text-[14px] font-bold text-[#1D1D1F] mb-2">开始与 AI 对话</p>
                    <p className="text-[12px] text-[#86868B] max-w-[280px]">
                      {documents.length > 0 
                        ? "基于你上传的知识库，我可以回答相关问题" 
                        : "上传知识库文档后，我可以提供更精准的回答"}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
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
                  ))
                )}
                
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部输入框 - 仅在 AI 对话模式下显示 */}
      {activeTab === "chat" && (
        <footer className="p-6 border-t border-black/[0.03] bg-white relative">
          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.md,.html,text/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          {/* 上传菜单（展开时显示） */}
          <AnimatePresence>
            {isUploadMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-6 right-6 mb-2 p-4 bg-white rounded-2xl border border-black/[0.05] shadow-xl space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#007AFF]" />
                  <span className="text-[12px] font-bold text-[#1D1D1F]">上传知识库</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-10 border-2 border-dashed border-[#E8E8ED] rounded-xl text-[12px] font-medium text-[#86868B] hover:border-[#007AFF] hover:text-[#007AFF] transition-all"
                >
                  {isUploading ? "上传中..." : "选择文件"}
                </button>
                <p className="text-[10px] text-[#86868B] text-center">支持 TXT、Markdown、HTML</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setIsUploadMenuOpen(!isUploadMenuOpen)}
              className="w-12 h-12 rounded-xl border border-black/[0.08] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors shrink-0"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-[#007AFF] animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-[#86868B]" />
              )}
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={documents.length > 0 ? "向 AI 询问任何细节..." : "输入问题或上传知识库..."}
              disabled={isLoading}
              className="flex-1 h-12 pl-5 pr-5 bg-[#F5F5F7] rounded-xl text-[14px] font-medium outline-none border border-transparent focus:border-[#007AFF]/30 focus:bg-white transition-all disabled:opacity-50 placeholder:text-[#86868B]"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-[#007AFF] rounded-xl flex items-center justify-center hover:bg-[#0063CE] active:scale-[0.95] transition-all disabled:opacity-30"
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
              AI Active
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" /> 
              {documents.length} Docs
            </span>
          </div>
        </footer>
      )}
    </div>
  );
};
