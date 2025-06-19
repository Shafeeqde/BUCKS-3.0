
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
    domains: ['placehold.co', 'source.unsplash.com', 'images.unsplash.com', 'api.qrserver.com'], // Added api.qrserver.com
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
      { // Added for QR code generation
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
};

export default nextConfig;

    
