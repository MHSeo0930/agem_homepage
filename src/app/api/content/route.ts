import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

async function getContent() {
  await ensureDataDir();
  if (existsSync(CONTENT_FILE)) {
    const fileContent = await readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(fileContent);
  }
  return {};
}

async function saveContent(content: any) {
  await ensureDataDir();
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
}

export async function GET() {
  try {
    const content = await getContent();
    return NextResponse.json(content);
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
    const currentContent = await getContent();
    const newContent = { ...currentContent, ...updates };
    
    await saveContent(newContent);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

