/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Tell Next.js where to find the pages
  distDir: '.next',
  // Set the source directory
  dir: './src',
};

module.exports = nextConfig;