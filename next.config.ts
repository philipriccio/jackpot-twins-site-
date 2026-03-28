import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.140', 'localhost'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
