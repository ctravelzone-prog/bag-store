import { NextResponse } from 'next/server';
import { readJson, writeJson } from '../../../lib/store';
export async function POST(req) {
  const b = await req.json();
  if (!b.email || !/^\S+@\S+\.\S+$/.test(b.email)) return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  const list = readJson('newsletter.json');
  if (!list.find(x => x.email === b.email)) { list.push({ email: b.email, date: new Date().toISOString() }); writeJson('newsletter.json', list); }
  return NextResponse.json({ ok: true });
}
