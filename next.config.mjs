/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  enablePrerenderSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;
