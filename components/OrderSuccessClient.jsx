'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
export default function OrderSuccessClient() {
  const sp = useSearchParams();
  const orderId = sp.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch('/api/orders').then(r => r.json()).then(list => { setOrder(list.find(o => o.id === orderId) || null); setLoading(false); });
  }, [orderId]);
  if (loading) return <p className="text-center py-16">Loading your order...</p>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><h1 className="font-serif text-3xl font-bold">Order not found</h1><p className="text-gray-500 mt-2">Please check your order number or track by phone.</p><Link href="/orders" className="inline-block bg-maroon text-white font-bold px-6 py-3 rounded-full mt-6">Track Order</Link></div>;
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center"><p className="text-5xl">✅</p><h1 className="font-serif text-3xl font-bold mt-2">Thank you, {order.customer.name}!</h1><p className="text-gray-600 mt-1">Your order <b>{order.id}</b> is placed. We will call you soon to confirm.</p></div>
      <div className="bg-white rounded-xl shadow p-6 mt-8" id="invoice">
        <div className="flex justify-between border-b pb-4"><div><h2 className="font-serif text-2xl font-bold">Touch of <span className="text-gold">Sabrina</span></h2><p className="text-sm text-gray-500">Luxury Women&apos;s Bags</p></div><div className="text-right text-sm"><p className="font-bold">INVOICE</p><p>Order: {order.id}</p><p>Date: {new Date(order.createdAt).toLocaleString()}</p><p>Status: {order.status}</p></div></div>
        <div className="grid sm:grid-cols-2 gap-4 py-4 text-sm border-b"><div><p className="font-semibold">Deliver to</p><p>{order.customer.name}</p><p>{order.customer.phone}</p><p>{order.customer.address}, {order.customer.city}</p></div><div><p className="font-semibold">Payment</p><p>{order.paymentMethod}{order.trxId ? ' — TrxID: ' + order.trxId : ''}</p><p>Delivery: {order.deliveryArea === 'outside' ? 'Outside Dhaka' : 'Inside Dhaka'}</p></div></div>
        <table className="w-full text-sm mt-4"><thead><tr className="text-left border-b"><th className="py-2">Item</th><th>Qty</th><th className="text-right">Price</th><th className="text-right">Total</th></tr></thead><tbody>{order.items.map((i, idx) => <tr key={idx} className="border-b"><td className="py-2">{i.name} {i.color ? '(' + i.color + ')' : ''}</td><td>{i.qty}</td><td className="text-right">{formatBDT(i.price)}</td><td className="text-right">{formatBDT(i.price * i.qty)}</td></tr>)}</tbody></table>
        <div className="text-sm space-y-1 mt-4 text-right"><p>Subtotal: {formatBDT(order.subtotal)}</p>{order.discount > 0 && <p className="text-green-700">Discount{order.couponCode ? ' (' + order.couponCode + ')' : ''}: −{formatBDT(order.discount)}</p>}<p>Shipping: {order.shipping === 0 ? 'FREE' : formatBDT(order.shipping)}</p><p className="font-bold text-lg text-maroon">Total: {formatBDT(order.total)}</p></div>
      </div>
      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        <button onClick={() => window.print()} className="bg-black text-white font-bold px-6 py-3 rounded-full">🖨 Print Invoice</button>
        <Link href="/shop" className="bg-maroon text-white font-bold px-6 py-3 rounded-full">Continue Shopping</Link>
        <Link href="/orders" className="border border-maroon text-maroon font-bold px-6 py-3 rounded-full">Track Order</Link>
      </div>
    </div>
  );
}
