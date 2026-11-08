'use client';
import { useEffect, useState } from 'react';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginErr, setLoginErr] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(null);
  const [pform, setPform] = useState({ name: '', slug: '', category: 'Handbag', price: '', oldPrice: '', stock: '', description: '', image: '', colors: 'Black' });
  const [cform, setCform] = useState({ code: '', discountPercent: '', minOrder: '' });
  useEffect(() => { if (typeof window !== 'undefined' && localStorage.getItem('tos-admin') === '1') setAuthed(true); }, []);
  async function load() {
    const [p, o, c] = await Promise.all([fetch('/api/products').then(r => r.json()), fetch('/api/orders').then(r => r.json()), fetch('/api/coupons').then(r => r.json())]);
    setProducts(p); setOrders(o); setCoupons(c);
  }
  useEffect(() => { if (authed) load(); }, [authed]);
  function doLogin(e) {
    e.preventDefault();
    if (login.email.trim().toLowerCase() === 'admin@touchofsabrina.local' && login.password === 'admin123') { localStorage.setItem('tos-admin', '1'); setAuthed(true); setLoginErr(''); }
    else setLoginErr('Wrong email or password. Demo: admin@touchofsabrina.local / admin123');
  }
  function logout() { localStorage.removeItem('tos-admin'); setAuthed(false); }
  async function saveProduct(e) {
    e.preventDefault(); setMsg('');
    const payload = { ...pform, price: Number(pform.price), oldPrice: pform.oldPrice ? Number(pform.oldPrice) : null, stock: Number(pform.stock), colors: pform.colors.split(',').map(s => s.trim()).filter(Boolean) };
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...payload, id: editing.id } : payload;
    const r = await fetch('/api/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) { setMsg(d.error || 'Could not save product.'); return; }
    setMsg(editing ? 'Product updated ✓' : 'Product added ✓'); setEditing(null); setPform({ name: '', slug: '', category: 'Handbag', price: '', oldPrice: '', stock: '', description: '', image: '', colors: 'Black' }); load();
  }
  async function delProduct(id) { if (!confirm('Delete this product?')) return; await fetch('/api/products?id=' + id, { method: 'DELETE' }); load(); }
  function editProduct(p) { setEditing(p); setPform({ name: p.name, slug: p.slug, category: p.category, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '', stock: String(p.stock), description: p.description || '', image: p.image || '', colors: (p.colors || []).join(', ') }); setTab('products'); window.scrollTo(0, 0); }
  async function setStatus(id, status) { await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) }); load(); }
  async function addCoupon(e) {
    e.preventDefault();
    const r = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cform) });
    const d = await r.json(); if (!r.ok) { setMsg(d.error); return; }
    setMsg('Coupon added ✓'); setCform({ code: '', discountPercent: '', minOrder: '' }); load();
  }
  async function delCoupon(code) { await fetch('/api/coupons?code=' + code, { method: 'DELETE' }); load(); }
  if (!authed) return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-center">Admin Login</h1>
      <p className="text-center text-sm text-gray-500 mt-1">Touch of Sabrina — shop owner only.</p>
      <form onSubmit={doLogin} className="bg-white rounded-xl shadow p-6 mt-6">
        <input value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} required type="email" placeholder="Email" className="border rounded-lg px-3 py-2.5 w-full" />
        <input value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} required type="password" placeholder="Password" className="border rounded-lg px-3 py-2.5 w-full mt-3" />
        {loginErr && <p className="text-red-600 text-sm mt-3">{loginErr}</p>}
        <button className="w-full bg-maroon text-white font-bold py-3 rounded-full mt-4">Login</button>
        <p className="text-xs text-gray-400 text-center mt-3">Demo login: admin@touchofsabrina.local / admin123<br />Change this password before production use.</p>
      </form>
    </div>
  );
  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const low = products.filter(p => p.stock <= 3);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center flex-wrap gap-3"><h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1><button onClick={logout} className="border border-maroon text-maroon font-semibold px-4 py-2 rounded-full text-sm">Logout</button></div>
      <p className="text-sm text-gray-500 mt-1">All prices/products here are SAMPLE — replace with real prices, photos &amp; payment numbers before launch.</p>
      <div className="flex gap-2 mt-5 flex-wrap">{['dashboard', 'products', 'orders', 'coupons'].map(t => <button key={t} onClick={() => setTab(t)} className={'px-4 py-2 rounded-full font-semibold text-sm capitalize ' + (tab === t ? 'bg-maroon text-white' : 'bg-white border')}>{t}</button>)}</div>
      {msg && <p className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mt-4 text-sm font-semibold">{msg}</p>}
      {tab === 'dashboard' && (
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-maroon">{formatBDT(revenue)}</p></div>
          <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></div>
          <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Products</p><p className="text-2xl font-bold">{products.length}</p></div>
          <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Pending Orders</p><p className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p></div>
          <div className="bg-white rounded-xl shadow p-5 md:col-span-4"><h3 className="font-bold">Low Stock / Out of Stock</h3>{low.length === 0 ? <p className="text-sm text-gray-500 mt-2">All products are well stocked.</p> : <ul className="text-sm mt-2 list-disc pl-5">{low.map(p => <li key={p.id}>{p.name} — {p.stock === 0 ? 'OUT OF STOCK' : p.stock + ' left'}</li>)}</ul>}</div>
        </div>
      )}
      {tab === 'products' && (
        <div className="mt-6">
          <form onSubmit={saveProduct} className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold">{editing ? 'Edit Product: ' + editing.name : 'Add New Product'}</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              <input required value={pform.name} onChange={e => setPform({ ...pform, name: e.target.value })} placeholder="Name *" className="border rounded-lg px-3 py-2" />
              <input required value={pform.slug} onChange={e => setPform({ ...pform, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="slug (e.g. red-bag)" disabled={!!editing} className="border rounded-lg px-3 py-2 disabled:bg-gray-100" />
              <select value={pform.category} onChange={e => setPform({ ...pform, category: e.target.value })} className="border rounded-lg px-3 py-2"><option>Handbag</option><option>Tote</option><option>Shoulder Bag</option><option>Crossbody</option><option>Backpack</option></select>
              <input required type="number" min="0" value={pform.price} onChange={e => setPform({ ...pform, price: e.target.value })} placeholder="Price (৳) *" className="border rounded-lg px-3 py-2" />
              <input type="number" min="0" value={pform.oldPrice} onChange={e => setPform({ ...pform, oldPrice: e.target.value })} placeholder="Old price (optional)" className="border rounded-lg px-3 py-2" />
              <input required type="number" min="0" value={pform.stock} onChange={e => setPform({ ...pform, stock: e.target.value })} placeholder="Stock *" className="border rounded-lg px-3 py-2" />
              <input value={pform.image} onChange={e => setPform({ ...pform, image: e.target.value })} placeholder="Image URL" className="border rounded-lg px-3 py-2 sm:col-span-2" />
              <input value={pform.colors} onChange={e => setPform({ ...pform, colors: e.target.value })} placeholder="Colours (comma separated)" className="border rounded-lg px-3 py-2" />
              <textarea value={pform.description} onChange={e => setPform({ ...pform, description: e.target.value })} placeholder="Description" className="border rounded-lg px-3 py-2 sm:col-span-3" rows={2} />
            </div>
            <div className="flex gap-2 mt-3"><button className="bg-maroon text-white font-bold px-5 py-2 rounded-full">{editing ? 'Update Product' : 'Add Product'}</button>{editing && <button type="button" onClick={() => { setEditing(null); setPform({ name: '', slug: '', category: 'Handbag', price: '', oldPrice: '', stock: '', description: '', image: '', colors: 'Black' }); }} className="border px-5 py-2 rounded-full">Cancel</button>}</div>
          </form>
          <div className="bg-white rounded-xl shadow mt-5 overflow-x-auto"><table className="w-full text-sm min-w-[640px]"><thead><tr className="text-left border-b bg-gray-50"><th className="p-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map(p => <tr key={p.id} className="border-b"><td className="p-3 font-semibold">{p.name}<span className="block text-xs text-gray-400 font-normal">{p.slug}</span></td><td>{p.category}</td><td>{formatBDT(p.price)}</td><td className={p.stock <= 3 ? 'text-red-600 font-bold' : ''}>{p.stock}</td><td><button onClick={() => editProduct(p)} className="text-maroon underline mr-3">Edit</button><button onClick={() => delProduct(p.id)} className="text-red-600 underline">Delete</button></td></tr>)}</tbody></table></div>
        </div>
      )}
      {tab === 'orders' && (
        <div className="space-y-4 mt-6">
          {orders.length === 0 ? <p className="bg-white rounded-xl shadow p-6 text-gray-500">No orders yet. Place a test order from the shop to see it here.</p> : [...orders].reverse().map(o => (
            <div key={o.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between flex-wrap gap-2"><p className="font-bold">{o.id} — {o.customer.name} ({o.customer.phone})</p><select value={o.status} onChange={e => setStatus(o.id, e.target.value)} className="border rounded-lg px-2 py-1 text-sm">{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
              <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()} · {o.customer.address}, {o.customer.city} · {o.paymentMethod}{o.trxId ? ' · TrxID: ' + o.trxId : ''}</p>
              <ul className="text-sm mt-2 list-disc pl-5">{o.items.map((i, idx) => <li key={idx}>{i.name} × {i.qty} — {formatBDT(i.price * i.qty)}</li>)}</ul>
              <p className="font-bold text-maroon mt-2">Total: {formatBDT(o.total)} (Subtotal {formatBDT(o.subtotal)}{o.discount > 0 ? ' − Discount ' + formatBDT(o.discount) : ''} + Shipping {formatBDT(o.shipping)})</p>
            </div>
          ))}
        </div>
      )}
      {tab === 'coupons' && (
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          <form onSubmit={addCoupon} className="bg-white rounded-xl shadow p-5 h-fit"><h3 className="font-bold">Add Coupon</h3>
            <input required value={cform.code} onChange={e => setCform({ ...cform, code: e.target.value.toUpperCase() })} placeholder="CODE (e.g. EID20)" className="border rounded-lg px-3 py-2 w-full mt-3" />
            <input required type="number" min="1" max="90" value={cform.discountPercent} onChange={e => setCform({ ...cform, discountPercent: e.target.value })} placeholder="Discount % *" className="border rounded-lg px-3 py-2 w-full mt-2" />
            <input type="number" min="0" value={cform.minOrder} onChange={e => setCform({ ...cform, minOrder: e.target.value })} placeholder="Minimum order (৳, optional)" className="border rounded-lg px-3 py-2 w-full mt-2" />
            <button className="bg-maroon text-white font-bold px-5 py-2 rounded-full mt-3">Add Coupon</button>
          </form>
          <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Active Coupons</h3><ul className="mt-3 space-y-2">{coupons.map(c => <li key={c.code} className="flex justify-between border-b pb-2 text-sm"><span><b>{c.code}</b> — {c.discountPercent}% off{c.minOrder ? ' (min ' + formatBDT(c.minOrder) + ')' : ''}</span><button onClick={() => delCoupon(c.code)} className="text-red-600 underline">Delete</button></li>)}</ul></div>
        </div>
      )}
    </div>
  );
}
