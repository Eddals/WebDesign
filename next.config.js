/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'devtone.agency', 'www.devtone.agency'],
  },
}

module.exports = nextConfig