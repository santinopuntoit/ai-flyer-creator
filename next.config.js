/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    REPLICATE_API_URL: 'https://api.replicate.com/v1',
  },
};

module.exports = nextConfig;