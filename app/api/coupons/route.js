import { NextResponse } from 'next/server';
import { readJson, writeJson } from '../../../lib/store';
export async function GET() { return NextResponse.json(readJson('coupons.json')); }
export async function POST(req) {
  const b = await req.json();
  if (!b.code || !b.discountPercent) return NextResponse.json({ error: 'Code and discount % are required.' }, { status: 400 });
  const list = readJson('coupons.json');
  if (list.find(c => c.code === b.code.toUpperCase())) return NextResponse.json({ error: 'Coupon already exists.' }, { status: 400 });
  const c = { code: b.code.toUpperCase(), discountPercent: Number(b.discountPercent), minOrder: Number(b.minOrder || 0), active: true };
  list.push(c); writeJson('coupons.json', list);
  return NextResponse.json(c, { status: 201 });
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  writeJson('coupons.json', readJson('coupons.json').filter(c => c.code !== searchParams.get('code')));
  return NextResponse.json({ ok: true });
}
