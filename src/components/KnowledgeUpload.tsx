"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  Loader2,
  File,
  Trash2,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedDoc {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
  uploadedAt: string;
  preview: string;
}

interface KnowledgeUploadProps {
  documents: UploadedDoc[];
  onDocumentAdd: (doc: UploadedDoc) => void;
  onDocumentRemove: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const KnowledgeUpload = ({
  documents,
  onDocumentAdd,
  onDocumentRemove,
  isExpanded,
  onToggleExpand,
}: KnowledgeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
    e.target.value = ''; // Reset input
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      // 只接受文本文件
      if (!file.type.includes('text') && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
        continue;
      }
      
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const doc = await response.json();
          onDocumentAdd(doc);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* 标题栏 */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl border border-black/[0.03] hover:bg-[#E8E8ED] transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-[#007AFF]" />
          </div>
          <div className="text-left">
            <div className="text-[13px] font-bold text-[#1D1D1F]">智能知识库</div>
            <div className="text-[11px] text-[#86868B] font-medium mt-0.5">
              {documents.length > 0 ? `${documents.length} 个文档已就绪` : '上传操作手册激活 AI'}
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <svg className="w-3.5 h-3.5 text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1">
              {/* 拖拽上传区域 */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-[20px] p-6 transition-all cursor-pointer",
                  isDragging
                    ? "border-[#007AFF] bg-[#007AFF]/5"
                    : "border-[#E8E8ED] hover:border-[#007AFF]/30 hover:bg-[#F5F5F7]"
                )}
              >
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,text/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-[#007AFF] animate-spin" />
                    ) : (
                      <Upload className={cn(
                        "w-6 h-6 transition-colors",
                        isDragging ? "text-[#007AFF]" : "text-[#86868B]"
                      )} />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1D1D1F]">
                      {isDragging ? "释放以同步" : "拖入说明文档"}
                    </p>
                    <p className="text-[11px] text-[#86868B] mt-1 font-medium">
                      支持 Markdown, TXT 格式
                    </p>
                  </div>
                </div>
              </div>

              {/* 已上传文档列表 */}
              {documents.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.1em] px-1">
                    已连接的知识
                  </div>
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-black/[0.03] shadow-sm group hover:border-[#007AFF]/20 transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#F5F5F7] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8F2FF] transition-colors">
                        <FileText className="w-5 h-5 text-[#86868B] group-hover:text-[#007AFF] transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-[#1D1D1F] truncate">
                            {doc.name}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] flex-shrink-0" />
                        </div>
                        <p className="text-[10px] text-[#86868B] mt-0.5 font-medium">
                          {formatFileSize(doc.size)} • {doc.preview.slice(0, 30)}...
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentRemove(doc.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all active:scale-90"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* 提示信息 */}
              {documents.length === 0 && (
                <div className="flex items-start gap-3 p-4 bg-[#F5F5F7] rounded-[20px] border border-black/[0.02]">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <span className="text-[10px]">💡</span>
                  </div>
                  <p className="text-[11px] text-[#1D1D1F] leading-[1.6] font-medium">
                    上传软件说明书、操作手册等文档，AI 将基于这些知识为你提供极度精准的操作指导。
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
