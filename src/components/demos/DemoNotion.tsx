"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, Plus, Search, Menu, Database, List, Grid, Calendar, Heading1, List as ListIcon, Image as ImageIcon, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoNotionProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoNotion = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoNotionProps) => {
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('创建') || lowerContent.includes('页面')) return 'create-page';
        if (lowerContent.includes('内容') || lowerContent.includes('块')) return 'add-block';
        if (lowerContent.includes('模板') || lowerContent.includes('设置')) return 'set-template';
        if (lowerContent.includes('结构') || lowerContent.includes('组织')) return 'organize';
        if (lowerContent.includes('分享')) return 'share-page';
      }
    }
    const defaultMap: Record<number, string> = {
      1: 'create-page',
      2: 'add-block',
      3: 'set-template',
      4: 'organize',
      5: 'share-page',
    };
    return defaultMap[step] || null;
  };

  const targetId = getStepTarget(currentStep);
  const [blocks, setBlocks] = useState([
    { id: 1, type: "heading", content: "项目计划", level: 1 },
    { id: 2, type: "text", content: "这是一个重要的项目，需要仔细规划。" },
    { id: 3, type: "list", content: "任务1", items: ["子任务1", "子任务2"] },
  ]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [databaseView, setDatabaseView] = useState<"table" | "board" | "calendar">("table");
  const [databaseRows, setDatabaseRows] = useState([
    { id: 1, name: "任务1", status: "进行中", assignee: "张三", date: "2024-01-15" },
    { id: 2, name: "任务2", status: "待开始", assignee: "李四", date: "2024-01-16" },
    { id: 3, name: "任务3", status: "已完成", assignee: "王五", date: "2024-01-14" },
  ]);

  return (
    <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部工具栏 */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
        <div className="flex items-center gap-2">
          <Menu className="w-4 h-4 text-gray-600" />
          <FileText className="w-5 h-5 text-black" />
          <span className="text-[13px] font-semibold text-gray-900">Notion</span>
        </div>
        <div className="flex-1" />
        <Search className="w-4 h-4 text-gray-400" />
        <div className="w-6 h-6 rounded-full bg-gray-200" />
      </div>

      <div className="flex-1 flex">
        {/* 左侧边栏 */}
        <div className="w-64 bg-[#F7F6F3] border-r border-gray-200 p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[12px] text-gray-700">
              <FileText className="w-4 h-4" />
              <span>快速笔记</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[12px] text-gray-700">
              <Database className="w-4 h-4" />
              <span>数据库</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[12px] text-gray-700">
              <List className="w-4 h-4" />
              <span>任务</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[12px] text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>日历</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">最近</div>
            <div className="space-y-1">
              <div className="px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[11px] text-gray-700">
                项目计划
              </div>
              <div className="px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[11px] text-gray-700">
                会议记录
              </div>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 页面标题栏 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <button
                id="create-page"
                onClick={() => isActive && currentStep === 1 && onStepClick(1)}
                className={cn(
                  "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
                  isActive && currentStep === 1
                    ? "bg-black text-white ring-2 ring-black/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <Plus className="w-4 h-4" />
                <span className="text-[12px] font-semibold">新页面</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">未命名页面</h1>
          </div>

          {/* 编辑器区域 */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* 内容块 */}
              <div
                id="add-block"
                onClick={() => isActive && currentStep === 2 && onStepClick(2)}
                className={cn(
                  "min-h-[60px] p-4 rounded-lg border-2 transition-all cursor-text",
                  isActive && currentStep === 2
                    ? "border-black ring-2 ring-black/10"
                    : "border-transparent hover:border-gray-200"
                )}
              >
                <p className="text-gray-400 text-[14px]">点击开始输入...</p>
              </div>

              {/* 模板选择 */}
              <div
                id="set-template"
                onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all cursor-pointer",
                  isActive && currentStep === 3
                    ? "border-black ring-2 ring-black/10 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">选择模板</p>
                    <p className="text-[11px] text-gray-500">项目计划、会议记录、待办事项...</p>
                  </div>
                </div>
              </div>

              {/* 组织结构 */}
              <div
                id="organize"
                onClick={() => isActive && currentStep === 4 && onStepClick(4)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  isActive && currentStep === 4
                    ? "border-black ring-2 ring-black/10"
                    : "border-transparent"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-gray-700">
                    <div className="w-1 h-4 bg-gray-300 rounded" />
                    <span>子页面 1</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-700 ml-4">
                    <div className="w-1 h-4 bg-gray-300 rounded" />
                    <span>子页面 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部工具栏 */}
          <div className="h-12 border-t border-gray-200 flex items-center px-6 gap-4">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span>字数: 0</span>
              <span>•</span>
              <span>最后编辑: 刚刚</span>
            </div>
            <div className="flex-1" />
            <button
              id="share-page"
              onClick={() => isActive && currentStep === 5 && onStepClick(5)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all",
                isActive && currentStep === 5
                  ? "bg-black text-white ring-2 ring-black/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              分享
            </button>
          </div>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
