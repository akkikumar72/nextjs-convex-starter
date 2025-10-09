import type { NextConfig } from "next";

// Disable webpack build worker processes to avoid EPERM errors in restricted
// environments where process signals (kill) are not permitted (e.g. certain CI
// sandboxes). Next.js defaults to using a separate build worker when no custom
// webpack config is present. Explicitly turning this off keeps the build in the
// main process.
const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
