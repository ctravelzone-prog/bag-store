'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
export default function ShopClient() {
  const sp = useSearchParams();
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(sp.get('category') || 'All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState(sp.get('sort') || 'popular');
  useEffect(() => { fetch('/api/products').then(r => r.json()).then(setProducts); }, []);
  useEffect(() => { if (sp.get('category')) setCat(sp.get('category')); if (sp.get('sort')) setSort(sp.get('sort')); }, [sp]);
  const cats = ['All', ...new Set(products.map(p => p.category))];
  const filtered = useMemo(() => {
    let list = products.filter(p => (cat === 'All' || p.category === cat) && p.price <= maxPrice && (p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())));
    if (sort === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') list = [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (sort === 'popular') list = [...list].sort((a, b) => b.reviewsCount - a.reviewsCount);
    return list;
  }, [products, q, cat, maxPrice, sort]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl md:text-4xl font-bold">Shop All Bags</h1>
      <p className="text-gray-500 text-sm mt-1">{filtered.length} product(s) found. Prices shown are sample prices.</p>
      <div className="bg-white rounded-xl shadow p-4 mt-5 grid md:grid-cols-4 gap-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search bags... (e.g. Bow, Tote)" className="border rounded-lg px-3 py-2 w-full" />
        <select value={cat} onChange={e => setCat(e.target.value)} className="border rounded-lg px-3 py-2 w-full">{cats.map(c => <option key={c}>{c}</option>)}</select>
        <label className="border rounded-lg px-3 py-2 w-full text-sm">Max price: ৳{maxPrice.toLocaleString()}<input type="range" min="1500" max="5000" step="50" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full" /></label>
        <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded-lg px-3 py-2 w-full">
          <option value="popular">Sort: Most Popular</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="newest">Newest First</option>
        </select>
      </div>
      {filtered.length === 0 ? <p className="text-center py-16 text-gray-500">No bags match your search. Try a different keyword or clear the filters.</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">{filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
