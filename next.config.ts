import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Move turbo config to turbopack as it's now stable
  turbopack: {
    rules: {
      '*.scss': {
        loaders: ['sass-loader'],
        as: '*.css',
      },
    },
  },
};

export default withNextIntl(nextConfig);
