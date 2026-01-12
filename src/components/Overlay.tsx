"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OverlayProps {
  currentStep: number;
}

interface StepMarker {
  top: string;
  left: string;
  width: string;
  height: string;
  message: string;
}

const SIMULATED_COORDS: Record<number, StepMarker> = {
  1: {
    top: "140px",
    left: "80px",
    width: "160px",
    height: "28px",
    message: "文件锚点",
  },
  2: {
    top: "300px",
    left: "420px",
    width: "280px",
    height: "36px",
    message: "代码注入点",
  },
  3: {
    top: "420px",
    left: "440px",
    width: "320px",
    height: "80px",
    message: "逻辑修正区",
  },
  4: {
    top: "88%",
    left: "120px",
    width: "380px",
    height: "60px",
    message: "终端监控",
  },
};

export const Overlay = ({ currentStep }: OverlayProps) => {
  const marker = SIMULATED_COORDS[currentStep];

  if (!marker || currentStep === 5) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          {/* Subtle Highlight Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              top: marker.top,
              left: marker.left,
              width: marker.width,
              height: marker.height,
            }}
            className="absolute border border-apple-blue rounded-md shadow-[0_0_15px_rgba(0,122,255,0.15)] bg-apple-blue/[0.02]"
          >
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-apple-blue rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-apple-blue rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-apple-blue rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-apple-blue rounded-br-sm" />
          </motion.div>

          {/* Minimal Indicator Label */}
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              top: `calc(${marker.top} - 32px)`,
              left: marker.left,
            }}
            className="absolute flex items-center gap-2 px-2.5 py-1.5 bg-apple-blue text-white rounded-md shadow-lg"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">{marker.message}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Crosshair / Scanlines (Subtle Background) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black" />
      </div>
    </div>
  );
};
