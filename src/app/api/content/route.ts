import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getContent, saveContent } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getContent();
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const currentContent = (await getContent()) as Record<string, unknown>;
    const newContent = { ...currentContent, ...updates };

    await saveContent(newContent as Record<string, unknown>);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

