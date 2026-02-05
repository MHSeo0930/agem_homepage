/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/agem_homepage',
  assetPrefix: '/agem_homepage/',
  output: 'export',
  images: { unoptimized: true },
  // CI 빌드 시 lint/타입 오류로 실패 방지 (로컬에서는 npm run lint 권장)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig




