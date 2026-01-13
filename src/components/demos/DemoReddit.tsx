"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface DemoRedditProps {
  currentStep: number;
  isActive: boolean;
  onStepClick: (step: number) => void;
  taskType?: "basic" | "advanced";
  taskId?: string;
  generatedSteps?: string[];
  totalSteps?: number;
}

export const DemoReddit = ({ currentStep, isActive, onStepClick, taskType = "basic", taskId, generatedSteps = [], totalSteps = 4 }: DemoRedditProps) => {
  const isAdvanced = taskType === "advanced";
  const isGainFollowers = taskId === "gain-followers";
  const [selectedSort, setSelectedSort] = useState("Hot");
  
  // 根据步骤内容动态确定可点击元素
  const getStepTarget = (stepIndex: number) => {
    if (!isAdvanced || !generatedSteps.length) {
      return stepIndex;
    }
    const stepText = generatedSteps[stepIndex - 1]?.toLowerCase() || "";
    if (stepText.includes("社区") || stepText.includes("选择") || stepText.includes("垂直")) return 1;
    if (stepText.includes("发布") || stepText.includes("内容") || stepText.includes("原创")) return 2;
    if (stepText.includes("评论") || stepText.includes("互动") || stepText.includes("深度")) return 3;
    if (stepText.includes("数据") || stepText.includes("分析") || stepText.includes("优化")) return 4;
    if (stepText.includes("品牌") || stepText.includes("持续") || stepText.includes("建立")) return 5;
    return Math.min(stepIndex, 6);
  };
  
  const posts = [
    {
      id: 1,
      title: isGainFollowers 
        ? "How I Gained 1000 Followers in 3 Months: A Complete Reddit Strategy Guide"
        : "AI-Powered Code Navigation is the Future of Development",
      author: isGainFollowers ? "u/your_username" : "u/developer_alex",
      subreddit: "r/programming",
      time: isGainFollowers ? "2h" : "3h",
      upvotes: 2400,
      comments: isGainFollowers ? 1200 : 324,
      awards: 12,
      isUserPost: isGainFollowers,
    },
    {
      id: 2,
      title: "Show HN: Built an AI that watches your screen and guides you",
      author: "u/tech_insider",
      subreddit: "r/programming",
      time: "5h",
      upvotes: 891,
      comments: 156,
      awards: 5,
    },
    {
      id: 3,
      title: isGainFollowers ? "Daily Engagement Thread: Share Your Latest Project!" : "TypeScript 5.0 Released with Major Performance Improvements",
      author: isGainFollowers ? "u/your_username" : "u/typescript_team",
      subreddit: "r/programming",
      time: isGainFollowers ? "1d" : "8h",
      upvotes: isGainFollowers ? 3100 : 1245,
      comments: isGainFollowers ? 847 : 289,
      awards: isGainFollowers ? 8 : 15,
      isUserPost: isGainFollowers,
    },
    {
      id: 4,
      title: "The Complete Guide to React Server Components",
      author: "u/react_expert",
      subreddit: "r/programming",
      time: "12h",
      upvotes: 567,
      comments: 98,
      awards: 3,
    },
    {
      id: 5,
      title: "Why I Switched from Python to Rust for My Next Project",
      author: "u/rust_enthusiast",
      subreddit: "r/programming",
      time: "1d",
      upvotes: 423,
      comments: 67,
      awards: 2,
    },
  ];
  
  return (
    <div className="h-full bg-[#0E0E0F] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* 浏览器顶栏 */}
      <div className="h-10 bg-[#1A1A1B] flex items-center px-4 gap-2 border-b border-[#343536]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
        <div className="ml-4 flex-1 h-7 bg-[#272729] rounded-full flex items-center px-3">
          <span className="text-[11px] text-gray-400">🔒 reddit.com/r/programming</span>
        </div>
      </div>

      {/* Reddit 主导航栏 */}
      <div className="h-12 bg-[#1A1A1B] flex items-center px-4 gap-4 border-b border-[#343536]">
        {/* Reddit Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center text-white font-bold text-[14px]">
            r/
          </div>
          <span className="text-white font-bold text-[14px]">reddit</span>
        </div>

        {/* 搜索框 */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="h-9 bg-[#272729] rounded-full flex items-center px-4 gap-2 hover:bg-[#343536] transition-colors cursor-pointer">
            <span className="text-gray-400 text-[12px]">🔍 Search Reddit</span>
          </div>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          {/* Create Post - Step 1 */}
          <button 
            onClick={() => {
              if (isActive && (currentStep === 1 || (isAdvanced && getStepTarget(currentStep) === 1))) {
                onStepClick(1);
              }
            }}
            className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              isActive && (currentStep === 1 || (isAdvanced && getStepTarget(currentStep) === 1))
                ? "ring-2 ring-[#007AFF] ring-offset-2 ring-offset-[#1A1A1B] animate-pulse bg-[#007AFF] text-white" 
                : "bg-white text-[#1A1A1B] hover:bg-gray-200"
            }`}
          >
            {isAdvanced && isGainFollowers ? "选择社区" : "+ Create Post"}
          </button>
          {/* 用户头像 */}
          <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center text-white font-bold text-[12px] cursor-pointer hover:opacity-80">
            U
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧导航栏 */}
        <div className="w-64 bg-[#1A1A1B] border-r border-[#343536] p-3 hidden lg:block">
          <div className="space-y-1">
            <div 
              onClick={() => {
                // 导航点击交互
              }}
              className="px-3 py-2 text-white text-[13px] font-medium hover:bg-[#272729] active:bg-[#343536] rounded cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>🏠</span> Home
            </div>
            <div 
              onClick={() => {
                // 导航点击交互
              }}
              className="px-3 py-2 text-white text-[13px] font-medium hover:bg-[#272729] active:bg-[#343536] rounded cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>🔥</span> Popular
            </div>
            <div 
              onClick={() => {
                // 导航点击交互
              }}
              className="px-3 py-2 text-white text-[13px] font-medium hover:bg-[#272729] active:bg-[#343536] rounded cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>🌐</span> All
            </div>
            <div className="h-px bg-[#343536] my-2" />
            <div 
              onClick={() => {
                // 子版块点击交互
              }}
              className="px-3 py-2 text-[#FF4500] text-[13px] font-bold hover:bg-[#272729] active:bg-[#343536] rounded cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>📁</span> r/programming
            </div>
            <div 
              onClick={() => {
                // 子版块点击交互
              }}
              className="px-3 py-2 text-gray-400 text-[13px] font-medium hover:bg-[#272729] active:bg-[#343536] rounded cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>💬</span> r/webdev
            </div>
            <div 
              onClick={() => {
                // 子版块点击交互
              }}
              className="px-3 py-2 text-gray-400 text-[13px] font-medium hover:bg-[#272729] active:bg-[#343536] rounded cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>💻</span> r/javascript
            </div>
            <div 
              onClick={() => {
                // 子版块点击交互
              }}
              className="px-3 py-2 text-gray-400 text-[13px] font-medium hover:bg-[#272729] active:bg-[#343536] rounded cursor-pointer flex items-center gap-2 transition-all"
            >
              <span>🐍</span> r/Python
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 排序栏 */}
          <div className="h-12 bg-[#1A1A1B] border-b border-[#343536] flex items-center px-4 gap-4">
            <div className="flex items-center gap-2">
              {["Hot", "New", "Top", "Rising"].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSelectedSort(sort)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                    selectedSort === sort
                      ? "bg-[#272729] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#272729]"
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          {/* 帖子列表 */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {posts.map((post, index) => {
              const isTargetPost = (index === 0 && (currentStep === 2 || (isAdvanced && getStepTarget(currentStep) === 2))) ||
                                   (index === 2 && isGainFollowers && (currentStep === 2 || (isAdvanced && getStepTarget(currentStep) === 2)));
              
              return (
                <div
                  key={post.id}
                  onClick={() => {
                    if (isActive && isTargetPost) {
                      onStepClick(2);
                    }
                  }}
                  className={`bg-[#1A1A1B] rounded-lg p-4 border transition-all cursor-pointer ${
                    isActive && isTargetPost
                      ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse border-[#007AFF]" 
                      : "border-[#343536] hover:border-[#545456]"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* 投票按钮 */}
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // 投票交互
                        }}
                        className="hover:text-[#FF4500] active:scale-110 transition-all text-[16px]"
                      >
                        ▲
                      </button>
                      <span className="text-[12px] font-bold text-white">{post.upvotes > 1000 ? `${(post.upvotes / 1000).toFixed(1)}k` : post.upvotes}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // 投票交互
                        }}
                        className="hover:text-blue-400 active:scale-110 transition-all text-[16px]"
                      >
                        ▼
                      </button>
                    </div>
                    
                    {/* 帖子内容 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-500">{post.subreddit}</span>
                        <span className="text-[10px] text-gray-500">•</span>
                        <span className="text-[10px] text-gray-500">Posted by {post.author}</span>
                        <span className="text-[10px] text-gray-500">•</span>
                        <span className="text-[10px] text-gray-500">{post.time}</span>
                        {post.isUserPost && (
                          <span className="px-1.5 py-0.5 bg-[#FF4500]/20 text-[#FF4500] text-[9px] font-bold rounded">YOU</span>
                        )}
                      </div>
                      <h3 className="text-white font-medium text-[15px] mb-2 hover:text-[#FF4500] cursor-pointer">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[11px] text-gray-400">
                        {/* Comment - Step 3 */}
                        <span 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (isActive && (currentStep === 3 || (isAdvanced && getStepTarget(currentStep) === 3))) {
                              onStepClick(3);
                            }
                          }}
                          className={`flex items-center gap-1 cursor-pointer transition-all ${
                            isActive && (currentStep === 3 || (isAdvanced && getStepTarget(currentStep) === 3))
                              ? "text-[#007AFF] font-bold bg-[#007AFF]/20 px-2 py-1 rounded animate-pulse" 
                              : "hover:text-white"
                          }`}
                        >
                          💬 {post.comments > 1000 ? `${(post.comments / 1000).toFixed(1)}k` : post.comments} Comments
                        </span>
                        <span className="hover:text-white cursor-pointer">🔗 Share</span>
                        <span className="hover:text-white cursor-pointer">⭐ Save</span>
                        <span className="hover:text-white cursor-pointer">🏆 {post.awards} Awards</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 数据分析区域 - Step 4/5 (复杂任务) */}
            {isGainFollowers && (currentStep === 4 || currentStep === 5) && isActive && (
              <div 
                onClick={() => {
                  if (isActive && (currentStep === 4 || currentStep === 5)) {
                    onStepClick(currentStep);
                  }
                }}
                className={`bg-[#1A1A1B] rounded-lg p-4 border transition-all cursor-pointer ${
                  isActive && (currentStep === 4 || currentStep === 5)
                    ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse border-[#007AFF]" 
                    : "border-[#343536] hover:border-[#545456]"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#007AFF] text-lg">📊</span>
                  <h4 className="text-white font-bold text-[14px]">数据分析中心</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div className="space-y-1">
                    <div className="text-gray-400">最佳发布时间</div>
                    <div className="text-white font-bold">14:00 - 18:00</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">平均互动率</div>
                    <div className="text-[#34C759] font-bold">12.3% ↑</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">热门话题</div>
                    <div className="text-white font-bold">#AI #Programming</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">内容类型</div>
                    <div className="text-white font-bold">技术分享 60%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧边栏 */}
        <div className="w-80 p-4 border-l border-[#343536] hidden xl:block overflow-auto">
          {/* 社区信息卡片 - Step 4/5/6 */}
          <div 
            onClick={() => {
              if (isActive && (currentStep === 4 || (isAdvanced && (currentStep >= 4 && currentStep <= totalSteps)))) {
                onStepClick(currentStep);
              }
            }}
            className={`bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] transition-all cursor-pointer mb-4 ${
              isActive && (currentStep === 4 || (isAdvanced && (currentStep >= 4 && currentStep <= totalSteps)))
                ? "ring-2 ring-[#007AFF] bg-[#007AFF]/10 animate-pulse" 
                : "hover:border-[#545456]"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-[#FF4500] rounded-full flex items-center justify-center text-white font-bold text-[16px]">
                r/
              </div>
              <div>
                <h4 className="text-white font-bold text-[14px]">r/programming</h4>
                <p className="text-gray-400 text-[11px]">r/programming</p>
              </div>
            </div>
            <p className="text-gray-400 text-[12px] mb-3">Computer Programming discussion and news</p>
            <div className="text-[12px] text-gray-400 space-y-1 mb-3">
              <div className="flex justify-between">
                <span>👥 Members</span>
                <span className="text-white font-bold">5.2m</span>
              </div>
              <div className="flex justify-between">
                <span>🟢 Online</span>
                <span className="text-white font-bold">12.3k</span>
              </div>
              <div className="flex justify-between">
                <span>📅 Created</span>
                <span className="text-white">Jan 2008</span>
              </div>
            </div>
            {isGainFollowers && (
              <div className="mb-3 p-3 bg-[#FF4500]/10 border border-[#FF4500]/30 rounded-lg">
                <div className="text-[#FF4500] font-bold text-[12px] mb-2">📈 Your Growth</div>
                <div className="text-white text-[14px] font-bold mb-1">Followers: 847/1000</div>
                <div className="h-2 bg-[#343536] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF4500] rounded-full transition-all" style={{ width: '84.7%' }} />
                </div>
                <div className="text-gray-400 text-[10px] mt-1">153 more to reach your goal!</div>
              </div>
            )}
            <button className={`w-full mt-3 py-2 rounded-full text-[12px] font-bold transition-colors ${
              isGainFollowers 
                ? "bg-[#343536] text-white hover:bg-[#3C3C3C]" 
                : "bg-[#FF4500] text-white hover:bg-[#FF5722]"
            }`}>
              {isGainFollowers ? "Joined ✓" : "Join"}
            </button>
          </div>

          {/* 推荐社区 */}
          <div className="bg-[#1A1A1B] rounded-lg p-4 border border-[#343536] mb-4">
            <h4 className="text-white font-bold text-[13px] mb-3">Popular Communities</h4>
            <div className="space-y-2">
              {["r/webdev", "r/javascript", "r/Python", "r/reactjs"].map((sub) => (
                <div key={sub} className="flex items-center gap-2 cursor-pointer hover:bg-[#272729] p-2 rounded">
                  <div className="w-6 h-6 bg-[#FF4500] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    r/
                  </div>
                  <span className="text-white text-[12px] font-medium">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 广告/推广 */}
          <div className="bg-[#1A1A1B] rounded-lg p-4 border border-[#343536]">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Promoted</div>
            <div className="bg-gradient-to-br from-[#FF4500] to-[#FF5722] rounded-lg p-3 text-white">
              <div className="text-[12px] font-bold mb-1">Reddit Premium</div>
              <div className="text-[10px] opacity-90">Ad-free experience & more</div>
            </div>
          </div>
        </div>
      </div>

      {/* 引导提示标签 */}
      {isActive && currentStep > 0 && currentStep <= totalSteps && (
        <StepLabel step={currentStep} totalSteps={totalSteps} />
      )}
    </div>
  );
};

const StepLabel = ({ step, totalSteps }: { step: number; totalSteps: number }) => {
  const labels: Record<number, { top: string; left: string; text: string }> = {
    1: { top: "58px", left: "calc(100% - 200px)", text: "点击此按钮" },
    2: { top: "140px", left: "50px", text: "点击此帖子" },
    3: { top: "255px", left: "120px", text: "点击评论" },
    4: { top: "140px", left: "calc(100% - 300px)", text: "点击此卡片" },
    5: { top: "140px", left: "calc(100% - 300px)", text: "查看数据分析" },
    6: { top: "140px", left: "calc(100% - 300px)", text: "完成引导" },
  };

  const label = labels[step] || labels[4];
  if (!label) return null;

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute z-20 px-4 py-2 bg-white text-[#007AFF] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#007AFF]/20 text-[12px] font-bold flex items-center gap-2 whitespace-nowrap"
      style={{ top: label.top, left: label.left }}
    >
      <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-pulse" />
      {label.text}
    </motion.div>
  );
};
