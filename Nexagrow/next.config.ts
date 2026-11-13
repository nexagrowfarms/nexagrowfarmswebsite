import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'some-other-domain.com',
      'images.unsplash.com',
    ],
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(process.cwd(), 'src'),
    };
    return config;
  },
};

export default nextConfig;
