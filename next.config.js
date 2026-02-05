/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages 프로젝트 페이지: https://mhseo0930.github.io/agem_homepage/
  basePath: '/agem_homepage',
  assetPrefix: '/agem_homepage/',
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig




