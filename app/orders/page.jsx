'use client';
import { useState } from 'react';
import OrderTimeline from '../../components/OrderTimeline';
import Link from 'next/link';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
export default function OrdersPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState('');
  async function lookup(e) {
    e.preventDefault(); setErr('');
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) { setErr('Enter a valid 11-digit BD phone number (01XXXXXXXXX).'); return; }
    const r = await fetch('/api/orders?phone=' + encodeURIComponent(phone.trim()));
    const list = await r.json(); setOrders(list);
    if (list.length === 0) setErr('No orders found for this phone number.');
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">Track My Order</h1>
      <p className="text-gray-500 text-sm mt-1">Enter the phone number you used at checkout.</p>
      <form onSubmit={lookup} className="flex gap-2 mt-5 max-w-md"><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" inputMode="tel" className="border rounded-lg px-3 py-2.5 flex-1" /><button className="bg-maroon text-white font-bold px-5 rounded-lg">Search</button></form>
      {err && <p className="text-red-600 text-sm mt-3 font-semibold">{err}</p>}
      <div className="space-y-4 mt-6">
        {orders && orders.map(o => (
          <div key={o.id} className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between flex-wrap gap-2"><p className="font-bold">{o.id}</p><span className="bg-maroon-soft text-maroon text-xs font-bold px-3 py-1 rounded-full">{o.status}</span></div>
            <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()} · {o.paymentMethod}{o.trxId ? ' · TrxID: ' + o.trxId : ''}</p>
            <ul className="text-sm mt-2 list-disc pl-5">{o.items.map((i, idx) => <li key={idx}>{i.name} × {i.qty} — {formatBDT(i.price * i.qty)}</li>)}</ul>
            <OrderTimeline status={o.status} history={o.statusHistory || []} />
            <p className="font-bold text-maroon mt-3">Total: {formatBDT(o.total)}</p>
            <Link href={'/order-success?orderId=' + encodeURIComponent(o.id)} className="text-sm text-maroon underline">View invoice →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
