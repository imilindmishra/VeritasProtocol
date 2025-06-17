/** @type {import('next').NextConfig} */
const nextConfig = {
  
  images: {
    domains: [],
    formats: ["image/webp", "image/avif"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
