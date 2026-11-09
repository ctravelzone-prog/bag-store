import { NextResponse } from 'next/server';
import { readJson, writeJson, shippingFor } from '../../../lib/store';
import { validateCoupon } from '../../../lib/server-coupons';
export const ORDER_FLOW = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'];
export const ALL_STATUSES = [...ORDER_FLOW, 'Cancelled', 'Returned'];
function timeline(status) { return [{ status: 'Pending', at: new Date().toISOString() }]; }
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const id = searchParams.get('id');
  const list = readJson('orders.json');
  if (id) { const o = list.find(x => x.id === id); return NextResponse.json(o || { error: 'Order not found.' }, { status: o ? 200 : 404 }); }
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
    const user = b.user || null;
    const v = validateCoupon(b.couponCode, user);
    if (!v.ok) return NextResponse.json({ error: v.error }, { status: 403 });
    if (subtotal < (v.coupon.minOrder || 0)) return NextResponse.json({ error: 'Coupon needs minimum order ৳' + v.coupon.minOrder + '.' }, { status: 400 });
    discount = Math.round(subtotal * v.coupon.discountPercent / 100);
  }
  const shipping = shippingFor(b.deliveryArea || 'inside', subtotal - discount);
  const total = subtotal - discount + shipping;
  // NOTE (v2): stock is NOT decremented at placement. It is decremented only when admin Approves the order.
  const orders = readJson('orders.json');
  const now = new Date().toISOString();
  const order = { id: 'TOS-' + String(orders.length + 1).padStart(4, '0') + '-' + Date.now().toString().slice(-4), userId: b.user?.id || null, userEmail: b.user?.email || b.customer.email || '', customer: { ...b.customer, email: b.customer.email || b.user?.email || '' }, items, subtotal, discount, couponCode: b.couponCode || '', shipping, total, deliveryArea: b.deliveryArea || 'inside', paymentMethod: b.paymentMethod || 'Cash on Delivery', trxId: b.trxId || '', status: 'Pending', stockDeducted: false, statusHistory: [{ status: 'Pending', at: now }], createdAt: now };
  orders.push(order); writeJson('orders.json', orders);
  return NextResponse.json(order, { status: 201 });
}
export async function PATCH(req) {
  const b = await req.json();
  const list = readJson('orders.json');
  const o = list.find(x => x.id === b.id);
  if (!o) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  if (!ALL_STATUSES.includes(b.status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  if (o.status === b.status) return NextResponse.json(o);
  if (['Delivered', 'Cancelled', 'Returned'].includes(o.status)) return NextResponse.json({ error: 'This order is already ' + o.status + ' and cannot be changed.' }, { status: 400 });
  const products = readJson('products.json');
  // Approve: decrement stock (only once)
  if (b.status === 'Approved' && !o.stockDeducted) {
    for (const it of o.items) { const p = products.find(x => x.slug === it.slug); if (!p || p.stock < it.qty) return NextResponse.json({ error: (p ? p.name : it.slug) + ' does not have enough stock to approve this order.' }, { status: 400 }); }
    for (const it of o.items) { products.find(x => x.slug === it.slug).stock -= it.qty; }
    o.stockDeducted = true;
    writeJson('products.json', products);
  }
  // Cancel / Return before delivery: restore stock if it was deducted
  if ((b.status === 'Cancelled' || b.status === 'Returned') && o.stockDeducted) {
    for (const it of o.items) { const p = products.find(x => x.slug === it.slug); if (p) p.stock += it.qty; }
    o.stockDeducted = false;
    writeJson('products.json', products);
  }
  o.status = b.status;
  o.statusHistory = [...(o.statusHistory || [{ status: 'Pending', at: o.createdAt }]), { status: b.status, at: new Date().toISOString() }];
  writeJson('orders.json', list);
  return NextResponse.json(o);
}
