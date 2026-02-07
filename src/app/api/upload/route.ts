import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

/** 한글·공백·괄호 등 특수문자가 있으면 true (저장 시 영문 파일명으로 대체하기 위함) */
function hasUnsafeFilename(name: string): boolean {
  return /[^\x00-\x7F]/.test(name) || /[\s()[\]{}~!@#$%^&*+=\\|;:'",<>?]/.test(name);
}

/** 저장용 파일명: 한글/특수문자 있으면 타임스탬프-랜덤.확장자(영문), 아니면 타임스탬프-영문파일명.확장자 */
function getSaveFilename(originalName: string, timestamp: number): string {
  const ext = path.extname(originalName)?.toLowerCase() || '.jpg';
  const randomPart = Math.random().toString(36).slice(2, 10);
  if (hasUnsafeFilename(originalName)) {
    return `${timestamp}-${randomPart}${ext}`;
  }
  const base = path.basename(originalName, path.extname(originalName)) || 'image';
  const safeBase = base.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';
  return `${timestamp}-${safeBase}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const safeFilename = getSaveFilename(file.name, timestamp);

    // Vercel: Blob 사용 시 영구 저장
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${safeFilename}`, buffer, {
        access: 'public',
        addRandomSuffix: false,
      });
      return NextResponse.json({
        success: true,
        url: blob.url,
      });
    }

    // Vercel인데 Blob 없음: 디스크 쓰기 불가
    if (process.env.VERCEL === '1') {
      return NextResponse.json(
        {
          error:
            '배포 사이트에서는 이미지 업로드가 되지 않습니다. 로컬에서 이미지를 public/uploads에 넣고 Git에 푸시해 주세요.',
        },
        { status: 500 }
      );
    }

    // 로컬/NAS: public/uploads (basePath 포함 경로 반환 → 화면/저장 시 동일 경로 사용)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    const filepath = path.join(uploadsDir, safeFilename);
    await writeFile(filepath, buffer);

    const basePath = process.env.NEXT_PUBLIC_BASEPATH || '/agem_homepage';
    const urlPath = `${basePath.replace(/\/$/, '')}/uploads/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: urlPath,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
