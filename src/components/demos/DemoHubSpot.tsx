"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, Target, Mail, BarChart3, Users, Settings, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoHubSpotProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoHubSpot = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoHubSpotProps) => {
  const [contacts, setContacts] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", company: "Acme Corp", status: "客户", value: "$50,000" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", company: "TechStart", status: "潜在客户", value: "$30,000" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", company: "Global Inc", status: "线索", value: "$0" },
  ]);
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "春季促销", status: "进行中", opens: 1200, clicks: 340, conversions: 45 },
    { id: 2, name: "产品发布", status: "已完成", opens: 2500, clicks: 680, conversions: 120 },
  ]);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", type: "email" });
  const [viewMode, setViewMode] = useState<"contacts" | "campaigns" | "analytics">("contacts");
  
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('创建') || lowerContent.includes('活动')) return 'create-campaign';
        if (lowerContent.includes('工作流') || lowerContent.includes('设置')) return 'set-workflow';
        if (lowerContent.includes('邮件') || lowerContent.includes('模板')) return 'design-email';
        if (lowerContent.includes('自动化') || lowerContent.includes('配置')) return 'configure-auto';
        if (lowerContent.includes('分析') || lowerContent.includes('效果')) return 'analyze-results';
      }
    }
    const defaultMap: Record<number, string> = {
      1: 'create-campaign',
      2: 'set-workflow',
      3: 'design-email',
      4: 'configure-auto',
      5: 'analyze-results',
    };
    return defaultMap[step] || null;
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部导航栏 */}
      <div className="h-12 bg-[#FF7A59] flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-white" />
          <span className="text-[13px] font-bold text-white">HubSpot</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-[11px] text-white/90">
          <span className="hover:text-white cursor-pointer">营销</span>
          <span className="hover:text-white cursor-pointer">销售</span>
          <span className="hover:text-white cursor-pointer">服务</span>
          <span className="hover:text-white cursor-pointer">报表</span>
        </div>
        <Settings className="w-4 h-4 text-white" />
        <div className="w-6 h-6 rounded-full bg-white/20" />
      </div>

      <div className="flex-1 flex">
        {/* 左侧导航 */}
        <div className="w-64 bg-[#F8F9FA] border-r border-gray-200 p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-[12px] font-semibold text-gray-900 shadow-sm">
              <Target className="w-4 h-4 text-[#FF7A59]" />
              <span>营销</span>
            </div>
            <div
              id="create-campaign"
              onClick={() => isActive && currentStep === 1 && onStepClick(1)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-[12px] text-gray-700",
                isActive && currentStep === 1
                  ? "bg-[#FF7A59]/10 text-[#FF7A59] ring-2 ring-[#FF7A59]/20"
                  : "hover:bg-white"
              )}
            >
              <Target className="w-4 h-4" />
              <span>营销活动</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white cursor-pointer text-[12px] text-gray-700">
              <Mail className="w-4 h-4" />
              <span>邮件</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white cursor-pointer text-[12px] text-gray-700">
              <Users className="w-4 h-4" />
              <span>联系人</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white cursor-pointer text-[12px] text-gray-700">
              <BarChart3 className="w-4 h-4" />
              <span>分析</span>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 页面标题 */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">营销活动</h1>
              <button className="px-4 py-2 rounded-lg bg-[#FF7A59] text-white text-[12px] font-semibold hover:bg-[#E66A49]">
                新建活动
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 活动卡片 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                id="set-workflow"
                onClick={() => isActive && currentStep === 2 && onStepClick(2)}
                className={cn(
                  "bg-white rounded-lg border-2 p-4 cursor-pointer transition-all",
                  isActive && currentStep === 2
                    ? "border-[#FF7A59] ring-2 ring-[#FF7A59]/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[#FF7A59]" />
                  <h3 className="text-[13px] font-bold text-gray-900">春季促销活动</h3>
                </div>
                <p className="text-[11px] text-gray-600 mb-3">目标受众: 1000 联系人</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-full w-3/4 bg-[#FF7A59] rounded-full" />
                  </div>
                  <span className="text-[10px] text-gray-600">75%</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-gray-400" />
                  <h3 className="text-[13px] font-bold text-gray-900">产品发布</h3>
                </div>
                <p className="text-[11px] text-gray-600 mb-3">目标受众: 500 联系人</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-full w-1/2 bg-gray-400 rounded-full" />
                  </div>
                  <span className="text-[10px] text-gray-600">50%</span>
                </div>
              </div>
            </div>

            {/* 邮件模板 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="text-[13px] font-bold text-gray-900 mb-3">邮件模板</h3>
              <div
                id="design-email"
                onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                className={cn(
                  "p-6 rounded-lg border-2 transition-all cursor-pointer",
                  isActive && currentStep === 3
                    ? "border-[#FF7A59] ring-2 ring-[#FF7A59]/20 bg-[#FF7A59]/5"
                    : "border-dashed border-gray-300 hover:border-gray-400"
                )}
              >
                <div className="text-center">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-[12px] text-gray-500">设计邮件模板</p>
                </div>
              </div>
            </div>

            {/* 自动化配置 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="text-[13px] font-bold text-gray-900 mb-3">自动化工作流</h3>
              <div
                id="configure-auto"
                onClick={() => isActive && currentStep === 4 && onStepClick(4)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all cursor-pointer",
                  isActive && currentStep === 4
                    ? "border-[#FF7A59] ring-2 ring-[#FF7A59]/20 bg-[#FF7A59]/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF7A59]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#FF7A59]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-gray-900">线索评分自动化</p>
                    <p className="text-[10px] text-gray-600">根据行为自动评分</p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold">
                    已启用
                  </div>
                </div>
              </div>
            </div>

            {/* 分析结果 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-gray-900">活动效果</h3>
                <button
                  id="analyze-results"
                  onClick={() => isActive && currentStep === 5 && onStepClick(5)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                    isActive && currentStep === 5
                      ? "bg-[#FF7A59] text-white ring-2 ring-[#FF7A59]/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  查看详细分析
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">打开率</div>
                  <div className="text-xl font-bold text-gray-900">24.5%</div>
                </div>
                <div className="p-3 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">点击率</div>
                  <div className="text-xl font-bold text-gray-900">8.2%</div>
                </div>
                <div className="p-3 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">转化率</div>
                  <div className="text-xl font-bold text-green-600">3.1%</div>
                </div>
                <div className="p-3 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">新线索</div>
                  <div className="text-xl font-bold text-gray-900">127</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#FF7A59] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
