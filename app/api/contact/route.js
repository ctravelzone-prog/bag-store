import { NextResponse } from 'next/server';
import { readJson, writeJson } from '../../../lib/store';
export async function GET() { return NextResponse.json(readJson('messages.json')); }
export async function POST(req) {
  const b = await req.json();
  const name = String(b.name || '').trim(), email = String(b.email || '').trim(), message = String(b.message || '').trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) return NextResponse.json({ error: 'Please write your name, a valid email and a message.' }, { status: 400 });
  const list = readJson('messages.json');
  const m = { id: 'msg-' + Date.now().toString(36), name, email, phone: String(b.phone || '').trim(), message, createdAt: new Date().toISOString() };
  list.push(m); writeJson('messages.json', list);
  return NextResponse.json(m, { status: 201 });
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  writeJson('messages.json', readJson('messages.json').filter(m => m.id !== searchParams.get('id')));
  return NextResponse.json({ ok: true });
}
