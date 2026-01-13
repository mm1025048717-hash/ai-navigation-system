"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Code, 
  MessageSquare, 
  Palette,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Eye,
  PlayCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedDoc } from "./KnowledgeUpload";

type DemoType = "ide" | "reddit" | "figma";

interface GuidanceFlowProps {
  documents: UploadedDoc[];
  currentDemo: DemoType;
  onDemoSelect: (demo: DemoType) => void;
  onStart: () => void;
  isGenerating?: boolean;
}

const DEMO_INFO: Record<DemoType, { name: string; icon: any; color: string; description: string }> = {
  ide: { name: "PyCharm", icon: Code, color: "#21D789", description: "代码开发工具" },
  reddit: { name: "Reddit", icon: MessageSquare, color: "#FF4500", description: "社区平台" },
  figma: { name: "Figma", icon: Palette, color: "#A259FF", description: "设计工具" },
};

const GENERATED_STEPS: Record<DemoType, string[]> = {
  ide: [
    "打开 PyCharm 项目",
    "在项目资源管理器中定位 login_view.py",
    "在编辑器中定义 login() 函数",
    "检查并修复导入错误",
    "运行项目查看结果"
  ],
  reddit: [
    "访问 Reddit 首页",
    "点击「Create Post」按钮",
    "浏览并选择感兴趣的帖子",
    "在评论区发表回复",
    "查看社区信息卡片"
  ],
  figma: [
    "选择矩形工具",
    "在画布上绘制卡片组件",
    "调整组件的位置和大小",
    "修改组件的填充颜色",
    "导出设计为 PNG 格式"
  ],
};

export const GuidanceFlow = ({
  documents,
  currentDemo,
  onDemoSelect,
  onStart,
  isGenerating = false
}: GuidanceFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedSteps, setGeneratedSteps] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isGenerating && currentStep === 2) {
      // 模拟 AI 生成引导路径的过程
      const timer = setTimeout(() => {
        setGeneratedSteps(GENERATED_STEPS[currentDemo]);
        setIsComplete(true);
        setCurrentStep(3);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, currentStep, currentDemo]);

  const steps = [
    { id: 0, title: "上传知识库", icon: Upload, completed: documents.length > 0 },
    { id: 1, title: "选择软件", icon: Code, completed: currentStep > 0 },
    { id: 2, title: "AI 生成路径", icon: Sparkles, completed: currentStep > 1, generating: isGenerating },
    { id: 3, title: "查看引导步骤", icon: Eye, completed: isComplete },
    { id: 4, title: "开始引导", icon: PlayCircle, completed: false },
  ];

  const demoInfo = DEMO_INFO[currentDemo];

  return (
    <div className="space-y-6">
      {/* 流程步骤指示器 */}
      <div className="relative">
        <div className="flex items-center justify-between px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = step.completed;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative">
                  <motion.div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                      isCompleted
                        ? "bg-[#34C759] border-[#34C759] text-white"
                        : isActive
                        ? "bg-[#007AFF] border-[#007AFF] text-white"
                        : "bg-white border-[#E8E8ED] text-[#86868B]"
                    )}
                    animate={isActive && step.generating ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {step.generating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 left-full w-full h-0.5 bg-[#E8E8ED] -z-10">
                      <motion.div
                        className="h-full bg-[#34C759]"
                        initial={{ width: 0 }}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-bold text-center max-w-[60px]",
                  isActive || isCompleted ? "text-[#1D1D1F]" : "text-[#86868B]"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 当前步骤内容 */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-white rounded-[24px] border border-black/[0.05] shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F2FF] flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#1D1D1F]">步骤 1: 上传知识库</h3>
                <p className="text-[11px] text-[#86868B] mt-0.5">上传软件说明书、操作手册等文档</p>
              </div>
            </div>
            
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 bg-[#F5F5F7] rounded-xl">
                    <FileText className="w-4 h-4 text-[#007AFF]" />
                    <span className="text-[12px] font-medium text-[#1D1D1F]">{doc.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#34C759] ml-auto" />
                  </div>
                ))}
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full h-10 bg-[#007AFF] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#0063CE] transition-colors"
                >
                  继续下一步
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-[#F5F5F7] rounded-xl text-center">
                <p className="text-[12px] text-[#86868B]">
                  请先在 <strong>AI 对话</strong> 标签中上传知识库文档
                </p>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="p-5 bg-white rounded-[24px] border border-black/[0.05] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E8F2FF] flex items-center justify-center">
                  <Code className="w-5 h-5 text-[#007AFF]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1D1D1F]">步骤 2: 选择目标软件</h3>
                  <p className="text-[11px] text-[#86868B] mt-0.5">选择要生成引导的软件</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(DEMO_INFO) as DemoType[]).map((demo) => {
                  const info = DEMO_INFO[demo];
                  const Icon = info.icon;
                  return (
                    <button
                      key={demo}
                      onClick={() => {
                        onDemoSelect(demo);
                        setCurrentStep(2);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                        currentDemo === demo
                          ? "bg-white border-[#007AFF] shadow-sm ring-1 ring-[#007AFF]"
                          : "bg-[#F5F5F7] border-transparent hover:bg-[#E8E8ED]"
                      )}
                    >
                      <Icon className="w-6 h-6" style={{ color: currentDemo === demo ? info.color : '#86868B' }} />
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
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-white rounded-[24px] border border-black/[0.05] shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F2FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#007AFF] animate-pulse" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#1D1D1F]">步骤 3: AI 正在生成引导路径</h3>
                <p className="text-[11px] text-[#86868B] mt-0.5">基于知识库分析并生成操作步骤...</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
                <Zap className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>正在解析知识库文档...</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
                <Zap className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>识别 {demoInfo.name} 操作流程...</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
                <Loader2 className="w-3.5 h-3.5 text-[#007AFF] animate-spin" />
                <span>生成结构化引导步骤...</span>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && generatedSteps.length > 0 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="p-5 bg-white rounded-[24px] border border-black/[0.05] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E8F2FF] flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#007AFF]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1D1D1F]">步骤 4: 生成的引导路径</h3>
                  <p className="text-[11px] text-[#86868B] mt-0.5">AI 已为你生成 {generatedSteps.length} 个操作步骤</p>
                </div>
              </div>

              <div className="space-y-2">
                {generatedSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-[#F5F5F7] rounded-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#007AFF] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-[12px] font-medium text-[#1D1D1F] flex-1">{step}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentStep(4);
                  setTimeout(() => onStart(), 500);
                }}
                className="w-full h-12 bg-[#007AFF] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#0063CE] transition-colors mt-4 shadow-lg shadow-[#007AFF]/20"
              >
                <PlayCircle className="w-5 h-5" />
                开始智能引导
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
