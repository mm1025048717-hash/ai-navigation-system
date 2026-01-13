"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DemoIDE } from "@/components/demos/DemoIDE";
import { DemoReddit } from "@/components/demos/DemoReddit";
import { DemoFigma } from "@/components/demos/DemoFigma";
import { DemoPremiere } from "@/components/demos/DemoPremiere";
import { DemoPhotoshop } from "@/components/demos/DemoPhotoshop";
import { DemoNotion } from "@/components/demos/DemoNotion";
import { DemoSalesforce } from "@/components/demos/DemoSalesforce";
import { DemoTableau } from "@/components/demos/DemoTableau";
import { DemoJira } from "@/components/demos/DemoJira";
import { DemoSlack } from "@/components/demos/DemoSlack";
import { DemoSAP } from "@/components/demos/DemoSAP";
import { DemoHubSpot } from "@/components/demos/DemoHubSpot";
import { Overlay } from "@/components/Overlay";

type DemoType = 
  | "ide" 
  | "reddit" 
  | "figma" 
  | "premiere" 
  | "photoshop" 
  | "notion" 
  | "salesforce" 
  | "tableau" 
  | "jira" 
  | "slack" 
  | "sap" 
  | "hubspot";

type TaskType = "basic" | "advanced";

export default function Home() {
  const [isGuidanceActive, setIsGuidanceActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDemo, setCurrentDemo] = useState<DemoType>("ide");
  const [taskType, setTaskType] = useState<TaskType>("basic");
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [generatedSteps, setGeneratedSteps] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    const electronCheck = typeof window !== 'undefined' && (window as any).require;
    setIsElectron(!!electronCheck);

    if (electronCheck) {
      const { ipcRenderer } = (window as any).require('electron');
      const handleMouseMove = (e: MouseEvent) => {
        if (!sidebarRef.current) return;
        const rect = sidebarRef.current.getBoundingClientRect();
        const isOverSidebar = e.clientX >= rect.left;
        if (isOverSidebar) {
          ipcRenderer.send('set-ignore-mouse-events', false);
        } else {
          ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
        }
      };
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleSwitchDemo = (demo: DemoType) => {
    setCurrentDemo(demo);
    setCurrentStep(0);
    setIsGuidanceActive(false);
  };

  const handleStepClick = (step: number) => {
    if (isGuidanceActive && step === currentStep) {
      const maxSteps = generatedSteps.length > 0 ? generatedSteps.length : 4;
      setCurrentStep(prev => Math.min(prev + 1, maxSteps));
    }
  };

  const renderDemo = () => {
    const props = {
      currentStep,
      isActive: isGuidanceActive,
      onStepClick: handleStepClick,
      taskType,
      taskId,
      generatedSteps,
      totalSteps: generatedSteps.length > 0 ? generatedSteps.length : 5,
    };
    
    switch (currentDemo) {
      // C端软件
      case "ide":
        return <DemoIDE {...props} />;
      case "reddit":
        return <DemoReddit {...props} />;
      case "figma":
        return <DemoFigma {...props} />;
      case "premiere":
        return <DemoPremiere {...props} />;
      case "photoshop":
        return <DemoPhotoshop {...props} />;
      case "notion":
        return <DemoNotion {...props} />;
      // B端软件
      case "salesforce":
        return <DemoSalesforce {...props} />;
      case "tableau":
        return <DemoTableau {...props} />;
      case "jira":
        return <DemoJira {...props} />;
      case "slack":
        return <DemoSlack {...props} />;
      case "sap":
        return <DemoSAP {...props} />;
      case "hubspot":
        return <DemoHubSpot {...props} />;
      default:
        return (
          <div className="h-full flex items-center justify-center bg-[#F5F5F7] rounded-2xl">
            <div className="text-center">
              <p className="text-[#86868B] text-sm font-medium mb-2">{currentDemo} 演示</p>
              <p className="text-[#86868B] text-xs">演示界面开发中...</p>
            </div>
          </div>
        );
    }
  };

  // 计算目标元素位置（用于Overlay）
  const getTargetElement = () => {
    if (!isGuidanceActive || currentStep === 0) return undefined;
    
    // 根据当前步骤和演示类型计算目标位置
    // 这里可以根据实际UI元素识别结果动态设置
    const baseX = isElectron ? 0 : 100;
    const baseY = isElectron ? 0 : 100;
    
    switch (currentDemo) {
      case "ide":
        if (currentStep === 1) return { x: baseX + 60, y: baseY + 115, width: 200, height: 30 };
        if (currentStep === 2) return { x: baseX + 280, y: baseY + 195, width: 300, height: 25 };
        if (currentStep === 3) return { x: baseX + 60, y: baseY + 150, width: 200, height: 30 };
        if (currentStep === 4) return { x: baseX + 280, y: baseY + window.innerHeight - 140, width: 600, height: 120 };
        break;
      case "reddit":
        if (currentStep === 1) return { x: baseX + window.innerWidth - 400, y: baseY + 58, width: 120, height: 36 };
        if (currentStep === 2) return { x: baseX + 50, y: baseY + 140, width: 600, height: 100 };
        if (currentStep === 3) return { x: baseX + 120, y: baseY + 255, width: 150, height: 30 };
        if (currentStep === 4) return { x: baseX + window.innerWidth - 300, y: baseY + 140, width: 280, height: 200 };
        break;
      case "figma":
        if (currentStep === 1) return { x: baseX + 20, y: baseY + 100, width: 48, height: 200 };
        if (currentStep === 2) return { x: baseX + 300, y: baseY + 60, width: 256, height: 160 };
        if (currentStep === 3) return { x: baseX + 300, y: baseY + window.innerHeight - 180, width: 224, height: 128 };
        if (currentStep === 4) return { x: baseX + window.innerWidth - 240, y: baseY + 100, width: 256, height: 400 };
        break;
    }
    return undefined;
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden select-none" style={{ backgroundColor: isElectron ? 'transparent' : '#E8E8ED' }}>
      {/* 屏幕交互引导Overlay - 仅在Electron模式下显示 */}
      {isElectron && isGuidanceActive && (
        <Overlay
          isActive={isGuidanceActive}
          currentStep={currentStep}
          targetElement={getTargetElement()}
          arrowFrom={currentStep > 1 ? { x: window.innerWidth - 200, y: window.innerHeight / 2 } : undefined}
          label={currentStep > 0 ? `步骤 ${currentStep}` : undefined}
          isElectron={isElectron}
        />
      )}

      {/* 左侧屏幕区域 - Electron 模式下完全透明 */}
      <div 
        className="relative flex-1 h-full"
        style={isElectron ? { 
          pointerEvents: 'none',
          backgroundColor: 'transparent'
        } : { padding: '1rem' }}
      >
        {!isElectron && renderDemo()}
      </div>

      {/* 右侧侧边栏 */}
      <aside ref={sidebarRef} className="w-[380px] h-full z-20 shrink-0 p-6 pl-0" style={{ pointerEvents: 'auto' }}>
        <Sidebar 
          onStartGuidance={(taskType, taskId, steps) => {
            setIsGuidanceActive(true);
            setCurrentStep(1);
            setTaskType(taskType || "basic");
            setTaskId(taskId);
            setGeneratedSteps(steps || []);
          }}
          currentStep={currentStep}
          totalSteps={generatedSteps.length > 0 ? generatedSteps.length : 4}
          onNextStep={() => {
            const maxSteps = generatedSteps.length > 0 ? generatedSteps.length : 4;
            setCurrentStep(prev => Math.min(prev + 1, maxSteps));
          }}
          isElectron={isElectron}
          currentDemo={currentDemo}
          onSwitchDemo={handleSwitchDemo}
          generatedSteps={generatedSteps}
        />
      </aside>
    </main>
  );
}
