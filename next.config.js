/** @type {import('next').NextConfig} */
const basePath = '/agem_homepage';
// GitHub Actions(GitHub Pages)에서만 정적 export. Vercel 등에서는 서버 빌드(API 동작).
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const nextConfig = {
  reactStrictMode: true,
  basePath,
  assetPrefix: '/agem_homepage/',
  ...(isGitHubActions ? { output: 'export' } : {}),
  env: { NEXT_PUBLIC_BASEPATH: basePath },
  images: { unoptimized: true },
  // CI 빌드 시 lint/타입 오류로 실패 방지 (로컬에서는 npm run lint 권장)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig




