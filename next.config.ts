import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_URL: "https://jackpottwins.ca",
  },
  allowedDevOrigins: ['192.168.1.140', 'localhost'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
