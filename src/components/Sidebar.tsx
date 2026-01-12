"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight, 
  Settings,
  CheckCircle2,
  Cpu,
  MousePointer2,
  Scan,
  RefreshCw,
  Eye,
  Pause,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onStartGuidance: () => void;
  currentStep: number;
  totalSteps: number;
  onNextStep: () => void;
}

export const Sidebar = ({ onStartGuidance, currentStep, totalSteps, onNextStep }: SidebarProps) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [view, setView] = useState<"setup" | "active">("setup");
  const [input, setInput] = useState("");
  const [fps, setFps] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCaptureTime = useRef<number>(Date.now());

  // 真实屏幕捕获函数
  const handleCapture = useCallback(async () => {
    if (typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      try {
        const dataUrl = await ipcRenderer.invoke('capture-screen');
        if (dataUrl) {
          setScreenshot(dataUrl);
          // 计算实时帧率
          const now = Date.now();
          const delta = now - lastCaptureTime.current;
          setFps(Math.round(1000 / delta));
          lastCaptureTime.current = now;
        }
      } catch (err) {
        console.error("Capture failed:", err);
      }
    }
  }, []);

  // 启动/停止实时监控
  const toggleLive = useCallback(() => {
    if (isLive) {
      // 停止
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsLive(false);
    } else {
      // 启动实时监控 - 每500ms刷新一次
      handleCapture();
      intervalRef.current = setInterval(handleCapture, 500);
      setIsLive(true);
    }
  }, [isLive, handleCapture]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 初始加载时捕获一次
  useEffect(() => {
    handleCapture();
  }, [handleCapture]);

  // 进入激活模式时自动开启实时监控
  useEffect(() => {
    if (view === "active" && !isLive) {
      toggleLive();
    }
  }, [view]);

  return (
    <div className="flex flex-col h-full text-[#1D1D1F] overflow-hidden">
      {/* 顶栏 */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-black/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[6px] bg-[#007AFF] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-[14px] tracking-tight">AI Vision Navigator</span>
        </div>
        <button className="w-8 h-8 rounded-md hover:bg-black/5 flex items-center justify-center transition-colors">
          <Settings className="w-4 h-4 text-[#86868B]" />
        </button>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-5">
        <AnimatePresence mode="wait">
          {view === "setup" ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* 实时视觉监控区 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#86868B] uppercase tracking-widest px-1">
                  <span>实时屏幕感知</span>
                  <button 
                    onClick={toggleLive} 
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all",
                      isLive ? "text-green-600 bg-green-50" : "text-[#007AFF] hover:bg-blue-50"
                    )}
                  >
                    {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {isLive ? "暂停" : "启动"}
                  </button>
                </div>

                <div className="relative aspect-video rounded-2xl bg-[#0a0a0a] overflow-hidden border border-black/10 shadow-inner">
                  {screenshot ? (
                    <img src={screenshot} alt="Screen" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Eye className="w-6 h-6 opacity-30" />
                      </div>
                      <span className="text-[11px] font-medium opacity-50">等待屏幕信号...</span>
                    </div>
                  )}
                  
                  {/* 实时状态条 */}
                  {isLive && (
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">LIVE</span>
                      </div>
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
                        <span className="text-[9px] font-bold text-white/70">{fps} FPS</span>
                      </div>
                    </div>
                  )}

                  {/* 扫描线动效 */}
                  {isLive && (
                    <motion.div 
                      className="absolute left-0 right-0 h-[1px] bg-[#007AFF]/50 shadow-[0_0_8px_#007AFF]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
              </div>

              {/* 操作卡片 */}
              <div className="p-5 bg-[#FBFBFD] rounded-2xl border border-black/5 space-y-4">
                <h3 className="text-[14px] font-bold">视觉引擎就绪</h3>
                <p className="text-[12px] text-[#86868B] leading-relaxed">
                  系统正在实时读取你的屏幕。点击下方按钮进入任务引导模式。
                </p>
                <button 
                  onClick={() => setView("active")}
                  className="w-full h-11 bg-[#007AFF] text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#0063CE] transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  进入智能导航模式
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {/* 实时缩略画面 */}
              <div className="relative h-32 rounded-xl bg-black overflow-hidden border border-black/10 shadow-sm">
                {screenshot && <img src={screenshot} alt="Live" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">实时监控</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/80">{fps} FPS</span>
                  <button 
                    onClick={toggleLive}
                    className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-colors"
                  >
                    {isLive ? <Pause className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 text-white" />}
                  </button>
                </div>
              </div>

              {/* 任务控制卡 */}
              <div className="p-5 bg-white rounded-2xl border border-black/5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                      <Scan className="w-4 h-4 text-[#007AFF]" />
                    </div>
                    <span className="text-[13px] font-bold">任务指引</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#86868B]">{currentStep}/5</span>
                </div>

                <p className="text-[14px] leading-relaxed font-medium text-gray-700">
                  {currentStep === 0 && "AI 正在实时分析你的屏幕..."}
                  {currentStep === 1 && "已识别当前页面元素，请按提示操作。"}
                  {currentStep > 1 && currentStep < 5 && "目标已锁定，请按照高亮区域点击。"}
                  {currentStep === 5 && "🎉 任务完成！"}
                </p>

                <button 
                  onClick={onNextStep}
                  className="w-full h-11 bg-[#007AFF] text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0063CE] transition-colors shadow-sm"
                >
                  {currentStep >= 5 ? "重新开始" : "下一步"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 神经网络日志 */}
              <div className="space-y-2 px-1">
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-md bg-[#F5F5F7] flex items-center justify-center shrink-0">
                    <Cpu className="w-3 h-3 text-[#86868B]" />
                  </div>
                  <div className="text-[11px] text-[#86868B] leading-relaxed">
                    视觉引擎持续解析中... 采样率 {fps} fps
                  </div>
                </div>
                {currentStep > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="w-5 h-5 rounded-md bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                      <MousePointer2 className="w-3 h-3 text-[#007AFF]" />
                    </div>
                    <div className="text-[11px] text-[#007AFF] font-medium leading-relaxed">
                      交互锚点已映射到屏幕坐标系。
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部输入框 */}
      <footer className="p-5 border-t border-black/5 bg-white/50">
        <div className="relative flex items-center">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入任务需求..."
            className="w-full h-11 pl-4 pr-12 bg-[#F5F5F7] rounded-xl text-[13px] outline-none border border-transparent focus:border-[#007AFF]/20 transition-all"
          />
          <button className="absolute right-2 top-2 w-7 h-7 bg-[#007AFF] rounded-lg flex items-center justify-center shadow-lg shadow-[#007AFF]/20">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-[9px] font-bold text-[#86868B] uppercase tracking-[0.12em]">
          <span className="flex items-center gap-1">
            <CheckCircle2 className={cn("w-3 h-3", isLive ? "text-green-500" : "text-gray-300")} /> 
            {isLive ? "实时监控中" : "待机"}
          </span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> 知识库同步</span>
        </div>
      </footer>
    </div>
  );
};
