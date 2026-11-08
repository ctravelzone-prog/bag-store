import { NextResponse } from 'next/server';
import { readJson, writeJson } from '../../../lib/store';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const list = readJson('reviews.json');
  return NextResponse.json(slug ? list.filter(r => r.slug === slug) : list);
}
export async function POST(req) {
  const b = await req.json();
  if (!b.slug || !b.name || !b.comment || !b.rating) return NextResponse.json({ error: 'Name, rating and comment are required.' }, { status: 400 });
  const list = readJson('reviews.json');
  const r = { id: 'r' + Date.now(), slug: b.slug, name: String(b.name).slice(0, 50), rating: Math.min(5, Math.max(1, Number(b.rating))), comment: String(b.comment).slice(0, 500), date: new Date().toISOString().slice(0, 10) };
  list.push(r); writeJson('reviews.json', list);
  return NextResponse.json(r, { status: 201 });
}
