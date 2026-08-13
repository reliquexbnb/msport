import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // jsdom pulls in dynamic requires that don't survive bundling into a
  // serverless function. Keep it external and load it lazily (see lib/extract).
  serverExternalPackages: ["jsdom", "@mozilla/readability"],
};

export default nextConfig;
