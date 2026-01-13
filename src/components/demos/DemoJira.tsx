"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckSquare, Plus, Filter, Search, Settings, BarChart3, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoJiraProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoJira = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoJiraProps) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "设计登录页面", status: "待办", assignee: "张三", priority: "高" },
    { id: 2, title: "实现用户认证", status: "进行中", assignee: "李四", priority: "中" },
    { id: 3, title: "编写API文档", status: "待办", assignee: null, priority: "低" },
    { id: 4, title: "代码审查", status: "已完成", assignee: "王五", priority: "中" },
  ]);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", assignee: "", priority: "中" });
  const [boardView, setBoardView] = useState<"board" | "list">("board");
  
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('创建') || lowerContent.includes('项目')) return 'create-project';
        if (lowerContent.includes('任务') || lowerContent.includes('添加')) return 'add-task';
        if (lowerContent.includes('工作流') || lowerContent.includes('流程')) return 'set-workflow';
        if (lowerContent.includes('分配') || lowerContent.includes('成员')) return 'assign-task';
        if (lowerContent.includes('跟踪') || lowerContent.includes('进度')) return 'track-progress';
      }
    }
    const defaultMap: Record<number, string> = {
      1: 'create-project',
      2: 'add-task',
      3: 'set-workflow',
      4: 'assign-task',
      5: 'track-progress',
    };
    return defaultMap[step] || null;
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部导航栏 */}
      <div className="h-12 bg-[#0052CC] flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-white" />
          <span className="text-[13px] font-bold text-white">Jira</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-[11px] text-white/90">
          <span className="hover:text-white cursor-pointer">项目</span>
          <span className="hover:text-white cursor-pointer">看板</span>
          <span className="hover:text-white cursor-pointer">待办</span>
          <span className="hover:text-white cursor-pointer">报表</span>
        </div>
        <Search className="w-4 h-4 text-white" />
        <User className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 flex">
        {/* 左侧边栏 */}
        <div className="w-64 bg-[#F4F5F7] border-r border-gray-200 p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-[12px] font-semibold text-gray-900 shadow-sm">
              <CheckSquare className="w-4 h-4 text-[#0052CC]" />
              <span>项目</span>
            </div>
            <div
              id="create-project"
              onClick={() => isActive && currentStep === 1 && onStepClick(1)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-[12px] text-gray-700",
                isActive && currentStep === 1
                  ? "bg-[#0052CC]/10 text-[#0052CC] ring-2 ring-[#0052CC]/20"
                  : "hover:bg-white"
              )}
            >
              <Plus className="w-4 h-4" />
              <span>创建项目</span>
            </div>
            <div className="px-3 py-2 rounded-lg hover:bg-white cursor-pointer text-[12px] text-gray-700">
              <span>我的项目</span>
            </div>
            <div className="px-3 py-2 rounded-lg hover:bg-white cursor-pointer text-[12px] text-gray-700">
              <span>最近查看</span>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 看板视图 */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">项目看板</h1>
              <button
                id="add-task"
                onClick={() => isActive && currentStep === 2 && onStepClick(2)}
                className={cn(
                  "px-4 py-2 rounded-lg flex items-center gap-2 text-[12px] font-semibold transition-all",
                  isActive && currentStep === 2
                    ? "bg-[#0052CC] text-white ring-2 ring-[#0052CC]/30"
                    : "bg-[#0052CC] text-white hover:bg-[#0042AC]"
                )}
              >
                <Plus className="w-4 h-4" />
                创建任务
              </button>
            </div>

            {/* 看板列 */}
            <div className="grid grid-cols-4 gap-4">
              {/* 待办 */}
              <div className="bg-[#F4F5F7] rounded-lg p-3 min-h-[400px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-gray-700">待办</h3>
                  <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full">3</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="text-[11px] font-semibold text-gray-900 mb-1">设计登录页面</div>
                    <div className="text-[10px] text-gray-500">PROJ-123</div>
                  </div>
                </div>
              </div>

              {/* 进行中 */}
              <div className="bg-[#F4F5F7] rounded-lg p-3 min-h-[400px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-gray-700">进行中</h3>
                  <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full">2</span>
                </div>
                <div className="space-y-2">
                  <div
                    id="set-workflow"
                    onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                    className={cn(
                      "bg-white rounded-lg p-3 shadow-sm border-2 transition-all cursor-pointer",
                      isActive && currentStep === 3
                        ? "border-[#0052CC] ring-2 ring-[#0052CC]/20"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="text-[11px] font-semibold text-gray-900 mb-1">实现用户认证</div>
                    <div className="text-[10px] text-gray-500 mb-2">PROJ-124</div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500" />
                      <span className="text-[9px] text-gray-600">分配给</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 代码审查 */}
              <div className="bg-[#F4F5F7] rounded-lg p-3 min-h-[400px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-gray-700">代码审查</h3>
                  <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full">1</span>
                </div>
                <div className="space-y-2">
                  <div
                    id="assign-task"
                    onClick={() => isActive && currentStep === 4 && onStepClick(4)}
                    className={cn(
                      "bg-white rounded-lg p-3 shadow-sm border-2 transition-all cursor-pointer",
                      isActive && currentStep === 4
                        ? "border-[#0052CC] ring-2 ring-[#0052CC]/20"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="text-[11px] font-semibold text-gray-900 mb-1">API 端点开发</div>
                    <div className="text-[10px] text-gray-500 mb-2">PROJ-125</div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500" />
                      <span className="text-[9px] text-gray-600">分配给</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 完成 */}
              <div className="bg-[#F4F5F7] rounded-lg p-3 min-h-[400px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-gray-700">完成</h3>
                  <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full">5</span>
                </div>
                <div className="space-y-2">
                  <div
                    id="track-progress"
                    onClick={() => isActive && currentStep === 5 && onStepClick(5)}
                    className={cn(
                      "bg-white rounded-lg p-3 shadow-sm border-2 transition-all cursor-pointer",
                      isActive && currentStep === 5
                        ? "border-[#0052CC] ring-2 ring-[#0052CC]/20"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="text-[11px] font-semibold text-gray-900 mb-1">数据库设计</div>
                    <div className="text-[10px] text-gray-500">PROJ-120</div>
                    <div className="mt-2 w-full h-1 bg-gray-200 rounded-full">
                      <div className="h-full w-full bg-green-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#0052CC] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
