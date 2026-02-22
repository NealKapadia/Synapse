import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp', 'onnxruntime-node'],
  turbopack: {}
};

export default nextConfig;
