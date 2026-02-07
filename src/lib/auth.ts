import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'foifrit';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pknu1308!';

export async function verifyLogin(username: string, password: string): Promise<boolean> {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

export async function setSession() {
  const cookieStore = await cookies();
  // NAS 등 http 로컬에서는 secure: false (브라우저가 http에서 Secure 쿠키를 안 보냄)
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.VERCEL === '1',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

