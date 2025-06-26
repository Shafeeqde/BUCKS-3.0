
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  webpack: (config, { isServer }) => {
    // For server-side builds, tell webpack to treat 'firebase-admin' as an external package.
    // This prevents it from being bundled, which is the source of the error.
    if (isServer) {
      // This is a more robust way to handle this, as config.externals might be undefined.
      config.externals = [...(config.externals || []), 'firebase-admin'];
    }
    // Important: return the modified config
    return config;
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
};

export default nextConfig;
