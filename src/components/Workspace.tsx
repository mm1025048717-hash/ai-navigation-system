"use client";

import { motion } from "framer-motion";
import { 
  FileCode, 
  Search, 
  Play, 
  FolderTree, 
  Layers,
  Code2,
  Terminal,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceProps {
  isGuidanceActive: boolean;
  currentStep: number;
}

export const Workspace = ({ isGuidanceActive, currentStep }: WorkspaceProps) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-[#D4D4D4] font-mono text-sm overflow-hidden">
      {/* Top Menu Bar */}
      <div className="h-9 border-b border-white/5 bg-[#252526] flex items-center px-4 gap-6 text-[12px] text-white/60">
        <div className="flex gap-4">
          <span>文件(F)</span>
          <span>编辑(E)</span>
          <span>视图(V)</span>
          <span>导航(N)</span>
          <span>代码(C)</span>
          <span>运行(R)</span>
          <span>工具(T)</span>
          <span>帮助(H)</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded">
            <Search className="w-3 h-3" />
            <span>搜索操作 (Ctrl+Shift+A)</span>
          </div>
          <Play className="w-4 h-4 text-green-500 fill-green-500" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-12 border-r border-white/5 bg-[#333333] flex flex-col items-center py-4 gap-6">
          <FolderTree className="w-6 h-6 text-white/40" />
          <Layers className="w-6 h-6 text-white/40" />
          <Search className="w-6 h-6 text-white/40" />
          <div className="mt-auto mb-4">
            <Settings className="w-6 h-6 text-white/40" />
          </div>
        </div>

        {/* Project Explorer */}
        <div className="w-64 border-r border-white/5 bg-[#252526] p-4 space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-white/30 font-bold mb-4">项目</div>
          <div className="flex items-center gap-2 text-white/80">
            <ChevronRight className="w-4 h-4" />
            <FolderTree className="w-4 h-4 text-blue-400" />
            <span>my-project</span>
          </div>
          <div className="pl-6 space-y-2">
            <div className="flex items-center gap-2 text-white/60">
              <Code2 className="w-4 h-4 text-yellow-500" />
              <span>main.py</span>
            </div>
            <div id="step-1-target" className={cn(
              "flex items-center gap-2 text-white/60 p-1 rounded transition-all",
              isGuidanceActive && currentStep === 1 && "bg-blue-500/20 ring-1 ring-blue-500/50"
            )}>
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>login_view.py</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>models.py</span>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col relative">
          <div className="h-9 bg-[#2D2D2D] flex items-center px-4 border-b border-white/5">
            <div className="bg-[#1E1E1E] px-4 h-full flex items-center gap-2 border-r border-white/5 text-blue-400">
              <FileCode className="w-4 h-4" />
              <span>login_view.py</span>
            </div>
          </div>
          <div className="flex-1 p-8 space-y-4 overflow-auto">
            <div className="flex gap-4">
              <span className="text-white/20">1</span>
              <span className="text-purple-400">from</span>
              <span className="text-white/80">flask</span>
              <span className="text-purple-400">import</span>
              <span className="text-white/80">Blueprint, render_template</span>
            </div>
            <div className="flex gap-4">
              <span className="text-white/20">2</span>
              <span className="text-purple-400">from</span>
              <span className="text-white/80">app.forms</span>
              <span className="text-purple-400">import</span>
              <span className="text-white/80">LoginForm</span>
            </div>
            <div className="flex gap-4">
              <span className="text-white/20">3</span>
            </div>
            <div className="flex gap-4">
              <span className="text-white/20">4</span>
              <span className="text-white/40"># TODO: Implement login logic</span>
            </div>
            <div id="step-2-target" className={cn(
              "flex gap-4 p-1 rounded transition-all",
              isGuidanceActive && currentStep === 2 && "bg-blue-500/20 ring-1 ring-blue-500/50"
            )}>
              <span className="text-white/20">5</span>
              <span className="text-purple-400">def</span>
              <span className="text-blue-400">login</span>
              <span className="text-white/80">():</span>
            </div>
            <div className="flex gap-4">
              <span className="text-white/20">6</span>
              <span className="text-white/80 ml-8">form = LoginForm()</span>
            </div>

            {currentStep === 3 && (
              <motion.div 
                id="step-3-target"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-4 items-start"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">!</span>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-1">ImportError: No module named 'app.forms'</div>
                  <div className="text-red-400/60 text-xs">AI 建议: 检查模块路径或运行 pip install -r requirements.txt</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Panel */}
          <div className="h-32 border-t border-white/5 bg-[#1E1E1E] flex flex-col">
            <div className="h-8 bg-[#252526] flex items-center px-4 gap-4 text-[11px]">
              <div className="text-white/80 border-b-2 border-blue-500 h-full flex items-center px-2">终端</div>
              <div className="text-white/40 h-full flex items-center px-2">运行</div>
              <div className="text-white/40 h-full flex items-center px-2">调试</div>
            </div>
            <div className="flex-1 p-4 text-[#CCCCCC] overflow-auto">
              <div className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-400">my-project</span>
                <span>python main.py</span>
              </div>
              <div id="step-4-target" className={cn(
                "mt-2 transition-all p-1 rounded",
                isGuidanceActive && currentStep === 4 && "bg-blue-500/20 ring-1 ring-blue-500/50"
              )}>
                <span className="text-white/40">Traceback (most recent call last):</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Re-using some icons from lucide-react that weren't imported
function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  )
}

function Settings(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}
