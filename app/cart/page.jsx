'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/cart';
import ProductImage from '../../components/ProductImage';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
export default function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [cmsg, setCmsg] = useState('');
  async function applyCoupon() {
    setCmsg('');
    const r = await fetch('/api/coupons'); const list = await r.json();
    const c = list.find(x => x.code === code.trim().toUpperCase() && x.active);
    if (!c) { setCmsg('Invalid coupon code.'); setCoupon(null); return; }
    if (subtotal < (c.minOrder || 0)) { setCmsg('This coupon needs minimum order ' + formatBDT(c.minOrder) + '.'); setCoupon(null); return; }
    setCoupon(c); setCmsg('Coupon applied: ' + c.discountPercent + '% off ✓');
  }
  const discount = coupon ? Math.round(subtotal * coupon.discountPercent / 100) : 0;
  const shipping = subtotal === 0 ? 0 : (subtotal - discount >= 3000 ? 0 : 60);
  if (items.length === 0) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><h1 className="font-serif text-3xl font-bold">Your cart is empty</h1><p className="text-gray-500 mt-2">Add a beautiful bag first.</p><Link href="/shop" className="inline-block bg-maroon text-white font-bold px-6 py-3 rounded-full mt-6">Shop Bags →</Link></div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Your Cart ({items.length} item(s))</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-4">
          {items.map(i => (
            <div key={i.key} className="bg-white rounded-xl shadow p-4 flex gap-4">
              <ProductImage src={i.image} alt={i.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <Link href={'/product/' + i.slug} className="font-semibold hover:text-maroon">{i.name}</Link>
                <p className="text-sm text-gray-500">Colour: {i.color} · {formatBDT(i.price)} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setQty(i.key, i.qty - 1)} className="w-8 h-8 border rounded-lg">−</button>
                  <span className="font-bold w-6 text-center">{i.qty}</span>
                  <button onClick={() => setQty(i.key, i.qty + 1)} className="w-8 h-8 border rounded-lg">+</button>
                  <button onClick={() => remove(i.key)} className="text-red-600 text-sm ml-3 underline">Remove</button>
                </div>
              </div>
              <p className="font-bold text-maroon">{formatBDT(i.price * i.qty)}</p>
            </div>
          ))}
          <button onClick={clear} className="text-sm text-gray-500 underline">Clear cart</button>
        </div>
        <div className="bg-white rounded-xl shadow p-5 h-fit">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="flex gap-2 mt-4"><input value={code} onChange={e => setCode(e.target.value)} placeholder="Coupon code (WELCOME10)" className="border rounded-lg px-3 py-2 flex-1 uppercase" /><button onClick={applyCoupon} className="bg-black text-white px-4 rounded-lg text-sm font-semibold">Apply</button></div>
          {cmsg && <p className={'text-sm mt-2 ' + (coupon ? 'text-green-700' : 'text-red-600')}>{cmsg}</p>}
          <p className="text-xs text-gray-400 mt-2">Try: WELCOME10 (10% off) or SABRINA15 (15% off over ৳2,000).</p>
          <div className="border-t mt-4 pt-3 space-y-2 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><span>{formatBDT(subtotal)}</span></p>
            {discount > 0 && <p className="flex justify-between text-green-700"><span>Discount ({coupon.code})</span><span>−{formatBDT(discount)}</span></p>}
            <p className="flex justify-between"><span>Shipping (Dhaka, est.)</span><span>{shipping === 0 ? 'FREE' : formatBDT(shipping)}</span></p>
            <p className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-maroon">{formatBDT(subtotal - discount + shipping)}</span></p>
          </div>
          <Link href="/checkout" className="block text-center bg-maroon text-white font-bold py-3 rounded-full mt-4">Proceed to Checkout →</Link>
          <Link href="/shop" className="block text-center text-sm text-maroon mt-3 underline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
