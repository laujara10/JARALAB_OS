import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin output: 'export' — Vercel corre Next.js como servidor, no necesita export estático.
  // Sin basePath — las rutas son desde la raíz en Vercel.
  images: { unoptimized: true },
};

export default nextConfig;
