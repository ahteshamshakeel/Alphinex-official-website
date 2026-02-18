/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Prevent static generation of API routes during build
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

module.exports = nextConfig;
