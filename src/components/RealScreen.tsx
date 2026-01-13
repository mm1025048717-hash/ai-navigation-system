"use client";

import { useEffect, useRef, useState } from "react";

interface RealScreenProps {
  isElectron: boolean;
  fps?: number;
}

export const RealScreen = ({ isElectron, fps = 2 }: RealScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (!isElectron || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取屏幕尺寸
    const getScreenSize = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).require) {
          const { ipcRenderer } = (window as any).require('electron');
          const size = await ipcRenderer.invoke('get-screen-size');
          if (size) {
            setScreenSize(size);
            canvas.width = size.width;
            canvas.height = size.height;
          }
        }
      } catch (err) {
        console.error('Get screen size error:', err);
      }
    };

    getScreenSize();

    const captureScreen = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).require) {
          const { ipcRenderer } = (window as any).require('electron');
          const dataURL = await ipcRenderer.invoke('capture-screen');
          
          if (dataURL && ctx && canvas.width && canvas.height) {
            // 使用 Image 对象加载图片
            if (!imgRef.current) {
              imgRef.current = new Image();
            }
            
            const img = imgRef.current;
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = dataURL;
            setError(null);
          }
        }
      } catch (err) {
        console.error('Screen capture error:', err);
        setError('无法捕获屏幕');
        setIsCapturing(false);
      }
    };

    // 开始捕获
    setIsCapturing(true);
    captureScreen(); // 立即执行一次
    intervalRef.current = setInterval(captureScreen, 1000 / fps);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsCapturing(false);
    };
  }, [isElectron, fps]);

  if (!isElectron) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1E1E1E] rounded-2xl">
        <div className="text-center text-white/60">
          <p className="text-lg font-medium mb-2">屏幕捕获仅在 Electron 模式下可用</p>
          <p className="text-sm">请使用 <code className="bg-black/30 px-2 py-1 rounded">npm run app</code> 启动桌面应用</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#000000] rounded-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          objectFit: 'contain',
          imageRendering: 'auto'
        }}
      />
      
      {/* 状态指示器 */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-white/10">
        <div className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-[#34C759] animate-pulse' : 'bg-gray-500'}`} />
        <span className="text-white text-[11px] font-bold">
          {isCapturing ? `LIVE • ${fps} FPS` : 'OFFLINE'}
        </span>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500/90 backdrop-blur-md rounded-lg text-white text-sm font-medium shadow-lg">
          {error}
        </div>
      )}

      {/* 提示信息 */}
      <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
        <p className="text-white text-[11px] font-medium">
          💡 实时屏幕显示 • {screenSize.width} × {screenSize.height}
        </p>
      </div>
    </div>
  );
};
