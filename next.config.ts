import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['192.168.1.140', 'localhost'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
