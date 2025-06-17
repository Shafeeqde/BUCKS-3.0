
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Changed to false for stricter builds
  },
  eslint: {
    ignoreDuringBuilds: false, // Changed to false for stricter builds
  },
  images: {
    domains: ['placehold.co', 'source.unsplash.com', 'images.unsplash.com'], // Added domains for fallback
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
        pathname: '/**', // This will cover /random/ and direct paths
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

    
