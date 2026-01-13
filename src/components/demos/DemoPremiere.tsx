"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Play, Pause, Scissors, Film, Volume2, Settings, Download, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoPremiereProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoPremiere = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoPremiereProps) => {
  // 动态步骤映射
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('导入') || lowerContent.includes('素材')) return 'import-media';
        if (lowerContent.includes('序列') || lowerContent.includes('时间轴')) return 'create-sequence';
        if (lowerContent.includes('剪辑') || lowerContent.includes('片段')) return 'edit-clip';
        if (lowerContent.includes('音频') || lowerContent.includes('轨道')) return 'add-audio';
        if (lowerContent.includes('导出') || lowerContent.includes('渲染')) return 'export-video';
      }
    }
    // 默认映射
    const defaultMap: Record<number, string> = {
      1: 'import-media',
      2: 'create-sequence',
      3: 'edit-clip',
      4: 'add-audio',
      5: 'export-video',
    };
    return defaultMap[step] || null;
  };

  const targetId = getStepTarget(currentStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 总时长 120 秒
  const [clips, setClips] = useState([
    { id: 1, name: "视频片段1.mp4", start: 0, end: 30, color: "#EA77FF" },
    { id: 2, name: "视频片段2.mp4", start: 30, end: 60, color: "#31A8FF" },
    { id: 3, name: "音频轨道.wav", start: 0, end: 120, color: "#34C759", isAudio: true },
  ]);
  const [selectedClip, setSelectedClip] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  return (
    <div className="h-full bg-[#2C2C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部菜单栏 */}
      <div className="h-10 bg-[#1E1E1E] flex items-center px-4 gap-4 border-b border-[#3A3A3A]">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-[#EA77FF]" />
          <span className="text-[12px] font-semibold text-white">Premiere Pro</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            文件
          </span>
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            编辑
          </span>
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            剪辑
          </span>
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            序列
          </span>
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            标记
          </span>
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            图形
          </span>
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            视图
          </span>
          <span 
            onClick={() => {
              // 菜单点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all px-2 py-1 rounded"
          >
            窗口
          </span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 左侧面板 */}
        <div className="w-64 bg-[#252525] border-r border-[#3A3A3A] flex flex-col">
          {/* 项目面板 */}
          <div className="p-3 border-b border-[#3A3A3A]">
            <h3 className="text-[11px] font-bold text-gray-300 mb-2 uppercase">项目</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#1E1E1E] text-[10px] text-gray-400">
                <Film className="w-3 h-3" />
                <span>序列 01</span>
              </div>
              <div
                id="import-media"
                onClick={() => isActive && currentStep === 1 && onStepClick(1)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all",
                  isActive && currentStep === 1
                    ? "bg-[#EA77FF]/20 ring-2 ring-[#EA77FF]"
                    : "hover:bg-[#1E1E1E]"
                )}
              >
                <Film className="w-3 h-3 text-[#EA77FF]" />
                <span className="text-[10px] text-white">视频素材.mp4</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#1E1E1E] text-[10px] text-gray-400">
                <Volume2 className="w-3 h-3" />
                <span>背景音乐.mp3</span>
              </div>
            </div>
          </div>

          {/* 效果面板 */}
          <div className="p-3 flex-1">
            <h3 className="text-[11px] font-bold text-gray-300 mb-2 uppercase">效果</h3>
            <div className="space-y-1">
              <div className="px-2 py-1.5 rounded hover:bg-[#1E1E1E] text-[10px] text-gray-400">
                视频过渡
              </div>
              <div className="px-2 py-1.5 rounded hover:bg-[#1E1E1E] text-[10px] text-gray-400">
                颜色校正
              </div>
              <div className="px-2 py-1.5 rounded hover:bg-[#1E1E1E] text-[10px] text-gray-400">
                音频效果
              </div>
            </div>
          </div>
        </div>

        {/* 中间时间轴区域 */}
        <div className="flex-1 flex flex-col">
          {/* 预览窗口 */}
          <div className="flex-1 bg-black relative flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-black flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-white/20 mx-auto mb-2" />
                <p className="text-[12px] text-gray-500">节目监视器</p>
              </div>
            </div>
            {/* 播放控制 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-[#1E1E1E]/90 rounded-lg px-4 py-2">
              <Pause className="w-4 h-4 text-white" />
              <div className="w-64 h-1 bg-[#3A3A3A] rounded-full">
                <div className="w-1/3 h-full bg-[#EA77FF] rounded-full" />
              </div>
              <span className="text-[10px] text-gray-400">00:01:23 / 00:05:45</span>
            </div>
          </div>

          {/* 时间轴 */}
          <div className="h-48 bg-[#1E1E1E] border-t border-[#3A3A3A] p-3">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-4 h-4 text-[#EA77FF]" />
              <span className="text-[11px] font-bold text-white">时间轴</span>
            </div>
            
            <div className="space-y-2">
              {/* 视频轨道 */}
              <div className="relative">
                <div className="text-[10px] text-gray-400 mb-1">V1</div>
                <div
                  id="create-sequence"
                  onClick={() => isActive && currentStep === 2 && onStepClick(2)}
                  className={cn(
                    "h-12 rounded bg-[#2C2C2C] border-2 transition-all cursor-pointer",
                    isActive && currentStep === 2
                      ? "border-[#EA77FF] ring-2 ring-[#EA77FF]/30"
                      : "border-[#3A3A3A]"
                  )}
                >
                  <div className="h-full flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-[#EA77FF] mr-2" />
                    <span className="text-[10px] text-white">视频素材.mp4</span>
                  </div>
                </div>
              </div>

              {/* 剪辑片段 */}
              <div className="relative">
                <div className="text-[10px] text-gray-400 mb-1">V2</div>
                <div
                  id="edit-clip"
                  onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                  className={cn(
                    "h-12 rounded bg-[#2C2C2C] border-2 transition-all cursor-pointer",
                    isActive && currentStep === 3
                      ? "border-[#EA77FF] ring-2 ring-[#EA77FF]/30"
                      : "border-[#3A3A3A]"
                  )}
                >
                  <div className="h-full flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-[#EA77FF] mr-2" />
                    <span className="text-[10px] text-white">剪辑片段</span>
                  </div>
                </div>
              </div>

              {/* 音频轨道 */}
              <div className="relative">
                <div className="text-[10px] text-gray-400 mb-1">A1</div>
                <div
                  id="add-audio"
                  onClick={() => isActive && currentStep === 4 && onStepClick(4)}
                  className={cn(
                    "h-12 rounded bg-[#2C2C2C] border-2 transition-all cursor-pointer",
                    isActive && currentStep === 4
                      ? "border-[#EA77FF] ring-2 ring-[#EA77FF]/30"
                      : "border-[#3A3A3A]"
                  )}
                >
                  <div className="h-full flex items-center px-2">
                    <Volume2 className="w-3 h-3 text-[#EA77FF] mr-2" />
                    <div className="flex-1 h-4 bg-[#3A3A3A] rounded">
                      <div className="h-full w-3/4 bg-[#EA77FF] rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-64 bg-[#252525] border-l border-[#3A3A3A] p-3">
          <h3 className="text-[11px] font-bold text-gray-300 mb-3 uppercase">效果控件</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-400 mb-1 block">不透明度</label>
              <input
                type="range"
                className="w-full"
                defaultValue={100}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 mb-1 block">缩放</label>
              <input
                type="range"
                className="w-full"
                defaultValue={100}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 mb-1 block">位置 X</label>
              <input
                type="number"
                className="w-full bg-[#1E1E1E] border border-[#3A3A3A] rounded px-2 py-1 text-[10px] text-white"
                defaultValue={960}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 mb-1 block">位置 Y</label>
              <input
                type="number"
                className="w-full bg-[#1E1E1E] border border-[#3A3A3A] rounded px-2 py-1 text-[10px] text-white"
                defaultValue={540}
              />
            </div>
          </div>

          {/* 导出按钮 */}
          <button
            id="export-video"
            onClick={() => isActive && currentStep === 5 && onStepClick(5)}
            className={cn(
              "w-full mt-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all",
              isActive && currentStep === 5
                ? "bg-[#EA77FF] text-white ring-2 ring-[#EA77FF]/50"
                : "bg-[#1E1E1E] text-gray-400 hover:bg-[#2C2C2C]"
            )}
          >
            <Download className="w-4 h-4" />
            <span className="text-[11px] font-bold">导出媒体</span>
          </button>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#EA77FF] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
