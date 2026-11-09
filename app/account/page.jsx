'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/cart';
import { IconHeart, IconShoppingBag, IconUser, IconLogOut } from '../../components/Icons';
import { formatBDT } from '../../components/ProductCard';
export default function AccountPage() {
  const { user, logoutUser, favs, items } = useCart();
  const [orders, setOrders] = useState([]);
  useEffect(() => { if (user?.phone) fetch('/api/orders?phone=' + encodeURIComponent(user.phone)).then(r => r.json()).then(setOrders).catch(() => {}); }, [user]);
  if (!user) return (<div className="max-w-md mx-auto px-4 py-16 text-center"><h1 className="font-serif text-3xl font-bold">My Account</h1><p className="text-gray-500 mt-2">Please log in to see your account.</p><Link href="/login" className="inline-block bg-maroon text-white font-bold px-6 py-3 rounded-full mt-6">Login</Link></div>);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center flex-wrap gap-3"><h1 className="font-serif text-3xl font-bold flex items-center gap-2"><IconUser size={28} /> {user.name}</h1><button onClick={logoutUser} className="border border-maroon text-maroon font-semibold px-4 py-2 rounded-full text-sm flex items-center gap-1.5"><IconLogOut size={16} /> Logout</button></div>
      <p className="text-gray-500 text-sm mt-1">{user.email} · {user.phone}</p>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Link href="/favorites" className="bg-white rounded-xl shadow p-5"><p className="flex items-center gap-2 font-bold"><IconHeart size={18} className="text-red-600" /> Favourites</p><p className="text-2xl font-bold mt-2">{favs.length}</p></Link>
        <Link href="/cart" className="bg-white rounded-xl shadow p-5"><p className="flex items-center gap-2 font-bold"><IconShoppingBag size={18} /> In My Bag</p><p className="text-2xl font-bold mt-2">{items.length} item(s)</p></Link>
        <div className="bg-white rounded-xl shadow p-5"><p className="font-bold">My Orders</p><p className="text-2xl font-bold mt-2">{orders.length}</p><p className="text-sm text-gray-500">{orders.filter(o => o.status === 'Delivered').length} delivered — {orders.filter(o => o.status === 'Delivered').length >= 2 ? 'you are a regular buyer' : 'regular buyer after 2 delivered orders'}</p></div>
      </div>
      <h2 className="font-bold text-xl mt-8">Recent Orders</h2>
      {orders.length === 0 ? <p className="text-gray-500 mt-2">No orders yet.</p> : <div className="space-y-3 mt-3">{orders.slice(0, 5).map(o => (<div key={o.id} className="bg-white rounded-xl shadow p-4 flex justify-between flex-wrap gap-2"><span className="font-semibold">{o.id}</span><span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span><span className="font-bold text-maroon">{formatBDT(o.total)}</span><span className="bg-maroon-soft text-maroon text-xs font-bold px-3 py-1 rounded-full">{o.status}</span></div>))}</div>}
    </div>
  );
}
