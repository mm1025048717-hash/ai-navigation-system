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
    <div className="space-y-3">
      {/* 标题栏 */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#007AFF]/5 to-[#5856D6]/5 rounded-xl border border-[#007AFF]/10 hover:border-[#007AFF]/20 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-[12px] font-bold text-gray-800">知识库</div>
            <div className="text-[10px] text-gray-500">
              {documents.length > 0 ? `${documents.length} 个文档已加载` : '上传文档启用 AI'}
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-md bg-black/5 flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-1">
              {/* 拖拽上传区域 */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer",
                  isDragging
                    ? "border-[#007AFF] bg-[#007AFF]/5"
                    : "border-gray-200 hover:border-[#007AFF]/50 hover:bg-gray-50"
                )}
              >
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,text/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-2 text-center">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-[#007AFF] animate-spin" />
                  ) : (
                    <Upload className={cn(
                      "w-8 h-8 transition-colors",
                      isDragging ? "text-[#007AFF]" : "text-gray-400"
                    )} />
                  )}
                  <div>
                    <p className="text-[12px] font-semibold text-gray-700">
                      {isDragging ? "释放文件以上传" : "拖拽文件到此处"}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      支持 TXT、Markdown 等文本文件
                    </p>
                  </div>
                </div>
              </div>

              {/* 已上传文档列表 */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">
                    已加载文档
                  </div>
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-[#007AFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-gray-800 truncate">
                            {doc.name}
                          </span>
                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          {formatFileSize(doc.size)} • {doc.preview.slice(0, 50)}...
                        </p>
                      </div>
                      <button
                        onClick={() => onDocumentRemove(doc.id)}
                        className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* 提示信息 */}
              {documents.length === 0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-amber-500 mt-0.5">💡</div>
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    上传软件说明书、操作手册等文档，AI 将基于这些知识为你提供精准的操作指导。
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
