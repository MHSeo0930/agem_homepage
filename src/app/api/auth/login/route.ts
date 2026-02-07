import { NextRequest, NextResponse } from 'next/server';
import { verifyLogin } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = await verifyLogin(username, password);
    
    if (isValid) {
      const cookieStore = await cookies();
      // NAS 등 http 로컬에서는 secure: false (Vercel에서만 HTTPS이므로 Secure 쿠키 사용)
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.VERCEL === '1',
        path: '/',
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
