import { NextResponse } from 'next/server';
import { readJson, writeJson } from '../../../lib/store';
// activity.json: { userId: { cart: [...], favorites: [...], updatedAt } }
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const all = readJson('activity.json', {});
  const userId = searchParams.get('userId');
  if (userId) return NextResponse.json(all[userId] || { cart: [], favorites: [] });
  return NextResponse.json(all);
}
export async function POST(req) {
  const b = await req.json();
  if (!b.userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
  const all = readJson('activity.json', {});
  const prev = all[b.userId] || { cart: [], favorites: [] };
  all[b.userId] = {
    cart: Array.isArray(b.cart) ? b.cart : prev.cart,
    favorites: Array.isArray(b.favorites) ? b.favorites : prev.favorites,
    updatedAt: new Date().toISOString(),
  };
  writeJson('activity.json', all);
  return NextResponse.json(all[b.userId]);
}
