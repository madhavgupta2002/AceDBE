/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Fallback to Babel if SWC fails
  experimental: {
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig
