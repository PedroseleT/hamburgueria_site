import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Isso ignora os erros de lint durante o build na Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Isso permite o build mesmo se houver avisos de tipos
    ignoreBuildErrors: true, 
  },
  // # ALTERAÇÃO SOLICITADA: Adição de cabeçalhos de segurança avançados (Escudo Externo)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://sdk.mercadopago.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" }
        ],
      },
    ];
  },
};

export default nextConfig;