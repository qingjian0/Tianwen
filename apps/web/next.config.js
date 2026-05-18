/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tianwen/chrono-engine', '@tianwen/meihua', '@tianwen/liuyao', '@tianwen/qimen', '@tianwen/metaphysics-types', '@tianwen/ui']
};

module.exports = nextConfig;
