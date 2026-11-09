'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/cart';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
export default function CheckoutPage() {
  const { items, subtotal, clear, user } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', area: 'inside', payment: 'Cash on Delivery', trxId: '' });
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { try { const c = JSON.parse(localStorage.getItem('tos-coupon') || 'null'); if (c) { setCoupon(c); setCouponCode(c.code); } } catch {} }, []);
  useEffect(() => { if (user) setForm(f => ({ ...f, name: f.name || user.name || '', phone: f.phone || user.phone || '' })); }, [user]);
  const discount = coupon ? Math.round(subtotal * coupon.discountPercent / 100) : 0;
  const shipping = subtotal === 0 ? 0 : (subtotal - discount >= 3000 ? 0 : (form.area === 'outside' ? 120 : 60));
  const total = subtotal - discount + shipping;
  async function applyCoupon() {
    const r = await fetch('/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: couponCode, user: user || null }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Invalid coupon code.'); setCoupon(null); return; }
    const c = d.coupon;
    if (subtotal < (c.minOrder || 0)) { setErr('Coupon needs minimum order ' + formatBDT(c.minOrder) + '.'); return; }
    setCoupon(c); localStorage.setItem('tos-coupon', JSON.stringify(c)); setErr('');
  }
  async function placeOrder(e) {
    e.preventDefault(); setErr('');
    if (items.length === 0) { setErr('Your cart is empty.'); return; }
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim())) { setErr('Please enter a valid 11-digit BD phone number (01XXXXXXXXX).'); return; }
    if ((form.payment === 'bKash' || form.payment === 'Nagad') && !form.trxId.trim()) { setErr('TrxID is required for ' + form.payment + ' payment.'); return; }
    setBusy(true);
    const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: user ? { id: user.id, email: user.email, phone: user.phone } : null, customer: { name: form.name, phone: form.phone.trim(), address: form.address, city: form.city, email: user?.email || '' }, items: items.map(i => ({ slug: i.slug, qty: i.qty, color: i.color })), deliveryArea: form.area, paymentMethod: form.payment, trxId: form.trxId.trim(), couponCode: coupon ? coupon.code : '' }) });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(d.error || 'Order failed. Please try again.'); return; }
    localStorage.removeItem('tos-coupon');
    clear();
    router.push('/order-success?orderId=' + encodeURIComponent(d.id));
  }
  if (items.length === 0) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><h1 className="font-serif text-3xl font-bold">Nothing to checkout</h1><p className="text-gray-500 mt-2">Your cart is empty.</p><Link href="/shop" className="inline-block bg-maroon text-white font-bold px-6 py-3 rounded-full mt-6">Shop Bags →</Link></div>;
  const set = (k, v) => setForm({ ...form, [k]: v });
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Checkout</h1>
      <form onSubmit={placeOrder} className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-bold text-lg">1. Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name *" className="border rounded-lg px-3 py-2.5 w-full" />
              <input required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Phone — 01XXXXXXXXX *" inputMode="tel" className="border rounded-lg px-3 py-2.5 w-full" />
              <input required value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address (house, road, area) *" className="border rounded-lg px-3 py-2.5 w-full sm:col-span-2" />
              <input required value={form.city} onChange={e => set('city', e.target.value)} placeholder="District / City *" className="border rounded-lg px-3 py-2.5 w-full" />
              <select value={form.area} onChange={e => set('area', e.target.value)} className="border rounded-lg px-3 py-2.5 w-full">
                <option value="inside">Inside Dhaka — ৳60</option><option value="outside">Outside Dhaka — ৳120</option>
              </select>
            </div>
            <p className="text-xs text-gray-400 mt-2">Free delivery on orders over ৳3,000 (after discount).</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-bold text-lg">2. Payment Method</h2>
            <div className="space-y-2 mt-3">
              {['Cash on Delivery', 'bKash', 'Nagad'].map(m => (
                <label key={m} className={'flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ' + (form.payment === m ? 'border-maroon bg-maroon-soft' : '')}>
                  <input type="radio" name="payment" checked={form.payment === m} onChange={() => set('payment', m)} />
                  <span className="font-semibold">{m}</span>
                  <span className="text-sm text-gray-500">{m === 'Cash on Delivery' ? '— Pay when you receive the bag' : m === 'bKash' ? '— Send Money, then enter TrxID below' : '— Send Money, then enter TrxID below'}</span>
                </label>
              ))}
            </div>
            {(form.payment === 'bKash' || form.payment === 'Nagad') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3 text-sm">
                <p>Send <b>{formatBDT(total)}</b> to <b>[{form.payment} number — Siam to replace]</b> via Send Money.</p>
                <input value={form.trxId} onChange={e => set('trxId', e.target.value)} placeholder="Enter TrxID *" className="border rounded-lg px-3 py-2.5 w-full mt-2 bg-white" />
                <p className="text-xs text-gray-500 mt-1">Your order will be confirmed after the TrxID is verified by the shop.</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 h-fit">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="space-y-2 mt-3 text-sm">{items.map(i => <p key={i.key} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{formatBDT(i.price * i.qty)}</span></p>)}</div>
          <div className="flex gap-2 mt-4"><input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon code" className="border rounded-lg px-3 py-2 flex-1 uppercase" /><button type="button" onClick={applyCoupon} className="bg-black text-white px-4 rounded-lg text-sm font-semibold">Apply</button></div>
          {coupon && <p className="text-green-700 text-sm mt-2">Coupon {coupon.code} applied: {coupon.discountPercent}% off ✓</p>}
          <div className="border-t mt-4 pt-3 space-y-2 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><span>{formatBDT(subtotal)}</span></p>
            {discount > 0 && <p className="flex justify-between text-green-700"><span>Discount</span><span>−{formatBDT(discount)}</span></p>}
            <p className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatBDT(shipping)}</span></p>
            <p className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-maroon">{formatBDT(total)}</span></p>
          </div>
          {err && <p className="text-red-600 text-sm mt-3 font-semibold">{err}</p>}
          <button disabled={busy} className="w-full bg-maroon text-white font-bold py-3 rounded-full mt-4 disabled:bg-gray-300">{busy ? 'Placing order...' : 'Place Order • ' + formatBDT(total)}</button>
          <p className="text-xs text-gray-400 text-center mt-2">By placing this order you agree to delivery &amp; payment terms.</p>
        </div>
      </form>
    </div>
  );
}
