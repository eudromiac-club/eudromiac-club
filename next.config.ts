import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // El form de REPROCANN sube un PDF/imagen del comprobante.
      // Default de Next es 1MB, que es chico para escaneos legibles.
      // Mi uploadFile() ya valida 8MB max contra Blob.
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
