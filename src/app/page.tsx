"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DemoIDE } from "@/components/demos/DemoIDE";
import { DemoReddit } from "@/components/demos/DemoReddit";
import { DemoFigma } from "@/components/demos/DemoFigma";

type DemoType = "ide" | "reddit" | "figma";

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
      totalSteps: generatedSteps.length > 0 ? generatedSteps.length : 4,
    };
    
    switch (currentDemo) {
      case "ide":
        return <DemoIDE {...props} />;
      case "reddit":
        return <DemoReddit {...props} />;
      case "figma":
        return <DemoFigma {...props} />;
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden select-none" style={{ backgroundColor: isElectron ? 'transparent' : '#E8E8ED' }}>
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
