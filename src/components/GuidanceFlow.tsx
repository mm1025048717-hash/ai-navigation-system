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
  ArrowRight,
  Eye,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedDoc } from "./KnowledgeUpload";

type DemoType = "ide" | "reddit" | "figma";

interface GuidanceFlowProps {
  documents: UploadedDoc[];
  currentDemo: DemoType;
  onDemoSelect: (demo: DemoType) => void;
  onStart: () => void;
}

const DEMO_INFO: Record<DemoType, { name: string; icon: any; color: string }> = {
  ide: { name: "PyCharm", icon: Code, color: "#21D789" },
  reddit: { name: "Reddit", icon: MessageSquare, color: "#FF4500" },
  figma: { name: "Figma", icon: Palette, color: "#A259FF" },
};

const GENERATED_STEPS: Record<DemoType, string[]> = {
  ide: [
    "打开 PyCharm 项目",
    "定位 login_view.py 文件",
    "定义 login() 函数",
    "修复导入错误",
    "运行项目查看结果"
  ],
  reddit: [
    "访问 Reddit 首页",
    "点击「Create Post」",
    "浏览感兴趣的帖子",
    "在评论区发表回复",
    "查看社区信息"
  ],
  figma: [
    "选择矩形工具",
    "绘制卡片组件",
    "调整位置和大小",
    "修改填充颜色",
    "导出为 PNG"
  ],
};

export const GuidanceFlow = ({
  documents,
  currentDemo,
  onDemoSelect,
  onStart
}: GuidanceFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedSteps, setGeneratedSteps] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 自动触发生成逻辑
  useEffect(() => {
    if (currentStep === 2 && !isGenerating && generatedSteps.length === 0) {
      setIsGenerating(true);
      // 模拟 AI 生成过程
      const timer = setTimeout(() => {
        setGeneratedSteps(GENERATED_STEPS[currentDemo]);
        setIsGenerating(false);
        setCurrentStep(3);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentDemo, isGenerating, generatedSteps.length]);

  const demoInfo = DEMO_INFO[currentDemo];

  return (
    <div className="space-y-8">
      {/* 极简流程指示器 */}
      <div className="flex items-center justify-between px-2">
        {[
          { id: 0, label: "知识库", completed: documents.length > 0 },
          { id: 1, label: "选择软件", completed: currentStep > 0 },
          { id: 2, label: "生成路径", completed: currentStep > 1 },
          { id: 3, label: "开始引导", completed: currentStep > 2 },
        ].map((step, index, arr) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                step.completed ? "bg-[#007AFF]" : "bg-[#E8E8ED]"
              )} />
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider",
                step.completed ? "text-[#007AFF]" : "text-[#86868B]"
              )}>
                {step.label}
              </span>
            </div>
            {index < arr.length - 1 && (
              <div className={cn(
                "h-px flex-1 mx-2 transition-all duration-300",
                step.completed ? "bg-[#007AFF]" : "bg-[#E8E8ED]"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* 当前步骤内容 - 极简设计 */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {documents.length > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                  <span className="text-[13px] font-bold text-[#1D1D1F]">
                    {documents.length} 个文档已就绪
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full h-11 bg-[#007AFF] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#0063CE] active:scale-[0.98] transition-all"
                >
                  继续
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="py-8 text-center">
                <Upload className="w-8 h-8 text-[#86868B] mx-auto mb-3" />
                <p className="text-[12px] text-[#86868B] font-medium">
                  请在 <span className="text-[#007AFF] font-bold">AI 对话</span> 中上传知识库
                </p>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <p className="text-[13px] font-bold text-[#1D1D1F] mb-3">选择目标软件</p>
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
                      "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
                      currentDemo === demo
                        ? "bg-[#007AFF] text-white"
                        : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#E8E8ED]"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-[11px] font-bold">{info.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#007AFF]" />
              <span className="text-[13px] font-bold text-[#1D1D1F]">
                AI 正在生成引导路径
              </span>
            </div>
            <div className="space-y-2 pl-8">
              <p className="text-[11px] text-[#86868B]">解析知识库文档...</p>
              <p className="text-[11px] text-[#86868B]">识别 {demoInfo.name} 操作流程...</p>
              <p className="text-[11px] text-[#007AFF] font-medium">生成结构化引导步骤...</p>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && generatedSteps.length > 0 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-[#007AFF]" />
              <span className="text-[13px] font-bold text-[#1D1D1F]">
                已生成 {generatedSteps.length} 个引导步骤
              </span>
            </div>

            <div className="space-y-2">
              {generatedSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#007AFF] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-[12px] font-medium text-[#1D1D1F] flex-1">{step}</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentStep(4);
                setTimeout(() => onStart(), 300);
              }}
              className="w-full h-12 bg-[#007AFF] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#0063CE] active:scale-[0.98] transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              开始智能引导
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
