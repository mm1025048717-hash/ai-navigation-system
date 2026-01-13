"use client";

import { BookOpen, Wrench, CheckCircle2, ArrowRight, Sparkles, Target, Navigation, ArrowRightCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

/**
 * 解析并渲染消息内容，将 Markdown 转换为视觉化的 UI 组件
 */
export function ChatMessage({ content, role }: ChatMessageProps) {
  // 如果是用户消息，直接显示文本
  if (role === "user") {
    return <div className="whitespace-pre-wrap font-medium">{content}</div>;
  }

  // 解析助手消息，提取结构化内容
  const lines = content.split('\n').filter(l => l.trim());
  
  // 检测是否是欢迎消息格式
  const isWelcomeMessage = content.includes('我能为你提供以下帮助') || 
                           content.includes('文档解析') || 
                           content.includes('软件操作分步教学');

  // 检测是否是引导步骤预览消息
  const isGuidanceStepsMessage = content.includes('已为你生成') && 
                                  (content.includes('引导步骤') || content.includes('步骤预览'));

  if (isWelcomeMessage) {
    return <WelcomeMessage content={content} />;
  }

  if (isGuidanceStepsMessage) {
    return <GuidanceStepsPreview content={content} />;
  }

  // 普通消息：简单格式化
  return <FormattedMessage content={content} />;
}

/**
 * 欢迎消息组件 - 高度视觉化
 */
function WelcomeMessage({ content }: { content: string }) {
  const lines = content.split('\n').filter(l => l.trim());
  
  // 提取标题
  const titleMatch = content.match(/\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '';

  // 提取文档解析部分
  const docSectionStart = lines.findIndex(l => l.includes('文档解析'));
  const docSectionEnd = lines.findIndex((l, i) => i > docSectionStart && (l.includes('软件操作') || l.includes('---')));
  const docSection = docSectionStart >= 0 
    ? lines.slice(docSectionStart, docSectionEnd > 0 ? docSectionEnd : undefined)
    : [];

  // 提取软件操作部分
  const opSectionStart = lines.findIndex(l => l.includes('软件操作'));
  const opSection = opSectionStart >= 0 ? lines.slice(opSectionStart) : [];

  // 提取文档解析的要点
  const docPoints: string[] = [];
  docSection.forEach(line => {
    const match = line.match(/[-•]\s*(.+)/);
    if (match) docPoints.push(match[1]);
  });

  // 提取操作步骤
  const steps: string[] = [];
  opSection.forEach(line => {
    const match = line.match(/\d+\.\s*(.+)/);
    if (match) steps.push(match[1]);
  });

  return (
    <div className="space-y-4">
      {/* 标题 */}
      {title && (
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#007AFF]" />
          <h3 className="text-[15px] font-bold text-[#1D1D1F]">{title}</h3>
        </div>
      )}

      {/* 文档解析卡片 */}
      {docPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#F0F7FF] to-white rounded-2xl p-4 border border-[#E8F2FF]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1D1D1F]">文档解析与指导</h4>
              <p className="text-[11px] text-[#86868B] mt-0.5">上传软件说明书后，我可以：</p>
            </div>
          </div>
          
          <div className="space-y-2.5 mt-3">
            {docPoints.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-md bg-white border border-[#E8F2FF] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#007AFF]" />
                </div>
                <span className="text-[12px] text-[#1D1D1F] leading-relaxed font-medium">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 软件操作卡片 */}
      {steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-4 border border-[#FFE8D1]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#FF9500] flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1D1D1F]">软件操作分步教学</h4>
              <p className="text-[11px] text-[#86868B] mt-0.5">将复杂操作拆解成简单步骤</p>
            </div>
          </div>
          
          <div className="space-y-2.5 mt-3">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FF9500] text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <span className="text-[12px] text-[#1D1D1F] leading-relaxed font-medium">{step}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#86868B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * 格式化普通消息 - 处理简单的 Markdown
 */
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];
  let inList = false;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    // 空行
    if (!trimmed) {
      if (inList && currentList.length > 0) {
        elements.push(
          <ul key={`list-${idx}`} className="space-y-1.5 my-2">
            {currentList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px]">
                <span className="text-[#007AFF] mt-1.5 shrink-0">•</span>
                <span className="text-[#1D1D1F] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
        inList = false;
      }
      return;
    }

    // 标题
    if (trimmed.startsWith('###')) {
      const text = trimmed.replace(/^###+\s*/, '');
      elements.push(
        <h3 key={idx} className="text-[14px] font-bold text-[#1D1D1F] mt-4 mb-2 first:mt-0">
          {text}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('####')) {
      const text = trimmed.replace(/^####+\s*/, '');
      elements.push(
        <h4 key={idx} className="text-[13px] font-bold text-[#1D1D1F] mt-3 mb-1.5 first:mt-0">
          {text}
        </h4>
      );
      return;
    }

    // 粗体文本
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const text = trimmed.replace(/\*\*/g, '');
      elements.push(
        <p key={idx} className="text-[13px] font-bold text-[#1D1D1F] my-2">
          {text}
        </p>
      );
      return;
    }

    // 列表项
    if (trimmed.match(/^[-•]\s+/)) {
      const text = trimmed.replace(/^[-•]\s+/, '');
      currentList.push(text);
      inList = true;
      return;
    }

    // 编号列表
    if (trimmed.match(/^\d+\.\s+/)) {
      const text = trimmed.replace(/^\d+\.\s+/, '');
      if (!inList || currentList.length === 0) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1.5">
            <span className="text-[#007AFF] font-bold text-[11px] mt-0.5 shrink-0">
              {trimmed.match(/^\d+/)?.[0]}.
            </span>
            <span className="text-[12px] text-[#1D1D1F] leading-relaxed flex-1">{text}</span>
          </div>
        );
      } else {
        // 先处理之前的列表
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-before-${idx}`} className="space-y-1.5 my-2">
              {currentList.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px]">
                  <span className="text-[#007AFF] mt-1.5 shrink-0">•</span>
                  <span className="text-[#1D1D1F] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          );
          currentList = [];
        }
        // 然后添加编号项
        const text = trimmed.replace(/^\d+\.\s+/, '');
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1.5">
            <span className="text-[#007AFF] font-bold text-[11px] mt-0.5 shrink-0">
              {trimmed.match(/^\d+/)?.[0]}.
            </span>
            <span className="text-[12px] text-[#1D1D1F] leading-relaxed flex-1">{text}</span>
          </div>
        );
        inList = false;
      }
      return;
    }

    // 普通段落
    if (!inList) {
      // 处理内联粗体
      const parts = trimmed.split(/(\*\*.+?\*\*)/g);
      if (parts.length > 1) {
        elements.push(
          <p key={idx} className="text-[12px] text-[#1D1D1F] leading-relaxed my-1.5">
            {parts.map((part, i) => 
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={i} className="font-bold">{part.replace(/\*\*/g, '')}</strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        );
      } else {
        elements.push(
          <p key={idx} className="text-[12px] text-[#1D1D1F] leading-relaxed my-1.5">
            {trimmed}
          </p>
        );
      }
    }
  });

  // 处理最后的列表
  if (inList && currentList.length > 0) {
    elements.push(
      <ul key="list-final" className="space-y-1.5 my-2">
        {currentList.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px]">
            <span className="text-[#007AFF] mt-1.5 shrink-0">•</span>
            <span className="text-[#1D1D1F] leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

/**
 * 引导步骤预览组件 - 高度视觉化
 */
function GuidanceStepsPreview({ content }: { content: string }) {
  // 提取步骤数量
  const stepsCountMatch = content.match(/已为你生成\s*(\d+)\s*个引导步骤/);
  const stepsCount = stepsCountMatch ? parseInt(stepsCountMatch[1]) : 0;

  // 提取步骤列表
  const steps: string[] = [];
  const lines = content.split('\n');
  let inStepsSection = false;

  lines.forEach(line => {
    if (line.includes('步骤预览') || line.includes('生成的步骤')) {
      inStepsSection = true;
      return;
    }
    if (inStepsSection) {
      const stepMatch = line.match(/^\d+\.\s*(.+)/);
      if (stepMatch) {
        steps.push(stepMatch[1].trim());
      }
    }
  });

  // 提取提示文本（切换到智能引导）
  const instructionMatch = content.match(/切换到「(.+?)」标签页[，,](.+?)。/);
  const instruction = instructionMatch ? instructionMatch[0] : '';

  return (
    <div className="space-y-4">
      {/* 成功提示卡片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#E8F5E9] via-white to-[#F1F8E9] rounded-2xl p-4 border border-[#C8E6C9] shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] flex items-center justify-center shadow-md">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#1D1D1F] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4CAF50]" />
              已为你生成 {stepsCount} 个引导步骤！
            </h3>
            {instruction && (
              <p className="text-[12px] text-[#2E7D32] mt-1 leading-relaxed">
                {instruction}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* 步骤列表卡片 */}
      {steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#E3F2FD] via-white to-[#F5F9FF] rounded-2xl p-4 border border-[#BBDEFB] shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2196F3] to-[#42A5F5] flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-[14px] font-bold text-[#1D1D1F]">生成的步骤预览</h4>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + idx * 0.08 }}
                className="group relative"
              >
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 hover:bg-white transition-all border border-[#E1F5FE] hover:border-[#2196F3] hover:shadow-md">
                  {/* 步骤编号 */}
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2196F3] to-[#42A5F5] text-white text-[12px] font-bold flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-[#2196F3] to-transparent" />
                    )}
                  </div>

                  {/* 步骤内容 */}
                  <div className="flex-1 pt-0.5 min-w-0">
                    <p className="text-[13px] text-[#1D1D1F] leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>

                  {/* 箭头图标（悬停时显示） */}
                  {idx < steps.length - 1 && (
                    <ArrowRightCircle className="w-4 h-4 text-[#2196F3] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 底部提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + steps.length * 0.08 }}
            className="mt-4 pt-4 border-t border-[#BBDEFB]"
          >
            <div className="flex items-center gap-2 text-[11px] text-[#1976D2] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>切换到「智能引导」标签页开始逐步操作</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
