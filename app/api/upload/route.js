import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const VIDEO_EXTS = ['.mp4', '.webm', '.mov'];
const IMAGE_MAX = 5 * 1024 * 1024; // 5 MB
const VIDEO_MAX = 20 * 1024 * 1024; // 20 MB — short video only

export async function POST(req) {
  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Could not read the uploaded file. Please try again.' }, { status: 400 });
  }
  const file = form.get('file');
  if (!file || typeof file === 'string' || !file.name) {
    return NextResponse.json({ error: 'No file was uploaded. Please choose a photo or short video.' }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  const isImage = IMAGE_EXTS.includes(ext);
  const isVideo = VIDEO_EXTS.includes(ext);
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'Only photos (JPG, PNG, WebP, GIF) and short videos (MP4, WebM, MOV) are allowed.' }, { status: 400 });
  }
  const max = isImage ? IMAGE_MAX : VIDEO_MAX;
  if (file.size > max) {
    return NextResponse.json({ error: isImage ? 'Photo is too big — maximum 5 MB.' : 'Video is too big — maximum 20 MB (short video only).' }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'The file is empty. Please choose another file.' }, { status: 400 });
  }
  const name = Date.now() + '-' + Math.random().toString(36).slice(2, 10) + ext;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buf);
  // Served via /api/uploads/[name] (see that route): Next.js only serves
  // public/ files that existed at server start, so /uploads/<name> would
  // 404 until the next restart.
  return NextResponse.json({ url: '/api/uploads/' + name });
}
