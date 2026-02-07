import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = await cookies();
  // 로그인 시 path: '/' 로 설정했으므로 동일 path로 삭제해야 브라우저에서 제거됨
  cookieStore.set('admin_session', '', { maxAge: 0, path: '/' });
  return NextResponse.json({ success: true });
}

