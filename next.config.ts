import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 重写配置用于本地开发时的 API 代理
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: '/api/proxy/:path*',
      },
    ];
  },

  // 环境变量配置
  env: {
    PROXY_TARGET_URL: process.env.PROXY_TARGET_URL,
    PROXY_API_KEY: process.env.PROXY_API_KEY,
  },

  // 图片优化配置（Cloudflare Workers 限制）
  images: {
    unoptimized: true,
  },

  // 输出配置
  output: 'standalone',
  
  // 禁用 x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
