"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface OverlayProps {
  isActive: boolean;
  currentStep: number;
  targetElement?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  arrowFrom?: {
    x: number;
    y: number;
  };
  label?: string;
  isElectron?: boolean;
}

export const Overlay = ({ 
  isActive, 
  currentStep, 
  targetElement, 
  arrowFrom, 
  label,
  isElectron = false 
}: OverlayProps) => {
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });
  
  useEffect(() => {
    if (isElectron && typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.invoke('get-screen-size').then((size: { width: number; height: number }) => {
        if (size) {
          setScreenSize(size);
        }
      });
    }
  }, [isElectron]);

  if (!isActive || !targetElement) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ 
        width: screenSize.width, 
        height: screenSize.height,
        left: 0,
        top: 0,
      }}
    >
      {/* 遮罩层 - 暗化非目标区域 */}
      <svg 
        width={screenSize.width} 
        height={screenSize.height}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="highlight-mask">
            <rect width="100%" height="100%" fill="black" />
            <rect
              x={targetElement.x}
              y={targetElement.y}
              width={targetElement.width}
              height={targetElement.height}
              fill="white"
              rx="8"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#highlight-mask)"
        />
      </svg>

      {/* 高亮框 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute border-4 border-[#007AFF] rounded-lg shadow-[0_0_0_4px_rgba(0,122,255,0.2)]"
        style={{
          left: targetElement.x,
          top: targetElement.y,
          width: targetElement.width,
          height: targetElement.height,
          boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.2), 0 0 20px rgba(0, 122, 255, 0.4)',
        }}
      >
        {/* 脉冲动画 */}
        <motion.div
          className="absolute inset-0 border-4 border-[#007AFF] rounded-lg"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* 箭头指引 */}
      {arrowFrom && (
        <svg
          className="absolute"
          width={screenSize.width}
          height={screenSize.height}
          style={{ pointerEvents: 'none' }}
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            d={`M ${arrowFrom.x} ${arrowFrom.y} L ${targetElement.x + targetElement.width / 2} ${targetElement.y + targetElement.height / 2}`}
            stroke="#007AFF"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill="#007AFF"
              />
            </marker>
          </defs>
        </svg>
      )}

      {/* 提示标签 */}
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute px-4 py-2 bg-white text-[#007AFF] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#007AFF]/20 text-[12px] font-bold flex items-center gap-2 whitespace-nowrap"
          style={{
            left: targetElement.x + targetElement.width / 2,
            top: targetElement.y - 50,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-pulse" />
          {label}
        </motion.div>
      )}
    </div>
  );
};
