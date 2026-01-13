"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Hash, Plus, Search, Bell, AtSign, Paperclip, Smile, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoSlackProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoSlack = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoSlackProps) => {
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState([
    { id: 1, user: "Alice", text: "大家好！今天有什么新进展吗？", time: "10:30", thread: false },
    { id: 2, user: "Bob", text: "我刚完成了登录页面的设计", time: "10:32", thread: false },
    { id: 3, user: "Charlie", text: "太好了！可以分享一下吗？", time: "10:35", thread: true, threadId: 2 },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showThread, setShowThread] = useState<number | null>(null);
  const [channels, setChannels] = useState([
    { id: "general", name: "general", unread: 0 },
    { id: "random", name: "random", unread: 2 },
    { id: "dev-team", name: "dev-team", unread: 0 },
  ]);
  
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('创建') || lowerContent.includes('频道')) return 'create-channel';
        if (lowerContent.includes('邀请') || lowerContent.includes('成员')) return 'invite-member';
        if (lowerContent.includes('发送') || lowerContent.includes('消息')) return 'send-message';
        if (lowerContent.includes('集成') || lowerContent.includes('设置')) return 'set-integration';
        if (lowerContent.includes('通知') || lowerContent.includes('管理')) return 'manage-notification';
      }
    }
    const defaultMap: Record<number, string> = {
      1: 'create-channel',
      2: 'invite-member',
      3: 'send-message',
      4: 'set-integration',
      5: 'manage-notification',
    };
    return defaultMap[step] || null;
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部导航栏 */}
      <div className="h-12 bg-[#4A154B] flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-white" />
          <span className="text-[13px] font-bold text-white">Slack</span>
        </div>
        <div className="flex-1" />
        <Search className="w-4 h-4 text-white" />
        <Bell className="w-4 h-4 text-white" />
        <div className="w-6 h-6 rounded-full bg-white/20" />
      </div>

      <div className="flex-1 flex">
        {/* 左侧边栏 */}
        <div className="w-64 bg-[#350D36] text-white flex flex-col">
          {/* 工作区选择 */}
          <div className="p-3 border-b border-[#4A154B]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded bg-[#611F69] flex items-center justify-center text-[12px] font-bold">
                W
              </div>
              <span className="text-[12px] font-semibold">工作区</span>
            </div>
          </div>

          {/* 频道列表 */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1 px-2">
                <span className="text-[10px] font-bold text-[#AB9BA9] uppercase">频道</span>
                <button
                  id="create-channel"
                  onClick={() => isActive && currentStep === 1 && onStepClick(1)}
                  className={cn(
                    "w-4 h-4 rounded flex items-center justify-center transition-all",
                    isActive && currentStep === 1
                      ? "bg-white/20 ring-2 ring-white/30"
                      : "hover:bg-white/10"
                  )}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-0.5">
                <div className="px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer text-[12px] flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  <span>general</span>
                </div>
                <div className="px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer text-[12px] flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  <span>random</span>
                </div>
                <div
                  id="invite-member"
                  onClick={() => isActive && currentStep === 2 && onStepClick(2)}
                  className={cn(
                    "px-2 py-1.5 rounded cursor-pointer text-[12px] flex items-center gap-2 transition-all",
                    isActive && currentStep === 2
                      ? "bg-white/20 ring-2 ring-white/30"
                      : "hover:bg-white/10"
                  )}
                >
                  <Hash className="w-3 h-3" />
                  <span>项目讨论</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="px-2 mb-1">
                <span className="text-[10px] font-bold text-[#AB9BA9] uppercase">私信</span>
              </div>
              <div className="space-y-0.5">
                <div className="px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer text-[12px] flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span>John Doe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 中间聊天区域 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 频道头部 */}
          <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
            <Hash className="w-5 h-5 text-gray-600" />
            <div>
              <h2 className="text-[13px] font-bold text-gray-900">项目讨论</h2>
              <p className="text-[10px] text-gray-500">5 名成员</p>
            </div>
            <div className="flex-1" />
            <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-[11px] font-semibold text-gray-700 hover:bg-gray-200">
              成员
            </button>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8F8F8]">
            <div className="space-y-4">
              {[
                { user: "Alice", time: "10:30", message: "大家好！项目进展如何？" },
                { user: "Bob", time: "10:32", message: "前端部分已经完成了" },
              ].map((msg, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {msg.user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-bold text-gray-900">{msg.user}</span>
                      <span className="text-[10px] text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-[13px] text-gray-700">{msg.message}</p>
                  </div>
                </div>
              ))}

              {/* 新消息输入区域 */}
              <div
                id="send-message"
                onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                className={cn(
                  "mt-4 p-3 rounded-lg border-2 transition-all cursor-text",
                  isActive && currentStep === 3
                    ? "border-[#4A154B] ring-2 ring-[#4A154B]/20 bg-white"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
              >
                <p className="text-[13px] text-gray-400">输入消息...</p>
              </div>
            </div>
          </div>

          {/* 输入框 */}
          <div className="h-16 border-t border-gray-200 px-4 flex items-center gap-2 bg-white">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Paperclip className="w-4 h-4 text-gray-400" />
            </button>
            <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="输入消息..."
                className="flex-1 bg-transparent text-[12px] text-gray-900 outline-none"
              />
              <Smile className="w-4 h-4 text-gray-400" />
            </div>
            <button
              id="set-integration"
              onClick={() => isActive && currentStep === 4 && onStepClick(4)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                isActive && currentStep === 4
                  ? "bg-[#4A154B] text-white ring-2 ring-[#4A154B]/30"
                  : "bg-[#4A154B] text-white hover:bg-[#3A0D3B]"
              )}
            >
              集成
            </button>
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div className="w-64 bg-white border-l border-gray-200 p-3">
          <h3 className="text-[11px] font-bold text-gray-900 mb-3">频道信息</h3>
          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-gray-500 mb-1">成员 (5)</div>
              <div className="space-y-1">
                {["Alice", "Bob", "Charlie", "Diana"].map((name, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-[9px] font-bold">
                      {name[0]}
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <button
                id="manage-notification"
                onClick={() => isActive && currentStep === 5 && onStepClick(5)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-[11px] font-semibold transition-all",
                  isActive && currentStep === 5
                    ? "bg-[#4A154B] text-white ring-2 ring-[#4A154B]/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                通知设置
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#4A154B] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
