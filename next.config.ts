import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 修复工作区根目录警告
  experimental: {
    turbopack: {
      resolveAlias: {
        // 确保使用正确的根目录
      },
    },
  },
};

export default nextConfig;
