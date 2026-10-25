/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/entrance', destination: '/pyqs', permanent: true }];
  },
  swcMinify: true,
  // Fallback to Babel if SWC fails
  experimental: {
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig
