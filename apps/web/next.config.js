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
    '@tianwen/metaphysics-types',
    '@tianwen/liuren',
    '@tianwen/xiaochengtu',
    '@tianwen/huangji',
    '@tianwen/cegui',
    '@tianwen/huangli',
    '@tianwen/pipeline',
    '@tianwen/rule-engine-core',
    '@tianwen/interpretation-engine'
  ]
};

module.exports = nextConfig;
