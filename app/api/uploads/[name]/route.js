import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
};

// Uploads land in public/uploads/ while the server is running, and Next.js
// only serves public/ files that existed when it started — so uploaded
// photos/videos are served through this route instead, which reads the
// file from disk on every request and works immediately after upload.
export async function GET(req, { params }) {
  const { name } = await params;
  const safe = path.basename(String(name || ''));
  const ext = path.extname(safe).toLowerCase();
  if (!safe || safe !== String(name) || !MIME[ext]) {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }
  try {
    const buf = await readFile(path.join(process.cwd(), 'public', 'uploads', safe));
    return new NextResponse(buf, {
      headers: {
        'Content-Type': MIME[ext],
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }
}
