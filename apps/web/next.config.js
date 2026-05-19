/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@tianwen/shared',
    '@tianwen/ui',
    '@tianwen/prompts',
    '@tianwen/animations',
    '@tianwen/chrono-engine',
    '@tianwen/meihua',
    '@tianwen/liuyao',
    '@tianwen/qimen',
    '@tianwen/metaphysics-types'
  ]
};

module.exports = nextConfig;
