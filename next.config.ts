import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Isso ignora os erros de lint durante o build na Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Isso permite o build mesmo se houver avisos de tipos
    ignoreBuildErrors: true, 
  }
};

export default nextConfig;