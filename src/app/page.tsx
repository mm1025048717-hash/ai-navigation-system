"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Overlay } from "@/components/Overlay";

export default function Home() {
  const [isGuidanceActive, setIsGuidanceActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 只在 Electron 环境下启用智能点击穿透
    if (typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');

      const handleMouseMove = (e: MouseEvent) => {
        if (!sidebarRef.current) return;
        
        const rect = sidebarRef.current.getBoundingClientRect();
        // 判断鼠标是否在右侧面板区域
        const isOverSidebar = e.clientX >= rect.left;

        if (isOverSidebar) {
          // 在侧边栏上 → 允许点击
          ipcRenderer.send('set-ignore-mouse-events', false);
        } else {
          // 在透明区域 → 穿透到桌面
          ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-transparent select-none p-4">
      {/* 左侧透明区域，点击会穿透到下层软件 */}
      <div className="relative flex-1 h-full pointer-events-none">
        {isGuidanceActive && (
          <Overlay currentStep={currentStep} />
        )}
      </div>

      {/* 右侧侧边栏 */}
      <aside ref={sidebarRef} className="w-[340px] h-full z-20 shrink-0">
        <div className="h-full native-panel rounded-[24px] overflow-hidden flex flex-col">
          <Sidebar 
            onStartGuidance={() => {
              setIsGuidanceActive(true);
              setCurrentStep(1);
            }}
            currentStep={currentStep}
            totalSteps={5}
            onNextStep={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
          />
        </div>
      </aside>
    </main>
  );
}
