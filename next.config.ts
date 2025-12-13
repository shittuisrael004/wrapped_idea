import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // 1. Force Webpack to ignore these modules
    // 'tap' and 'why-is-node-running' are the specific ones causing your current error
    config.externals.push(
      'pino-pretty', 
      'lokijs', 
      'encoding', 
      'tap', 
      'why-is-node-running'
    );

    // 2. Polyfill Node.js modules for the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;