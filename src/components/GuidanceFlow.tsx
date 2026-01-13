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
type TaskType = "basic" | "advanced";

interface Task {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

interface GuidanceFlowProps {
  documents: UploadedDoc[];
  currentDemo: DemoType;
  onDemoSelect: (demo: DemoType) => void;
  onStart: (taskType?: TaskType, taskId?: string) => void;
}

const DEMO_INFO: Record<DemoType, { name: string; icon: any; color: string }> = {
  ide: { name: "PyCharm", icon: Code, color: "#21D789" },
  reddit: { name: "Reddit", icon: MessageSquare, color: "#FF4500" },
  figma: { name: "Figma", icon: Palette, color: "#A259FF" },
};

const ADVANCED_TASKS: Record<DemoType, Task[]> = {
  ide: [
    {
      id: "build-api",
      title: "构建 RESTful API",
      description: "从零开始构建完整的 API 服务",
      steps: [
        "创建 Flask 项目结构",
        "定义数据模型和数据库连接",
        "实现用户认证中间件",
        "创建 RESTful 路由和控制器",
        "编写 API 文档和测试用例",
        "部署到生产环境"
      ]
    },
    {
      id: "debug-complex",
      title: "调试复杂错误",
      description: "系统化排查和修复生产环境问题",
      steps: [
        "分析错误日志和堆栈跟踪",
        "使用调试器设置断点",
        "检查依赖版本兼容性",
        "运行单元测试定位问题",
        "修复并验证解决方案",
        "编写回归测试防止复发"
      ]
    }
  ],
  reddit: [
    {
      id: "gain-followers",
      title: "积累 1000 粉丝",
      description: "系统化策略在 Reddit 建立影响力",
      steps: [
        "选择 3-5 个垂直社区专注深耕",
        "每天发布高质量原创内容",
        "在热门帖子下发表深度评论",
        "与其他用户建立真实互动",
        "分析数据优化发布时间和内容",
        "持续 3-6 个月建立个人品牌"
      ]
    },
    {
      id: "become-mod",
      title: "成为社区版主",
      description: "通过贡献获得社区认可",
      steps: [
        "选择目标社区并深度参与",
        "定期发布有价值的内容",
        "帮助新用户解答问题",
        "举报违规内容维护社区",
        "参与社区讨论和决策",
        "申请版主职位并展示贡献"
      ]
    }
  ],
  figma: [
    {
      id: "become-expert",
      title: "成为设计专家",
      description: "从入门到精通的完整路径",
      steps: [
        "学习设计系统基础理论",
        "掌握 Figma 高级功能（组件、变体、自动布局）",
        "完成 10 个真实项目案例",
        "建立个人设计作品集",
        "学习用户研究和交互设计",
        "参与设计社区并分享经验"
      ]
    },
    {
      id: "design-system",
      title: "构建企业级设计系统",
      description: "创建可扩展的设计规范",
      steps: [
        "定义设计原则和品牌规范",
        "创建基础组件库（按钮、输入框等）",
        "建立组件变体和状态系统",
        "编写设计文档和使用指南",
        "与开发团队协作实现",
        "持续迭代和维护系统"
      ]
    }
  ],
};

const BASIC_TASKS: Record<DemoType, string[]> = {
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskType, setTaskType] = useState<TaskType>("basic");
  const [generatedSteps, setGeneratedSteps] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 自动触发生成逻辑 - 修复卡住问题
  useEffect(() => {
    // 当进入步骤 2 且还没有生成步骤时，开始生成
    if (currentStep === 2) {
      if (generatedSteps.length === 0 && !isGenerating) {
        setIsGenerating(true);
        // 模拟 AI 生成过程
        const timer = setTimeout(() => {
          // 如果还没有选择任务，使用基础任务
          if (!selectedTask && taskType === "basic") {
            setGeneratedSteps(BASIC_TASKS[currentDemo]);
          }
          setIsGenerating(false);
          // 自动进入下一步
          setCurrentStep(3);
        }, 2000);
        return () => clearTimeout(timer);
      } else if (generatedSteps.length > 0) {
        // 如果已经有步骤，直接进入下一步
        setCurrentStep(3);
      }
    }
  }, [currentStep, currentDemo, selectedTask, taskType, generatedSteps.length, isGenerating]);

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
            className="space-y-5"
          >
            <p className="text-[13px] font-bold text-[#1D1D1F] mb-4">选择目标软件</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(Object.keys(DEMO_INFO) as DemoType[]).map((demo) => {
                const info = DEMO_INFO[demo];
                const Icon = info.icon;
                return (
                  <button
                    key={demo}
                    onClick={() => {
                      onDemoSelect(demo);
                      setSelectedTask(null);
                      setTaskType("basic");
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

            {/* 任务类型选择 */}
            <div className="space-y-3">
              <p className="text-[12px] font-bold text-[#86868B] uppercase tracking-wider">选择任务类型</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTaskType("basic");
                    setSelectedTask(null);
                  }}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-[12px] font-bold transition-all",
                    taskType === "basic"
                      ? "bg-[#007AFF] text-white"
                      : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#E8E8ED]"
                  )}
                >
                  基础任务
                </button>
                <button
                  onClick={() => {
                    setTaskType("advanced");
                    setSelectedTask(null);
                  }}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-[12px] font-bold transition-all",
                    taskType === "advanced"
                      ? "bg-[#007AFF] text-white"
                      : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#E8E8ED]"
                  )}
                >
                  复杂任务
                </button>
              </div>

              {/* 任务选择 */}
              {taskType === "basic" ? (
                <button
                  onClick={() => {
                    setGeneratedSteps(BASIC_TASKS[currentDemo]);
                    setCurrentStep(2);
                  }}
                  className="w-full h-12 bg-[#007AFF] text-white rounded-xl text-[13px] font-bold hover:bg-[#0063CE] transition-all"
                >
                  使用基础任务
                </button>
              ) : (
                <div className="space-y-2">
                  {ADVANCED_TASKS[currentDemo].map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setSelectedTask(task);
                        setGeneratedSteps(task.steps);
                        setCurrentStep(2);
                      }}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all",
                        selectedTask?.id === task.id
                          ? "bg-[#007AFF] text-white border-[#007AFF]"
                          : "bg-white border-black/[0.05] hover:border-[#007AFF]/30"
                      )}
                    >
                      <div className="font-bold text-[13px] mb-1">{task.title}</div>
                      <div className={cn(
                        "text-[11px]",
                        selectedTask?.id === task.id ? "text-white/80" : "text-[#86868B]"
                      )}>
                        {task.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
              <Sparkles className={cn(
                "w-5 h-5 text-[#007AFF]",
                isGenerating && "animate-pulse"
              )} />
              <span className="text-[13px] font-bold text-[#1D1D1F]">
                AI 正在生成引导路径
              </span>
            </div>
            <div className="space-y-2 pl-8">
              <motion.p 
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-[11px] text-[#86868B]"
              >
                解析知识库文档...
              </motion.p>
              <motion.p 
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[11px] text-[#86868B]"
              >
                识别 {demoInfo.name} 操作流程...
              </motion.p>
              <motion.p 
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-[11px] text-[#007AFF] font-medium"
              >
                生成结构化引导步骤...
              </motion.p>
            </div>
            {!isGenerating && generatedSteps.length === 0 && (
              <button
                onClick={() => {
                  if (selectedTask) {
                    setGeneratedSteps(selectedTask.steps);
                  } else {
                    setGeneratedSteps(BASIC_TASKS[currentDemo]);
                  }
                  setCurrentStep(3);
                }}
                className="w-full h-10 bg-[#007AFF] text-white rounded-xl text-[12px] font-bold hover:bg-[#0063CE] transition-colors"
              >
                手动完成生成
              </button>
            )}
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
                setTimeout(() => onStart(taskType, selectedTask?.id), 300);
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
