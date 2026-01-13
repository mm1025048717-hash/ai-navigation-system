"use client";

import { motion } from "framer-motion";
import { Target, Users, TrendingUp, FileText, Settings, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoSalesforceProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoSalesforce = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoSalesforceProps) => {
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length && step > 0) {
      const stepContent = generatedSteps[step - 1];
      if (stepContent && typeof stepContent === 'string') {
        const lowerContent = stepContent.toLowerCase();
        if (lowerContent.includes('登录') || lowerContent.includes('系统')) return 'login';
        if (lowerContent.includes('客户') || lowerContent.includes('列表')) return 'view-customers';
        if (lowerContent.includes('销售') || lowerContent.includes('机会')) return 'create-opportunity';
        if (lowerContent.includes('更新') || lowerContent.includes('信息')) return 'update-info';
        if (lowerContent.includes('报告') || lowerContent.includes('生成')) return 'generate-report';
      }
    }
    const defaultMap: Record<number, string> = {
      1: 'login',
      2: 'view-customers',
      3: 'create-opportunity',
      4: 'update-info',
      5: 'generate-report',
    };
    return defaultMap[step] || null;
  };

  return (
    <div className="h-full bg-[#F3F2F2] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部导航栏 */}
      <div className="h-12 bg-[#1798C1] flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-white" />
          <span className="text-[13px] font-bold text-white">Salesforce</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-[11px] text-white/90">
          <span 
            onClick={() => {
              // 导航点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all"
          >
            首页
          </span>
          <span 
            onClick={() => {
              // 导航点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all"
          >
            客户
          </span>
          <span 
            onClick={() => {
              // 导航点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all"
          >
            销售
          </span>
          <span 
            onClick={() => {
              // 导航点击
            }}
            className="hover:text-white active:opacity-70 cursor-pointer transition-all"
          >
            报表
          </span>
        </div>
        <button 
          onClick={() => {
            // 搜索功能
          }}
          className="p-1.5 hover:bg-white/10 rounded transition-all active:scale-95"
        >
          <Search className="w-4 h-4 text-white" />
        </button>
        <button 
          onClick={() => {
            // 通知功能
          }}
          className="p-1.5 hover:bg-white/10 rounded transition-all active:scale-95 relative"
        >
          <Bell className="w-4 h-4 text-white" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div 
          onClick={() => {
            // 用户菜单
          }}
          className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-all active:scale-95"
        />
      </div>

      <div className="flex-1 flex">
        {/* 左侧导航 */}
        <div className="w-56 bg-white border-r border-gray-200 p-3">
          <div className="space-y-1">
            <div 
              onClick={() => {
                // 导航点击
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F3F2F2] text-[12px] font-semibold text-gray-900 cursor-pointer active:scale-[0.98] transition-all"
            >
              <Target className="w-4 h-4 text-[#1798C1]" />
              <span>首页</span>
            </div>
            <div
              id="view-customers"
              onClick={() => {
                if (isActive && currentStep === 2) {
                  onStepClick(2);
                }
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-[12px] text-gray-700 active:scale-[0.98]",
                isActive && currentStep === 2
                  ? "bg-[#1798C1]/10 text-[#1798C1] ring-2 ring-[#1798C1]/20 animate-pulse"
                  : "hover:bg-gray-100"
              )}
            >
              <Users className="w-4 h-4" />
              <span>客户</span>
            </div>
            <div 
              onClick={() => {
                // 导航点击
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] cursor-pointer text-[12px] text-gray-700 transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>销售机会</span>
            </div>
            <div 
              onClick={() => {
                // 导航点击
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] cursor-pointer text-[12px] text-gray-700 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>报表</span>
            </div>
            <div 
              onClick={() => {
                // 导航点击
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] cursor-pointer text-[12px] text-gray-700 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>设置</span>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col bg-[#F3F2F2]">
          {/* 页面标题 */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">客户</h1>
              <button
                id="create-opportunity"
                onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[12px] font-semibold transition-all",
                  isActive && currentStep === 3
                    ? "bg-[#1798C1] text-white ring-2 ring-[#1798C1]/30"
                    : "bg-[#1798C1] text-white hover:bg-[#1588B1]"
                )}
              >
                新建销售机会
              </button>
            </div>
          </div>

          {/* 客户列表 */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* 列表头部 */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-4 text-[11px] font-semibold text-gray-600">
                <div className="w-8">选择</div>
                <div className="flex-1">客户名称</div>
                <div className="w-32">行业</div>
                <div className="w-32">状态</div>
                <div className="w-24">操作</div>
              </div>

              {/* 客户行 */}
              {[
                { name: "Acme Corp", industry: "科技", status: "活跃" },
                { name: "TechStart Inc", industry: "软件", status: "潜在" },
                { name: "Global Solutions", industry: "咨询", status: "活跃" },
              ].map((customer, idx) => (
                <div
                  key={idx}
                  id={idx === 0 ? "update-info" : undefined}
                  onClick={() => idx === 0 && isActive && currentStep === 4 && onStepClick(4)}
                  className={cn(
                    "px-4 py-3 border-b border-gray-100 flex items-center gap-4 text-[12px] transition-all",
                    idx === 0 && isActive && currentStep === 4
                      ? "bg-[#1798C1]/5 ring-2 ring-[#1798C1]/20 cursor-pointer"
                      : "hover:bg-gray-50"
                  )}
                >
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="flex-1 font-medium text-gray-900">{customer.name}</div>
                  <div className="w-32 text-gray-600">{customer.industry}</div>
                  <div className="w-32">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                      {customer.status}
                    </span>
                  </div>
                  <div className="w-24">
                    <button className="text-[#1798C1] text-[11px] font-semibold hover:underline">
                      查看
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 报表区域 */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-gray-900">销售报表</h3>
                <button
                  id="generate-report"
                  onClick={() => isActive && currentStep === 5 && onStepClick(5)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                    isActive && currentStep === 5
                      ? "bg-[#1798C1] text-white ring-2 ring-[#1798C1]/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  生成报表
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-[#F3F2F2] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">本月销售额</div>
                  <div className="text-xl font-bold text-gray-900">$125,000</div>
                </div>
                <div className="p-3 bg-[#F3F2F2] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">活跃客户</div>
                  <div className="text-xl font-bold text-gray-900">42</div>
                </div>
                <div className="p-3 bg-[#F3F2F2] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">转化率</div>
                  <div className="text-xl font-bold text-gray-900">68%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#1798C1] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
