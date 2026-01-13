"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DemoIDE } from "@/components/demos/DemoIDE";
import { DemoReddit } from "@/components/demos/DemoReddit";
import { DemoFigma } from "@/components/demos/DemoFigma";

type DemoType = "ide" | "reddit" | "figma";

export default function Home() {
  const [isGuidanceActive, setIsGuidanceActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDemo, setCurrentDemo] = useState<DemoType>("ide");
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
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const renderDemo = () => {
    const props = {
      currentStep,
      isActive: isGuidanceActive,
      onStepClick: handleStepClick,
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
    <main className="flex h-screen w-screen overflow-hidden bg-[#E8E8ED] select-none">
      {/* 左侧演示区域 */}
      <div className="relative flex-1 h-full p-4">
        {!isElectron && renderDemo()}
      </div>

      {/* 右侧侧边栏 */}
      <aside ref={sidebarRef} className="w-[360px] h-full z-20 shrink-0 p-4 pl-0">
        <div className="h-full bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden flex flex-col shadow-2xl border border-white/50">
          <Sidebar 
            onStartGuidance={() => {
              setIsGuidanceActive(true);
              setCurrentStep(1);
            }}
            currentStep={currentStep}
            totalSteps={4}
            onNextStep={() => setCurrentStep(prev => Math.min(prev + 1, 4))}
            isElectron={isElectron}
            currentDemo={currentDemo}
            onSwitchDemo={handleSwitchDemo}
          />
        </div>
      </aside>
    </main>
  );
}
