/** @type {import('next').NextConfig} */
const basePath = '/agem_homepage';
// GitHub Actions(GitHub Pages)에서만 정적 export. Vercel 등에서는 서버 빌드(API 동작).
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
// 업로드 이미지 서빙 방식: 1이면 정적(/uploads) — Vercel·GitHub Pages. 비우면 API 경로(/api/uploads) — NAS.
// 배포 환경에서 명시적으로 지정 가능(NEXT_PUBLIC_STATIC_UPLOADS=1), 없으면 Vercel/Actions에서 자동 1.
const staticUploads =
  process.env.NEXT_PUBLIC_STATIC_UPLOADS ??
  (process.env.VERCEL === '1' || isGitHubActions ? '1' : '');
const nextConfig = {
  reactStrictMode: true,
  // 배포 스크립트는 NEXT_DIST_DIR=.next-deploy 로 검증 빌드 → 실행 중인 서버의 .next를 건드리지 않음
  distDir: process.env.NEXT_DIST_DIR || '.next',
  basePath,
  assetPrefix: '/agem_homepage/',
  ...(isGitHubActions ? { output: 'export' } : {}),
  env: { NEXT_PUBLIC_BASEPATH: basePath, NEXT_PUBLIC_STATIC_UPLOADS: staticUploads },
  // 서버리스 함수 번들에서 업로드 이미지 제외 (Vercel은 정적 /uploads 로 서빙 → 함수 크기·배포 용량 절감)
  experimental: {
    outputFileTracingExcludes: {
      '/api/uploads/[filename]': ['public/uploads/**'],
      '/api/upload': ['public/uploads/**'],
    },
  },
  images: { unoptimized: true },
  // CI 빌드 시 lint/타입 오류로 실패 방지 (로컬에서는 npm run lint 권장)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig




