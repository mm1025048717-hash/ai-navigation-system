"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart3, Database, Filter, Download, Settings, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoTableauProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoTableau = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoTableauProps) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "table">("bar");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dataSource, setDataSource] = useState<"connected" | "disconnected">("disconnected");
  const [chartData, setChartData] = useState([
    { category: "Q1", value: 120 },
    { category: "Q2", value: 150 },
    { category: "Q3", value: 180 },
    { category: "Q4", value: 200 },
  ]);
  
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('连接') || lowerContent.includes('数据源')) return 'connect-source';
        if (lowerContent.includes('字段') || lowerContent.includes('选择')) return 'select-fields';
        if (lowerContent.includes('可视化') || lowerContent.includes('图表')) return 'create-viz';
        if (lowerContent.includes('筛选') || lowerContent.includes('交互')) return 'set-filter';
        if (lowerContent.includes('发布') || lowerContent.includes('仪表板')) return 'publish-dashboard';
      }
    }
    const defaultMap: Record<number, string> = {
      1: 'connect-source',
      2: 'select-fields',
      3: 'create-viz',
      4: 'set-filter',
      5: 'publish-dashboard',
    };
    return defaultMap[step] || null;
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部工具栏 */}
      <div className="h-12 bg-[#E97627] flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-white" />
          <span className="text-[13px] font-bold text-white">Tableau</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-[11px] text-white/90">
          <span className="hover:text-white cursor-pointer">文件</span>
          <span className="hover:text-white cursor-pointer">数据</span>
          <span className="hover:text-white cursor-pointer">工作表</span>
          <span className="hover:text-white cursor-pointer">仪表板</span>
        </div>
        <Settings className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 flex">
        {/* 左侧数据面板 */}
        <div className="w-64 bg-[#F5F5F5] border-r border-gray-200 p-3">
          <h3 className="text-[11px] font-bold text-gray-700 mb-3 uppercase">数据</h3>
          
          {/* 数据源 */}
          <div
            id="connect-source"
            onClick={() => isActive && currentStep === 1 && onStepClick(1)}
            className={cn(
              "p-3 rounded-lg border-2 mb-3 cursor-pointer transition-all",
              isActive && currentStep === 1
                ? "border-[#E97627] ring-2 ring-[#E97627]/20 bg-white"
                : "border-gray-200 hover:border-gray-300 bg-white"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-[#E97627]" />
              <span className="text-[12px] font-semibold text-gray-900">数据源</span>
            </div>
            <div className="text-[10px] text-gray-600">连接到数据...</div>
          </div>

          {/* 字段列表 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">维度</div>
            <div
              id="select-fields"
              onClick={() => isActive && currentStep === 2 && onStepClick(2)}
              className={cn(
                "px-2 py-1.5 rounded cursor-pointer transition-all text-[11px]",
                isActive && currentStep === 2
                  ? "bg-[#E97627]/10 text-[#E97627] ring-1 ring-[#E97627]"
                  : "hover:bg-gray-200 text-gray-700"
              )}
            >
              📅 日期
            </div>
            <div className="px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[11px] text-gray-700">
              🏢 地区
            </div>
            <div className="px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[11px] text-gray-700">
              📦 产品
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">度量</div>
            <div className="px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[11px] text-gray-700">
              💰 销售额
            </div>
            <div className="px-2 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-[11px] text-gray-700">
              📊 数量
            </div>
          </div>
        </div>

        {/* 中间画布区域 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 工作表标签 */}
          <div className="h-10 bg-[#F5F5F5] border-b border-gray-200 flex items-center px-4 gap-2">
            <div className="px-3 py-1 bg-white border border-gray-300 rounded-t text-[11px] font-semibold text-gray-900">
              工作表 1
            </div>
            <div className="px-3 py-1 text-[11px] text-gray-500 hover:text-gray-900 cursor-pointer">
              + 新建工作表
            </div>
          </div>

          {/* 可视化画布 */}
          <div className="flex-1 p-6 bg-[#F5F5F5] relative">
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* 图表区域 */}
              <div
                id="create-viz"
                onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                className={cn(
                  "h-full rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center",
                  isActive && currentStep === 3
                    ? "border-[#E97627] ring-4 ring-[#E97627]/10 bg-[#E97627]/5"
                    : "border-dashed border-gray-300 hover:border-gray-400"
                )}
              >
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-[12px] text-gray-500">拖放字段以创建可视化</p>
                </div>
              </div>

              {/* 模拟图表 */}
              {currentStep >= 3 && (
                <div className="absolute inset-6 flex items-end justify-center gap-4">
                  {[65, 80, 45, 90, 70, 55].map((height, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 rounded-t bg-[#E97627] transition-all"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] text-gray-600">Q{idx + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 底部筛选器 */}
          <div className="h-16 bg-white border-t border-gray-200 px-6 py-3 flex items-center gap-4">
            <div className="text-[11px] font-semibold text-gray-700">筛选器:</div>
            <div
              id="set-filter"
              onClick={() => isActive && currentStep === 4 && onStepClick(4)}
              className={cn(
                "px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-2",
                isActive && currentStep === 4
                  ? "border-[#E97627] ring-2 ring-[#E97627]/20 bg-[#E97627]/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Filter className="w-3 h-3 text-gray-600" />
              <span className="text-[11px] text-gray-700">日期范围</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer flex items-center gap-2">
              <Filter className="w-3 h-3 text-gray-600" />
              <span className="text-[11px] text-gray-700">地区</span>
            </div>
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-64 bg-[#F5F5F5] border-l border-gray-200 p-3">
          <h3 className="text-[11px] font-bold text-gray-700 mb-3 uppercase">标记</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-600 mb-1 block">颜色</label>
              <div className="w-full h-8 rounded border border-gray-300 bg-[#E97627]" />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 mb-1 block">大小</label>
              <input type="range" className="w-full" defaultValue={50} />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 mb-1 block">标签</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-[10px]"
                placeholder="显示标签"
              />
            </div>
          </div>

          {/* 发布按钮 */}
          <button
            id="publish-dashboard"
            onClick={() => isActive && currentStep === 5 && onStepClick(5)}
            className={cn(
              "w-full mt-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all",
              isActive && currentStep === 5
                ? "bg-[#E97627] text-white ring-2 ring-[#E97627]/30"
                : "bg-[#E97627] text-white hover:bg-[#D86617]"
            )}
          >
            <Download className="w-4 h-4" />
            <span className="text-[11px] font-bold">发布到服务器</span>
          </button>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#E97627] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
