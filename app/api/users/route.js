import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readJson, writeJson } from '../../../lib/store';
function pub(u) { const { passwordHash, ...rest } = u; return rest; }
function hash(pw) { return crypto.createHash('sha256').update(String(pw)).digest('hex'); }
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const users = readJson('users.json');
  const email = searchParams.get('email');
  if (email) { const u = users.find(x => x.email.toLowerCase() === email.toLowerCase()); return NextResponse.json(u ? pub(u) : { error: 'User not found.' }, { status: u ? 200 : 404 }); }
  return NextResponse.json(users.map(pub));
}
export async function POST(req) {
  const b = await req.json();
  const users = readJson('users.json');
  if (b.action === 'login') {
    const u = users.find(x => x.email.toLowerCase() === String(b.email || '').trim().toLowerCase());
    if (!u || u.passwordHash !== hash(b.password || '')) return NextResponse.json({ error: 'Wrong email or password.' }, { status: 401 });
    const token = crypto.randomBytes(16).toString('hex');
    return NextResponse.json({ ...pub(u), token });
  }
  // signup
  const name = String(b.name || '').trim(), email = String(b.email || '').trim().toLowerCase(), phone = String(b.phone || '').trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 });
  if (!/^01[3-9]\d{8}$/.test(phone)) return NextResponse.json({ error: 'Please enter a valid 11-digit BD phone number (01XXXXXXXXX).' }, { status: 400 });
  if (!b.password || String(b.password).length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  if (users.find(x => x.email === email)) return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 400 });
  const u = { id: 'u-' + Date.now().toString(36), name, email, phone, passwordHash: hash(b.password), createdAt: new Date().toISOString() };
  users.push(u); writeJson('users.json', users);
  const token = crypto.randomBytes(16).toString('hex');
  return NextResponse.json({ ...pub(u), token }, { status: 201 });
}
