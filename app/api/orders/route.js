import { NextResponse } from 'next/server';
import { readJson, writeJson, shippingFor } from '../../../lib/store';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const list = readJson('orders.json');
  return NextResponse.json(phone ? list.filter(o => o.customer.phone === phone) : list);
}
export async function POST(req) {
  const b = await req.json();
  const phoneOk = /^01[3-9]\d{8}$/.test(String(b?.customer?.phone || ''));
  if (!b?.customer?.name || !phoneOk || !b?.customer?.address || !b?.customer?.city || !Array.isArray(b.items) || b.items.length === 0) {
    return NextResponse.json({ error: 'Name, valid 11-digit BD phone (01XXXXXXXXX), address, city and at least one item are required.' }, { status: 400 });
  }
  if ((b.paymentMethod === 'bKash' || b.paymentMethod === 'Nagad') && !b.trxId) return NextResponse.json({ error: 'TrxID is required for bKash / Nagad payment.' }, { status: 400 });
  const products = readJson('products.json');
  let subtotal = 0; const items = [];
  for (const it of b.items) {
    const p = products.find(x => x.slug === it.slug);
    if (!p) return NextResponse.json({ error: 'Product not found: ' + it.slug }, { status: 400 });
    if (p.stock < it.qty) return NextResponse.json({ error: p.name + ' is out of stock (only ' + p.stock + ' left).' }, { status: 400 });
    subtotal += p.price * it.qty; items.push({ slug: p.slug, name: p.name, price: p.price, image: p.image, color: it.color || '', qty: it.qty });
  }
  let discount = 0;
  if (b.couponCode) {
    const c = readJson('coupons.json').find(x => x.code === b.couponCode && x.active);
    if (!c) return NextResponse.json({ error: 'Invalid coupon code.' }, { status: 400 });
    if (subtotal < (c.minOrder || 0)) return NextResponse.json({ error: 'Coupon needs minimum order ৳' + c.minOrder + '.' }, { status: 400 });
    discount = Math.round(subtotal * c.discountPercent / 100);
  }
  const shipping = shippingFor(b.deliveryArea || 'inside', subtotal - discount);
  const total = subtotal - discount + shipping;
  // decrement stock
  for (const it of items) { const p = products.find(x => x.slug === it.slug); p.stock -= it.qty; }
  writeJson('products.json', products);
  const orders = readJson('orders.json');
  const order = { id: 'TOS-' + String(orders.length + 1).padStart(4, '0') + '-' + Date.now().toString().slice(-4), customer: b.customer, items, subtotal, discount, couponCode: b.couponCode || '', shipping, total, deliveryArea: b.deliveryArea || 'inside', paymentMethod: b.paymentMethod || 'Cash on Delivery', trxId: b.trxId || '', status: 'Pending', createdAt: new Date().toISOString() };
  orders.push(order); writeJson('orders.json', orders);
  return NextResponse.json(order, { status: 201 });
}
export async function PATCH(req) {
  const b = await req.json();
  const list = readJson('orders.json');
  const o = list.find(x => x.id === b.id);
  if (!o) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  if (!['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(b.status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  o.status = b.status; writeJson('orders.json', list);
  return NextResponse.json(o);
}
