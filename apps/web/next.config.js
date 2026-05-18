/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tianwen/chrono-engine', '@tianwen/meihua', '@tianwen/liuyao', '@tianwen/qimen']
};

module.exports = nextConfig;
