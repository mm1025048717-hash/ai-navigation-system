"use client";

import { motion } from "framer-motion";
import { Database, FileText, CheckCircle2, TrendingUp, Settings, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoSAPProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoSAP = ({
  currentStep,
  isActive,
  onStepClick,
  taskType,
  taskId,
  generatedSteps = [],
  totalSteps = 5,
}: DemoSAPProps) => {
  const getStepTarget = (step: number): string | null => {
    if (generatedSteps.length > 0 && step <= generatedSteps.length) {
      const stepContent = generatedSteps[step - 1].toLowerCase();
      if (stepContent.includes('登录') || stepContent.includes('系统')) return 'login';
      if (stepContent.includes('模块') || stepContent.includes('访问')) return 'access-module';
      if (stepContent.includes('单据') || stepContent.includes('创建')) return 'create-document';
      if (stepContent.includes('审核') || stepContent.includes('流程')) return 'review-process';
      if (stepContent.includes('报表') || stepContent.includes('生成')) return 'generate-report';
    }
    const defaultMap: Record<number, string> = {
      1: 'login',
      2: 'access-module',
      3: 'create-document',
      4: 'review-process',
      5: 'generate-report',
    };
    return defaultMap[step] || null;
  };

  return (
    <div className="h-full bg-[#F5F5F5] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* 顶部导航栏 */}
      <div className="h-12 bg-[#0070F2] flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-white" />
          <span className="text-[13px] font-bold text-white">SAP ERP</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-[11px] text-white/90">
          <span className="hover:text-white cursor-pointer">财务</span>
          <span className="hover:text-white cursor-pointer">销售</span>
          <span className="hover:text-white cursor-pointer">采购</span>
          <span className="hover:text-white cursor-pointer">库存</span>
        </div>
        <Search className="w-4 h-4 text-white" />
        <Settings className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 flex">
        {/* 左侧菜单 */}
        <div className="w-64 bg-white border-r border-gray-200 p-3">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-2">财务</div>
            <div
              id="access-module"
              onClick={() => isActive && currentStep === 2 && onStepClick(2)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-[12px]",
                isActive && currentStep === 2
                  ? "bg-[#0070F2]/10 text-[#0070F2] ring-2 ring-[#0070F2]/20"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>总账</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-[12px] text-gray-700">
              <FileText className="w-4 h-4" />
              <span>应收账款</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-[12px] text-gray-700">
              <FileText className="w-4 h-4" />
              <span>应付账款</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer text-[12px] text-gray-700">
              <FileText className="w-4 h-4" />
              <span>成本中心</span>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col bg-[#F5F5F5]">
          {/* 页面标题 */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">总账管理</h1>
              <button
                id="create-document"
                onClick={() => isActive && currentStep === 3 && onStepClick(3)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[12px] font-semibold transition-all",
                  isActive && currentStep === 3
                    ? "bg-[#0070F2] text-white ring-2 ring-[#0070F2]/30"
                    : "bg-[#0070F2] text-white hover:bg-[#0060E2]"
                )}
              >
                创建会计凭证
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 凭证列表 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-4 text-[11px] font-semibold text-gray-600">
                <div className="w-8">选择</div>
                <div className="w-24">凭证号</div>
                <div className="flex-1">描述</div>
                <div className="w-32">日期</div>
                <div className="w-32">金额</div>
                <div className="w-24">状态</div>
              </div>

              {[
                { id: "DOC-001", desc: "办公用品采购", date: "2024-01-15", amount: "¥5,200", status: "待审核" },
                { id: "DOC-002", desc: "员工薪资", date: "2024-01-15", amount: "¥125,000", status: "已审核" },
                { id: "DOC-003", desc: "设备折旧", date: "2024-01-14", amount: "¥8,500", status: "待审核" },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  id={idx === 0 ? "review-process" : undefined}
                  onClick={() => idx === 0 && isActive && currentStep === 4 && onStepClick(4)}
                  className={cn(
                    "px-4 py-3 border-b border-gray-100 flex items-center gap-4 text-[12px] transition-all",
                    idx === 0 && isActive && currentStep === 4
                      ? "bg-[#0070F2]/5 ring-2 ring-[#0070F2]/20 cursor-pointer"
                      : "hover:bg-gray-50"
                  )}
                >
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="w-24 font-medium text-gray-900">{doc.id}</div>
                  <div className="flex-1 text-gray-700">{doc.desc}</div>
                  <div className="w-32 text-gray-600">{doc.date}</div>
                  <div className="w-32 font-semibold text-gray-900">{doc.amount}</div>
                  <div className="w-24">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      doc.status === "已审核" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 报表区域 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-gray-900">财务报表</h3>
                <button
                  id="generate-report"
                  onClick={() => isActive && currentStep === 5 && onStepClick(5)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                    isActive && currentStep === 5
                      ? "bg-[#0070F2] text-white ring-2 ring-[#0070F2]/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  生成报表
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">总资产</div>
                  <div className="text-xl font-bold text-gray-900">¥2,450,000</div>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">净利润</div>
                  <div className="text-xl font-bold text-green-600">¥125,000</div>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <div className="text-[10px] text-gray-600 mb-1">现金流</div>
                  <div className="text-xl font-bold text-gray-900">¥380,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 步骤标签 */}
      {isActive && currentStep > 0 && (
        <div className="absolute top-4 right-4 bg-[#0070F2] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg">
          步骤 {currentStep} / {totalSteps}
        </div>
      )}
    </div>
  );
};
