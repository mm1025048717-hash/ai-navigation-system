"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Layers, Brush, Eraser, Crop, Filter, Save, Eye, EyeOff, Move, Rectangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoPhotoshopProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoPhotoshop = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoPhotoshopProps) => {
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('打开') || lowerContent.includes('文件')) return 'open-file';
        if (lowerContent.includes('工具') || lowerContent.includes('选择')) return 'select-tool';
        if (lowerContent.includes('调整') || lowerContent.includes('参数')) return 'adjust-params';
        if (lowerContent.includes('图层') || lowerContent.includes('效果')) return 'apply-effect';
        if (lowerContent.includes('保存') || lowerContent.includes('导出')) return 'save-file';
      }
    }
    const defaultMap: Record<number, string> = {
      1: 'open-file',
      2: 'select-tool',
      3: 'adjust-params',
      4: 'apply-effect',
      5: 'save-file',
    };
    return defaultMap[step] || null;
  };

  const targetId = getStepTarget(currentStep);
  const [selectedTool, setSelectedTool] = useState<string>("brush");
  const [layers, setLayers] = useState([
    { id: 1, name: "背景", visible: true, opacity: 100, locked: false },
    { id: 2, name: "图层 1", visible: true, opacity: 100, locked: false },
    { id: 3, name: "文字", visible: true, opacity: 100, locked: false },
  ]);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(2);
  const [brushSize, setBrushSize] = useState(20);
  const [brushOpacity, setBrushOpacity] = useState(100);

  return (
    <div className="h-full bg-[#2C2C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部菜单栏 */}
      <div className="h-10 bg-[#1E1E1E] flex items-center px-4 gap-4 border-b border-[#3A3A3A]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#31A8FF]" />
          <span className="text-[12px] font-semibold text-white">Adobe Photoshop</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span>文件</span>
          <span>编辑</span>
          <span>图像</span>
          <span>图层</span>
          <span>选择</span>
          <span>滤镜</span>
          <span>视图</span>
          <span>窗口</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 左侧工具栏 */}
        <div className="w-16 bg-[#252525] border-r border-[#3A3A3A] p-2 flex flex-col gap-2">
          <div
            id="select-tool"
            onClick={() => isActive && currentStep === 2 && onStepClick(2)}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all",
              isActive && currentStep === 2
                ? "bg-[#31A8FF]/20 ring-2 ring-[#31A8FF]"
                : "hover:bg-[#1E1E1E]"
            )}
          >
            <Brush className="w-5 h-5 text-[#31A8FF]" />
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-[#1E1E1E] cursor-pointer">
            <Eraser className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-[#1E1E1E] cursor-pointer">
            <Crop className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-[#1E1E1E] cursor-pointer">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* 中间画布区域 */}
        <div className="flex-1 flex flex-col">
          {/* 画布 */}
          <div className="flex-1 bg-[#1A1A1A] relative flex items-center justify-center p-8">
            <div
              id="open-file"
              onClick={() => isActive && currentStep === 1 && onStepClick(1)}
              className={cn(
                "w-full h-full bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden",
                isActive && currentStep === 1
                  ? "border-[#31A8FF] ring-4 ring-[#31A8FF]/20"
                  : "border-[#3A3A3A]"
              )}
            >
              {/* 模拟图像内容 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Layers className="w-16 h-16 text-white/20 mx-auto mb-2" />
                  <p className="text-[12px] text-gray-500">图像画布</p>
                  <p className="text-[10px] text-gray-600 mt-1">1920 x 1080 px</p>
                </div>
              </div>
              
              {/* 图层预览 */}
              <div className="absolute top-4 left-4 w-32 h-20 bg-white/10 rounded border border-white/20 backdrop-blur-sm">
                <div className="p-2">
                  <div className="w-full h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* 底部状态栏 */}
          <div className="h-8 bg-[#1E1E1E] border-t border-[#3A3A3A] flex items-center px-4 text-[10px] text-gray-400">
            <span>100%</span>
            <div className="flex-1" />
            <span>文档: 2.5 MB</span>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="w-64 bg-[#252525] border-l border-[#3A3A3A] flex flex-col">
          {/* 图层面板 */}
          <div className="p-3 border-b border-[#3A3A3A] flex-1">
            <h3 className="text-[11px] font-bold text-gray-300 mb-2 uppercase">图层</h3>
            <div className="space-y-1">
              <div
                id="apply-effect"
                onClick={() => isActive && currentStep === 4 && onStepClick(4)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all",
                  isActive && currentStep === 4
                    ? "bg-[#31A8FF]/20 ring-2 ring-[#31A8FF]"
                    : "hover:bg-[#1E1E1E]"
                )}
              >
                <Eye className="w-3 h-3 text-[#31A8FF]" />
                <span className="text-[10px] text-white">图层 1</span>
                <div className="flex-1" />
                <Filter className="w-3 h-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#1E1E1E] text-[10px] text-gray-400">
                <EyeOff className="w-3 h-3" />
                <span>背景</span>
              </div>
            </div>
          </div>

          {/* 属性面板 */}
          <div className="p-3 border-t border-[#3A3A3A]">
            <h3 className="text-[11px] font-bold text-gray-300 mb-3 uppercase">属性</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">不透明度</label>
                <input
                  id="adjust-params"
                  onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                  type="range"
                  className={cn(
                    "w-full cursor-pointer",
                    isActive && currentStep === 3 && "ring-2 ring-[#31A8FF] rounded"
                  )}
                  defaultValue={100}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">填充</label>
                <input
                  type="range"
                  className="w-full"
                  defaultValue={100}
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-[#1E1E1E] rounded text-[10px] text-gray-400 hover:bg-[#2C2C2C]">
                  颜色
                </button>
                <button className="flex-1 py-1.5 bg-[#1E1E1E] rounded text-[10px] text-gray-400 hover:bg-[#2C2C2C]">
                  渐变
                </button>
              </div>
            </div>

            {/* 保存按钮 */}
            <button
              id="save-file"
              onClick={() => isActive && currentStep === 5 && onStepClick(5)}
              className={cn(
                "w-full mt-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all",
                isActive && currentStep === 5
                  ? "bg-[#31A8FF] text-white ring-2 ring-[#31A8FF]/50"
                  : "bg-[#1E1E1E] text-gray-400 hover:bg-[#2C2C2C]"
              )}
            >
              <Save className="w-4 h-4" />
              <span className="text-[11px] font-bold">保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#31A8FF] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
