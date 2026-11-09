import { NextResponse } from 'next/server';
import { validateCoupon } from '../../../../lib/server-coupons';
export async function POST(req) {
  const b = await req.json();
  const r = validateCoupon(b.code, b.user || null);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 403 });
  return NextResponse.json({ coupon: r.coupon });
}
