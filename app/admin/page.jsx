'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { LogoLight } from '../../components/Logo';
import { IconGrid, IconPackage, IconBox, IconTag, IconUsers, IconPercent, IconChart, IconSettings, IconCheck, IconTruck, IconHeart, IconShoppingBag, IconEdit, IconTrash, IconPlus, IconEye, IconGift, IconMail } from '../../components/Icons';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
const FLOW = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'];
const NEXT_ACTION = { Pending: 'Approve', Approved: 'Start Processing', Processing: 'Mark Shipped', Shipped: 'Mark Delivered' };
const NAV = [
  ['dashboard', 'Dashboard', IconGrid], ['orders', 'Orders', IconPackage], ['products', 'Products', IconBox],
  ['categories', 'Categories', IconTag], ['customers', 'Customers', IconUsers], ['coupons', 'Coupons', IconPercent],
  ['sales', 'Sales', IconChart], ['messages', 'Messages', IconMail], ['settings', 'Settings', IconSettings],
];
const EMPTY_PRODUCT = { name: '', slug: '', category: 'Handbag', originalPrice: '', discountPercent: '', currentPrice: '', stock: '', description: '', image: '', colors: 'Black' };
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginErr, setLoginErr] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState({});
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(null);
  const [pform, setPform] = useState(EMPTY_PRODUCT);
  const [perr, setPerr] = useState({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [cform, setCform] = useState({ name: '', description: '' });
  const [editingCat, setEditingCat] = useState(null);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '10', minOrder: '', target: 'all', targetUserId: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [giveForm, setGiveForm] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => { if (typeof window !== 'undefined' && localStorage.getItem('tos-admin') === '1') setAuthed(true); }, []);
  async function load() {
    try {
      const [p, o, c, cat, u, a] = await Promise.all([
        fetch('/api/products').then(r => r.json()), fetch('/api/orders').then(r => r.json()), fetch('/api/coupons').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()), fetch('/api/users').then(r => r.json()), fetch('/api/activity').then(r => r.json()),
      ]);
      setProducts(p); setOrders(o); setCoupons(c); setCategories(cat); setUsers(u); setActivity(a || {});
      fetch('/api/contact').then(r => r.json()).then(setMessages).catch(() => {});
    } catch {}
  }
  useEffect(() => { if (authed) load(); }, [authed]);
  function doLogin(e) {
    e.preventDefault();
    if (login.email.trim().toLowerCase() === 'admin@touchofsabrina.local' && login.password === 'admin123') { localStorage.setItem('tos-admin', '1'); setAuthed(true); setLoginErr(''); }
    else setLoginErr('Wrong email or password. Demo: admin@touchofsabrina.local / admin123');
  }
  function logout() { localStorage.removeItem('tos-admin'); setAuthed(false); }

  // ---- Price sync: Original / Discount % / Current Price ----
  function priceHandlers(field, value) {
    setPform(prev => {
      const next = { ...prev, [field]: value };
      const orig = Number(next.originalPrice);
      if (field === 'originalPrice') {
        if (!value) { next.discountPercent = ''; next.currentPrice = ''; }
        else if (next.discountPercent !== '' && next.discountPercent != null) next.currentPrice = String(Math.max(0, Math.round(orig * (1 - Number(next.discountPercent) / 100))));
        else if (!next.currentPrice) next.currentPrice = String(orig);
      }
      if (field === 'discountPercent') {
        const d = Math.max(0, Math.min(100, Number(value) || 0));
        if (orig) next.currentPrice = String(Math.max(0, Math.round(orig * (1 - d / 100))));
      }
      if (field === 'currentPrice') {
        if (orig && value !== '') next.discountPercent = String(Math.max(0, Math.min(100, Math.round((1 - Number(value) / orig) * 100))));
        else if (!value) next.discountPercent = '';
      }
      return next;
    });
  }
  function validateProduct() {
    const e = {};
    if (!pform.name.trim()) e.name = 'Please write the product name.';
    if (!pform.currentPrice || Number(pform.currentPrice) <= 0) e.currentPrice = 'Please write the selling price (more than 0).';
    if (pform.stock === '' || Number(pform.stock) < 0) e.stock = 'Please write how many are in stock (0 is okay).';
    if (!pform.category) e.category = 'Please choose a category.';
    setPerr(e); return Object.keys(e).length === 0;
  }
  async function saveProduct(e) {
    e.preventDefault(); setMsg(''); setErr('');
    if (!validateProduct()) return;
    const disc = Number(pform.discountPercent) || 0;
    const payload = { name: pform.name.trim(), slug: pform.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || pform.name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'), category: pform.category, price: Number(pform.currentPrice), oldPrice: disc > 0 && pform.originalPrice ? Number(pform.originalPrice) : null, stock: Number(pform.stock), colors: pform.colors.split(',').map(s => s.trim()).filter(Boolean), description: pform.description, image: pform.image };
    const r = await fetch('/api/products', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Could not save the product. Please try again.'); return; }
    setMsg(editing ? 'Product updated!' : 'Product added! It is now live on the Shop page.');
    setEditing(null); setPform(EMPTY_PRODUCT); setShowProductForm(false); load();
  }
  function editProduct(p) {
    const disc = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    setEditing(p);
    setPform({ name: p.name, slug: p.slug, category: p.category, originalPrice: p.oldPrice ? String(p.oldPrice) : String(p.price), discountPercent: disc ? String(disc) : '', currentPrice: String(p.price), stock: String(p.stock), description: p.description || '', image: p.image || '', colors: (p.colors || []).join(', ') });
    setShowProductForm(true); window.scrollTo(0, 0);
  }
  async function delProduct(id) { if (!confirm('Delete this product? This cannot be undone.')) return; await fetch('/api/products?id=' + id, { method: 'DELETE' }); load(); }

  // ---- Categories: just Name + Description (optional) ----
  async function saveCategory(e) {
    e.preventDefault(); setMsg(''); setErr('');
    if (!cform.name.trim()) { setErr('Please write a category name first.'); return; }
    const r = await fetch('/api/categories', { method: editingCat ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingCat ? { id: editingCat.id, ...cform } : cform) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Could not save the category.'); return; }
    setMsg(editingCat ? 'Category updated!' : 'Category added! It now appears in the list and in the Product Add category dropdown.');
    setEditingCat(null); setCform({ name: '', description: '' }); load();
  }
  async function delCategory(id, name) {
    if (!confirm('Delete the "' + name + '" category?')) return;
    const r = await fetch('/api/categories?id=' + id, { method: 'DELETE' }); const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Could not delete this category.'); return; }
    setMsg('Category deleted.'); load();
  }

  // ---- Orders workflow ----
  async function setStatus(id, status) {
    const r = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Could not change the order status.'); return; }
    setMsg('Order ' + id + ' is now ' + status + (status === 'Approved' ? ' — stock has been reduced.' : status === 'Cancelled' || status === 'Returned' ? ' — stock has been restored.' : '.'));
    setSelectedOrder(d); load();
  }

  // ---- Coupons ----
  async function addCoupon(e) {
    e.preventDefault(); setMsg(''); setErr('');
    const targetUser = users.find(u => u.id === couponForm.targetUserId);
    const r = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...couponForm, targetUserName: targetUser?.name || null }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Could not add the coupon.'); return; }
    setMsg('Coupon ' + d.code + ' added!');
    setCouponForm({ code: '', discountPercent: '10', minOrder: '', target: 'all', targetUserId: '' }); load();
  }
  async function delCoupon(code) { await fetch('/api/coupons?code=' + code, { method: 'DELETE' }); load(); }
  async function giveCoupon(u) {
    const f = giveForm[u.id] || {};
    const code = (f.code || ('SABRINA-' + u.name.split(' ')[0].toUpperCase() + '-10')).toUpperCase();
    const pct = Number(f.percent || 10);
    const r = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, discountPercent: pct, minOrder: 0, target: 'customer', targetUserId: u.id, targetUserName: u.name }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Could not create the coupon.'); return; }
    setMsg('Personal coupon ' + d.code + ' created for ' + u.name + ' (' + pct + '% off).');
    setGiveForm({ ...giveForm, [u.id]: {} }); load();
  }

  // ---- Dashboard numbers (real data only) ----
  const delivered = orders.filter(o => o.status === 'Delivered');
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const low = products.filter(p => p.stock <= 3);
  const byStatus = ALL_STATUSES_COUNT(orders);
  function ALL_STATUSES_COUNT(list) { const m = {}; ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].forEach(s => m[s] = list.filter(o => o.status === s).length); return m; }
  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), key: d.toISOString().slice(0, 10), total: 0 }); }
    delivered.forEach(o => { const k = String(o.createdAt).slice(0, 10); const day = days.find(x => x.key === k); if (day) day.total += o.total; });
    return days;
  }, [orders]);
  const maxDay = Math.max(1, ...last7.map(d => d.total));
  const topProducts = useMemo(() => {
    const m = {};
    orders.filter(o => !['Cancelled', 'Returned'].includes(o.status)).forEach(o => o.items.forEach(i => { m[i.name] = (m[i.name] || 0) + i.qty; }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);
  const activityFeed = useMemo(() => {
    const feed = [];
    Object.entries(activity).forEach(([uid, a]) => {
      const u = users.find(x => x.id === uid);
      (a.cart || []).forEach(i => feed.push({ who: u?.name || uid, what: 'added to Bag', item: i, at: i.addedAt || a.updatedAt }));
      (a.favorites || []).forEach(i => feed.push({ who: u?.name || uid, what: 'saved to Favourites', item: i, at: i.addedAt || a.updatedAt }));
    });
    return feed.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 10);
  }, [activity, users]);
  const customerStats = useMemo(() => users.map(u => {
    const uo = orders.filter(o => o.userId === u.id || o.customer?.phone === u.phone || (o.customer?.email && o.customer.email.toLowerCase() === u.email.toLowerCase()));
    return { ...u, orderCount: uo.length, deliveredCount: uo.filter(o => o.status === 'Delivered').length, spent: uo.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0), orders: uo };
  }), [users, orders]);

  if (!authed) return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="flex justify-center"><LogoLight size={56} /></div>
      <h1 className="font-serif text-3xl font-bold text-center mt-4">Master Admin</h1>
      <p className="text-center text-sm text-gray-500 mt-1">Touch of Sabrina — shop owner only.</p>
      <form onSubmit={doLogin} className="bg-white rounded-xl shadow p-6 mt-6">
        <label className="text-sm font-semibold">Email</label>
        <input value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} required type="email" placeholder="admin@touchofsabrina.local" className="border rounded-lg px-3 py-2.5 w-full mt-1" />
        <label className="text-sm font-semibold block mt-3">Password</label>
        <input value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} required type="password" placeholder="Password" className="border rounded-lg px-3 py-2.5 w-full mt-1" />
        {loginErr && <p className="text-red-600 text-sm mt-3">{loginErr}</p>}
        <button className="w-full bg-maroon text-white font-bold py-3 rounded-full mt-4">Login</button>
        <p className="text-xs text-gray-400 text-center mt-3">Demo login: admin@touchofsabrina.local / admin123<br />Change this password before production use.</p>
      </form>
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-maroon text-white rounded-2xl p-4 lg:sticky lg:top-24">
            <LogoLight size={38} />
            <p className="text-xs text-gold mt-2">Master Admin — everything in one place</p>
            <nav className="flex lg:flex-col gap-1 mt-4 overflow-x-auto">
              {NAV.map(([key, label, Ico]) => (<button key={key} onClick={() => { setTab(key); setMsg(''); setErr(''); }} className={'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap ' + (tab === key ? 'bg-gold text-black' : 'hover:bg-white/10')}><Ico size={18} /> {label}</button>))}
              <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10">View Shop</Link>
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10">Logout</button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <h1 className="font-serif text-3xl font-bold capitalize">{tab === 'dashboard' ? 'Dashboard' : tab}</h1>
          <p className="text-sm text-gray-500 mt-1">All prices/products here are SAMPLE — replace with real prices, photos &amp; payment numbers before launch.</p>
          {msg && <p className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mt-4 text-sm font-semibold flex items-center gap-2"><IconCheck size={16} /> {msg}</p>}
          {err && <p className="bg-red-100 text-red-800 px-4 py-2 rounded-lg mt-4 text-sm font-semibold">{err}</p>}

          {tab === 'dashboard' && (
            <div className="space-y-5 mt-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Revenue (Delivered orders only)</p><p className="text-2xl font-bold text-maroon">{formatBDT(revenue)}</p></div>
                <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></div>
                <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Pending Orders</p><p className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p></div>
                <div className="bg-white rounded-xl shadow p-5"><p className="text-sm text-gray-500">Total Customers</p><p className="text-2xl font-bold">{users.length}</p></div>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-bold">Revenue — Last 7 Days (Delivered orders)</h3>
                <div className="flex items-end gap-3 h-36 mt-4">
                  {last7.map(d => (<div key={d.key} className="flex-1 flex flex-col items-center gap-1"><span className="text-xs font-semibold">{d.total ? formatBDT(d.total) : ''}</span><div className="w-full bg-gold rounded-t" style={{ height: Math.max(4, (d.total / maxDay) * 90) + 'px' }} title={d.label + ': ' + formatBDT(d.total)}></div><span className="text-xs text-gray-500">{d.label}</span></div>))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Orders by Status</h3><ul className="text-sm mt-2 space-y-1">{Object.entries(byStatus).map(([s, n]) => <li key={s} className="flex justify-between border-b py-1"><span>{s}</span><b>{n}</b></li>)}</ul></div>
                <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Top 5 Selling Products</h3>{topProducts.length === 0 ? <p className="text-sm text-gray-500 mt-2">No sales yet.</p> : <ol className="text-sm mt-2 space-y-1 list-decimal pl-5">{topProducts.map(([n, q]) => <li key={n} className="flex justify-between"><span>{n}</span><b>{q} sold</b></li>)}</ol>}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Low Stock / Out of Stock</h3>{low.length === 0 ? <p className="text-sm text-gray-500 mt-2">All products are well stocked.</p> : <ul className="text-sm mt-2 list-disc pl-5">{low.map(p => <li key={p.id}>{p.name} — {p.stock === 0 ? 'OUT OF STOCK' : p.stock + ' left'}</li>)}</ul>}</div>
              <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Live Shopping Activity</h3><p className="text-xs text-gray-400">Latest Bag / Favourites additions from logged-in customers.</p>{activityFeed.length === 0 ? <p className="text-sm text-gray-500 mt-2">No activity yet.</p> : <ul className="text-sm mt-2 space-y-1">{activityFeed.map((a, i) => <li key={i} className="border-b py-1 flex justify-between gap-2"><span><b>{a.who}</b> {a.what}: {a.item.name}</span><span className="text-gray-400 text-xs">{a.at ? new Date(a.at).toLocaleString() : ''}</span></li>)}</ul>}</div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4 mt-5">
              <p className="text-sm text-gray-500">Order flow: Pending → Approved → Processing → Shipped → Delivered. Stock goes down only when you Approve. Cancelling or Returning an order puts the stock back.</p>
              {orders.length === 0 ? <p className="bg-white rounded-xl shadow p-6 text-gray-500">No orders yet. Place a test order from the shop to see it here.</p> : [...orders].reverse().map(o => (
                <div key={o.id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex justify-between flex-wrap gap-2"><p className="font-bold">{o.id} — {o.customer.name} ({o.customer.phone})</p><span className="bg-maroon-soft text-maroon text-xs font-bold px-3 py-1 rounded-full">{o.status}</span></div>
                  <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()} · {o.customer.address}, {o.customer.city} · {o.paymentMethod}{o.trxId ? ' · TrxID: ' + o.trxId : ''}</p>
                  <ul className="text-sm mt-2 list-disc pl-5">{o.items.map((i, idx) => <li key={idx}>{i.name} × {i.qty} — {formatBDT(i.price * i.qty)}</li>)}</ul>
                  <p className="font-bold text-maroon mt-2">Total: {formatBDT(o.total)} (Subtotal {formatBDT(o.subtotal)}{o.discount > 0 ? ' − Discount ' + formatBDT(o.discount) : ''} + Shipping {formatBDT(o.shipping)})</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)} className="border px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1"><IconEye size={15} /> {selectedOrder?.id === o.id ? 'Hide details' : 'View details'}</button>
                    {NEXT_ACTION[o.status] && <button onClick={() => setStatus(o.id, FLOW[FLOW.indexOf(o.status) + 1])} className="bg-maroon text-white px-4 py-1.5 rounded-full text-sm font-semibold">{NEXT_ACTION[o.status]}</button>}
                    {!['Delivered', 'Cancelled', 'Returned'].includes(o.status) && <button onClick={() => setStatus(o.id, 'Cancelled')} className="border border-red-500 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold">Cancel Order</button>}
                    {o.status === 'Delivered' && <button onClick={() => setStatus(o.id, 'Returned')} className="border border-red-500 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold">Mark Returned</button>}
                  </div>
                  {selectedOrder?.id === o.id && (
                    <div className="mt-4 border-t pt-3">
                      <p className="font-semibold text-sm">Order journey</p>
                      <ol className="flex flex-wrap gap-2 mt-2">{FLOW.map((s, i) => { const done = FLOW.indexOf(o.status) >= i; const h = (o.statusHistory || []).find(x => x.status === s); return (<li key={s} className={'rounded-full px-3 py-1.5 text-xs font-semibold border ' + (done ? 'bg-maroon text-white border-maroon' : 'bg-white text-gray-500')}>{done ? <IconCheck size={12} className="inline" /> : ''} {s}{h ? ' · ' + new Date(h.at).toLocaleDateString() : ''}</li>); })}</ol>
                      <p className="text-xs text-gray-400 mt-2">Stock deducted: {o.stockDeducted ? 'Yes (approved)' : 'No — stock goes down only on Approve.'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'products' && (
            <div className="mt-5 space-y-5">
              <div className="bg-gold/15 border border-gold/40 rounded-xl p-4 text-sm">
                <p className="font-bold">How to add a product — 3 easy steps</p>
                <ol className="list-decimal pl-5 mt-1 space-y-0.5"><li>Click <b>+ Add Product</b> below and write the name and photo link.</li><li>Choose the category, then write the price (Original / Discount % / Right Now Price fill each other in automatically).</li><li>Write the stock, then click the big <b>Add Product</b> button — it appears on the Shop page at once.</li></ol>
              </div>
              {!showProductForm ? (
                <button onClick={() => { setEditing(null); setPform(EMPTY_PRODUCT); setShowProductForm(true); }} className="bg-maroon text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 text-lg"><IconPlus size={20} /> Add Product</button>
              ) : (
                <form onSubmit={saveProduct} className="bg-white rounded-xl shadow p-5">
                  <h3 className="font-bold text-lg">{editing ? 'Edit Product: ' + editing.name : 'Add a New Product'}</h3>
                  <p className="text-xs text-gray-400 mt-1">Fields marked * are needed. Fields marked “Optional” can be left empty.</p>
                  <div className="mt-4 space-y-5">
                    <div><p className="font-semibold">Step 1 — Name &amp; Photo</p>
                      <input required value={pform.name} onChange={e => setPform({ ...pform, name: e.target.value })} placeholder="Product name *  (e.g. Bow Bag)" className="border rounded-lg px-3 py-2.5 w-full mt-2" />
                      {perr.name && <p className="text-red-600 text-sm mt-1">{perr.name}</p>}
                      <input value={pform.slug} onChange={e => setPform({ ...pform, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="Link name / slug — Optional (auto-filled from the name)" disabled={!!editing} className="border rounded-lg px-3 py-2.5 w-full mt-2 disabled:bg-gray-100" />
                      <input value={pform.image} onChange={e => setPform({ ...pform, image: e.target.value })} placeholder="Photo link — paste an image URL (Optional, but a photo sells much better)" className="border rounded-lg px-3 py-2.5 w-full mt-2" />
                      <p className="text-xs text-gray-400 mt-1">Paste a full image link (https://...). The photo preview below updates as you type.</p>
                      {pform.image && <img src={pform.image} alt="Photo preview" className="w-32 h-32 object-cover rounded-lg mt-2 border" onError={e => { e.currentTarget.style.display = 'none'; }} />}
                    </div>
                    <div><p className="font-semibold">Step 2 — Category</p>
                      <select value={pform.category} onChange={e => setPform({ ...pform, category: e.target.value })} className="border rounded-lg px-3 py-2.5 w-full mt-2">{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
                      {perr.category && <p className="text-red-600 text-sm mt-1">{perr.category}</p>}
                      <p className="text-xs text-gray-400 mt-1">Need a new category? Add it first in the Categories tab — it will appear here automatically.</p>
                    </div>
                    <div><p className="font-semibold">Step 3 — Price (they fill each other in)</p>
                      <div className="grid sm:grid-cols-3 gap-3 mt-2">
                        <div><label className="text-sm">Original Price (৳) — Optional</label><input type="number" min="0" value={pform.originalPrice} onChange={e => priceHandlers('originalPrice', e.target.value)} placeholder="e.g. 4000" className="border rounded-lg px-3 py-2.5 w-full mt-1" /><p className="text-xs text-gray-400 mt-1">The price before discount. Leave empty if there is no discount.</p></div>
                        <div><label className="text-sm">Discount % — Optional</label><input type="number" min="0" max="100" value={pform.discountPercent} onChange={e => priceHandlers('discountPercent', e.target.value)} placeholder="e.g. 25" className="border rounded-lg px-3 py-2.5 w-full mt-1" /><p className="text-xs text-gray-400 mt-1">Write the discount and the Right Now Price is calculated for you.</p></div>
                        <div><label className="text-sm">Right Now Price (৳) *</label><input required type="number" min="0" value={pform.currentPrice} onChange={e => priceHandlers('currentPrice', e.target.value)} placeholder="e.g. 3000" className="border rounded-lg px-3 py-2.5 w-full mt-1" /><p className="text-xs text-gray-400 mt-1">The price customers pay. Change this and the Discount % updates itself.</p></div>
                      </div>
                      {perr.currentPrice && <p className="text-red-600 text-sm mt-1">{perr.currentPrice}</p>}
                      {pform.originalPrice && pform.currentPrice && Number(pform.discountPercent) > 0 && <p className="text-green-700 text-sm font-semibold mt-2">Customers will see: {formatBDT(pform.currentPrice)} (was {formatBDT(pform.originalPrice)}, save {pform.discountPercent}%).</p>}
                    </div>
                    <div><p className="font-semibold">Step 4 — Stock &amp; Description</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-2">
                        <div><label className="text-sm">Stock *</label><input required type="number" min="0" value={pform.stock} onChange={e => setPform({ ...pform, stock: e.target.value })} placeholder="How many do you have? e.g. 10" className="border rounded-lg px-3 py-2.5 w-full mt-1" />{perr.stock && <p className="text-red-600 text-sm mt-1">{perr.stock}</p>}</div>
                        <div><label className="text-sm">Colours — Optional</label><input value={pform.colors} onChange={e => setPform({ ...pform, colors: e.target.value })} placeholder="e.g. Black, Maroon" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
                      </div>
                      <textarea value={pform.description} onChange={e => setPform({ ...pform, description: e.target.value })} placeholder="Description — Optional (a few words about the bag)" className="border rounded-lg px-3 py-2.5 w-full mt-2" rows={2} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5"><button className="bg-maroon text-white font-bold px-8 py-3 rounded-full text-lg">{editing ? 'Update Product' : 'Add Product'}</button><button type="button" onClick={() => { setEditing(null); setPform(EMPTY_PRODUCT); setShowProductForm(false); }} className="border px-6 py-3 rounded-full font-semibold">Cancel</button></div>
                </form>
              )}
              <div className="bg-white rounded-xl shadow overflow-x-auto"><table className="w-full text-sm min-w-[640px]"><thead><tr className="text-left border-b bg-gray-50"><th className="p-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map(p => <tr key={p.id} className="border-b"><td className="p-3 font-semibold">{p.name}<span className="block text-xs text-gray-400 font-normal">{p.slug}</span></td><td>{p.category}</td><td>{formatBDT(p.price)}{p.oldPrice ? <span className="block text-xs text-gray-400 line-through">{formatBDT(p.oldPrice)}</span> : ''}</td><td className={p.stock <= 3 ? 'text-red-600 font-bold' : ''}>{p.stock}</td><td><button onClick={() => editProduct(p)} className="text-maroon underline mr-3 inline-flex items-center gap-1"><IconEdit size={14} /> Edit</button><button onClick={() => delProduct(p.id)} className="text-red-600 underline inline-flex items-center gap-1"><IconTrash size={14} /> Delete</button></td></tr>)}</tbody></table></div>
            </div>
          )}

          {tab === 'categories' && (
            <div className="mt-5 space-y-5">
              <div className="bg-gold/15 border border-gold/40 rounded-xl p-4 text-sm">
                <p className="font-bold">How to add a category — 2 easy steps</p>
                <ol className="list-decimal pl-5 mt-1 space-y-0.5"><li>Write the category name below (for example: Clutch).</li><li>Click <b>Save Category</b> — it appears in the list at once, and in the Product Add dropdown too.</li></ol>
              </div>
              <form onSubmit={saveCategory} className="bg-white rounded-xl shadow p-5">
                <h3 className="font-bold text-lg">{editingCat ? 'Edit Category: ' + editingCat.name : 'Add a New Category'}</h3>
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div><label className="text-sm font-semibold">Category Name *</label><input required value={cform.name} onChange={e => setCform({ ...cform, name: e.target.value })} placeholder="e.g. Clutch" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
                  <div><label className="text-sm font-semibold">Description — Optional</label><input value={cform.description} onChange={e => setCform({ ...cform, description: e.target.value })} placeholder="A few words about this category (optional)" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
                </div>
                <div className="flex gap-2 mt-4"><button className="bg-maroon text-white font-bold px-6 py-3 rounded-full flex items-center gap-2"><IconPlus size={18} /> {editingCat ? 'Update Category' : 'Save Category'}</button>{editingCat && <button type="button" onClick={() => { setEditingCat(null); setCform({ name: '', description: '' }); }} className="border px-5 py-3 rounded-full font-semibold">Cancel</button>}</div>
              </form>
              <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">All Categories ({categories.length})</h3>
                <ul className="mt-3 space-y-2">{categories.map(c => (
                  <li key={c.id} className="flex justify-between items-center border-b pb-2 text-sm gap-2 flex-wrap">
                    <span><b>{c.name}</b>{c.description ? <span className="text-gray-500"> — {c.description}</span> : ''}<span className="block text-xs text-gray-400">{products.filter(p => p.category === c.name).length} product(s) in this category</span></span>
                    <span className="flex gap-3"><button onClick={() => { setEditingCat(c); setCform({ name: c.name, description: c.description || '' }); }} className="text-maroon underline inline-flex items-center gap-1"><IconEdit size={14} /> Edit</button><button onClick={() => delCategory(c.id, c.name)} className="text-red-600 underline inline-flex items-center gap-1"><IconTrash size={14} /> Delete</button></span>
                  </li>))}</ul>
                <p className="text-xs text-gray-400 mt-3">A category with products in it cannot be deleted — move or delete those products first.</p>
              </div>
            </div>
          )}

          {tab === 'customers' && (
            <div className="mt-5 space-y-4">
              <p className="text-sm text-gray-500">Every registered customer. Click one to see their orders and what they have in their Bag and Favourites right now.</p>
              {customerStats.length === 0 ? <p className="bg-white rounded-xl shadow p-6 text-gray-500">No customers yet.</p> : customerStats.map(u => (
                <div key={u.id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex justify-between flex-wrap gap-2">
                    <div><p className="font-bold">{u.name} {u.deliveredCount >= 2 && <span className="bg-gold text-black text-xs px-2 py-0.5 rounded-full ml-1">Regular Buyer</span>}</p><p className="text-sm text-gray-500">{u.email} · {u.phone} · Joined {new Date(u.createdAt).toLocaleDateString()}</p></div>
                    <div className="text-sm text-right"><p>{u.orderCount} order(s) · {u.deliveredCount} delivered</p><p className="font-bold text-maroon">Spent: {formatBDT(u.spent)}</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => setSelectedCustomer(selectedCustomer?.id === u.id ? null : u)} className="border px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1"><IconEye size={15} /> {selectedCustomer?.id === u.id ? 'Hide details' : 'View orders, Bag & Favourites'}</button>
                    <span className="flex items-center gap-2 text-sm">
                      <input value={(giveForm[u.id]?.percent ?? 10)} onChange={e => setGiveForm({ ...giveForm, [u.id]: { ...giveForm[u.id], percent: e.target.value } })} type="number" min="1" max="90" className="border rounded-lg px-2 py-1.5 w-16" aria-label="Discount percent" /><span>% off</span>
                      <button onClick={() => giveCoupon(u)} className="bg-gold text-black px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1"><IconGift size={15} /> Give coupon</button>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Give coupon creates a personal code like SABRINA-{u.name.split(' ')[0].toUpperCase()}-10 — only this customer can use it.</p>
                  {selectedCustomer?.id === u.id && (
                    <div className="mt-4 border-t pt-3 space-y-3">
                      <div><p className="font-semibold text-sm">Their Orders ({u.orders.length})</p>{u.orders.length === 0 ? <p className="text-sm text-gray-500">No orders yet.</p> : <ul className="text-sm mt-1 space-y-1">{u.orders.map(o => <li key={o.id} className="flex justify-between flex-wrap gap-2 border-b py-1"><span>{o.id} · {new Date(o.createdAt).toLocaleDateString()}</span><span>{o.status}</span><b>{formatBDT(o.total)}</b></li>)}</ul>}</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-maroon-soft rounded-xl p-3"><p className="font-semibold text-sm flex items-center gap-1.5"><IconShoppingBag size={16} /> Cart now</p>{(activity[u.id]?.cart || []).length === 0 ? <p className="text-sm text-gray-500 mt-1">Bag is empty right now.</p> : <ul className="text-sm mt-1">{activity[u.id].cart.map((i, idx) => <li key={idx}>{i.name} × {i.qty} — {formatBDT(i.price * i.qty)} <span className="text-gray-400 text-xs">({i.addedAt ? new Date(i.addedAt).toLocaleDateString() : ''})</span></li>)}</ul>}</div>
                        <div className="bg-red-50 rounded-xl p-3"><p className="font-semibold text-sm flex items-center gap-1.5"><IconHeart size={16} className="text-red-600" /> Favorites now</p>{(activity[u.id]?.favorites || []).length === 0 ? <p className="text-sm text-gray-500 mt-1">No favourites saved right now.</p> : <ul className="text-sm mt-1">{activity[u.id].favorites.map((i, idx) => <li key={idx}>{i.name} — {formatBDT(i.price)} <span className="text-gray-400 text-xs">({i.addedAt ? new Date(i.addedAt).toLocaleDateString() : ''})</span></li>)}</ul>}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'coupons' && (
            <div className="mt-5 grid md:grid-cols-2 gap-5">
              <form onSubmit={addCoupon} className="bg-white rounded-xl shadow p-5 h-fit">
                <h3 className="font-bold text-lg">Add Coupon</h3>
                <p className="text-xs text-gray-400 mt-1">Choose who can use it: everyone, regular buyers only (2+ Delivered orders), or one specific customer.</p>
                <label className="text-sm font-semibold block mt-3">Coupon Code *</label>
                <input required value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="CODE (e.g. EID20)" className="border rounded-lg px-3 py-2.5 w-full mt-1" />
                <label className="text-sm font-semibold block mt-3">Discount % *</label>
                <input required type="number" min="1" max="90" value={couponForm.discountPercent} onChange={e => setCouponForm({ ...couponForm, discountPercent: e.target.value })} placeholder="e.g. 15" className="border rounded-lg px-3 py-2.5 w-full mt-1" />
                <label className="text-sm font-semibold block mt-3">Minimum Order (৳) — Optional</label>
                <input type="number" min="0" value={couponForm.minOrder} onChange={e => setCouponForm({ ...couponForm, minOrder: e.target.value })} placeholder="0 = no minimum" className="border rounded-lg px-3 py-2.5 w-full mt-1" />
                <label className="text-sm font-semibold block mt-3">Who can use this coupon?</label>
                <select value={couponForm.target} onChange={e => setCouponForm({ ...couponForm, target: e.target.value, targetUserId: '' })} className="border rounded-lg px-3 py-2.5 w-full mt-1">
                  <option value="all">All customers</option>
                  <option value="regular">Regular buyers only (2 or more Delivered orders)</option>
                  <option value="customer">One specific customer</option>
                </select>
                {couponForm.target === 'customer' && (
                  <><label className="text-sm font-semibold block mt-3">Choose the customer *</label>
                  <select value={couponForm.targetUserId} onChange={e => setCouponForm({ ...couponForm, targetUserId: e.target.value })} className="border rounded-lg px-3 py-2.5 w-full mt-1"><option value="">— Choose a customer —</option>{users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}</select></>
                )}
                <button className="bg-maroon text-white font-bold px-6 py-2.5 rounded-full mt-4">Add Coupon</button>
              </form>
              <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold text-lg">All Coupons ({coupons.length})</h3>
                <ul className="mt-3 space-y-2">{coupons.map(c => <li key={c.code} className="border-b pb-2 text-sm"><span className="flex justify-between"><span><b>{c.code}</b> — {c.discountPercent}% off{c.minOrder ? ' (min ' + formatBDT(c.minOrder) + ')' : ''}</span><button onClick={() => delCoupon(c.code)} className="text-red-600 underline">Delete</button></span><span className="text-xs text-gray-500 block mt-0.5">For: {c.target === 'all' ? 'All customers' : c.target === 'regular' ? 'Regular buyers only (2+ Delivered orders)' : 'Only ' + (c.targetUserName || 'one customer')}</span></li>)}</ul>
                <p className="text-xs text-gray-400 mt-3">Example: LOYAL15 (15% off) works only for regular buyers. A guest or a new customer will see: “This coupon is only for regular buyers”.</p>
              </div>
            </div>
          )}

          {tab === 'sales' && (
            <div className="mt-5 space-y-5">
              <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Revenue — Last 7 Days (Delivered orders only)</h3>
                <div className="flex items-end gap-3 h-36 mt-4">{last7.map(d => (<div key={d.key} className="flex-1 flex flex-col items-center gap-1"><span className="text-xs font-semibold">{d.total ? formatBDT(d.total) : ''}</span><div className="w-full bg-gold rounded-t" style={{ height: Math.max(4, (d.total / maxDay) * 90) + 'px' }}></div><span className="text-xs text-gray-500">{d.label}</span><span className="text-[10px] text-gray-400">{d.key.slice(5)}</span></div>))}</div>
                <p className="text-sm text-gray-500 mt-3">Total delivered revenue: <b className="text-maroon">{formatBDT(revenue)}</b> from {delivered.length} delivered order(s).</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Orders by Status</h3><ul className="text-sm mt-2 space-y-1">{Object.entries(byStatus).map(([s, n]) => <li key={s} className="flex justify-between border-b py-1"><span>{s}</span><b>{n}</b></li>)}</ul></div>
                <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold">Top 5 Selling Products</h3>{topProducts.length === 0 ? <p className="text-sm text-gray-500 mt-2">No sales yet.</p> : <ol className="text-sm mt-2 space-y-1 list-decimal pl-5">{topProducts.map(([n, q]) => <li key={n} className="flex justify-between"><span>{n}</span><b>{q} sold</b></li>)}</ol>}</div>
              </div>
            </div>
          )}

          {tab === 'messages' && (
            <div className="mt-5 space-y-4">
              <p className="text-sm text-gray-500">Messages from the Contact Us page. Reply to the customer at their email address.</p>
              {messages.length === 0 ? <p className="bg-white rounded-xl shadow p-6 text-gray-500">No messages yet.</p> : [...messages].reverse().map(m => (
                <div key={m.id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex justify-between flex-wrap gap-2"><p className="font-bold">{m.name} <span className="font-normal text-gray-500 text-sm">({m.email}{m.phone ? ' · ' + m.phone : ''})</span></p><span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span></div>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
                  <div className="flex gap-3 mt-3"><a href={'mailto:' + m.email} className="text-maroon text-sm font-semibold underline">Reply by email</a><button onClick={async () => { await fetch('/api/contact?id=' + m.id, { method: 'DELETE' }); load(); }} className="text-red-600 text-sm underline">Delete</button></div>
                </div>
              ))}
            </div>
          )}

          {tab === 'settings' && (
            <div className="mt-5 space-y-5">
              <div className="bg-white rounded-xl shadow p-5"><h3 className="font-bold text-lg">Shop Settings</h3>
                <dl className="text-sm mt-3 space-y-2">
                  <div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Shop name</dt><dd className="font-semibold">Touch of Sabrina</dd></div>
                  <div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Facebook</dt><dd><a className="text-maroon underline" href="https://www.facebook.com/TouchofSabrina" target="_blank" rel="noreferrer">Touch of Sabrina</a></dd></div>
                  <div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Delivery — Inside Dhaka</dt><dd className="font-semibold">৳60</dd></div>
                  <div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Delivery — Outside Dhaka</dt><dd className="font-semibold">৳120</dd></div>
                  <div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Free delivery over</dt><dd className="font-semibold">৳3,000</dd></div>
                  <div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Payment</dt><dd className="font-semibold">COD, bKash, Nagad (manual — TrxID)</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">bKash / Nagad number</dt><dd className="font-semibold text-red-600">[Not set — Siam to replace]</dd></div>
                </dl>
                <p className="text-xs text-gray-400 mt-3">To change delivery charges or payment numbers, edit them in the code (lib/store.js for shipping, app/checkout/page.jsx for payment numbers) — or ask the developer chat.</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm"><h3 className="font-bold">Before going live</h3><ul className="list-disc pl-5 mt-2 space-y-1"><li>Change the demo admin password (admin123) and the demo customer password.</li><li>Replace sample prices and Unsplash photos with real ones.</li><li>Replace the placeholder bKash / Nagad number with your real number.</li><li>Admin login here is a demo (browser-only) — replace with real server login before production.</li></ul></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
