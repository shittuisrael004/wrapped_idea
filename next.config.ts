import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Previous ignores
      'tap': false,
      'why-is-node-running': false,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
      '@solana/kit': false,
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };

    return config;
  },
};

export default nextConfig;