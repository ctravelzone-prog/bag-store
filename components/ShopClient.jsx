'use client';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { CategoryIcon, IconSearch, IconX } from './Icons';
function ShopInner() {
  const sp = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(sp.get('category') || 'All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState(sp.get('sort') || 'popular');
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => { fetch('/api/products').then(r => r.json()).then(setProducts); fetch('/api/categories').then(r => r.json()).then(setCategories); }, []);
  useEffect(() => { if (sp.get('category')) setCat(sp.get('category')); if (sp.get('sort')) setSort(sp.get('sort')); }, [sp]);
  const cats = ['All', ...categories.map(c => c.name)];
  const countFor = (c) => c === 'All' ? products.length : products.filter(p => p.category === c).length;
  const filtered = useMemo(() => {
    let list = products.filter(p => (cat === 'All' || p.category === cat) && p.price <= maxPrice && (p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())));
    if (sort === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') list = [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (sort === 'popular') list = [...list].sort((a, b) => b.reviewsCount - a.reviewsCount);
    return list;
  }, [products, q, cat, maxPrice, sort]);
  const sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg">Categories</h3>
        <ul className="mt-3 space-y-1">
          {cats.map(c => (<li key={c}><button onClick={() => { setCat(c); setFiltersOpen(false); }} className={'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ' + (cat === c ? 'bg-maroon text-white' : 'hover:bg-gray-100')}><span className="flex items-center gap-2"><CategoryIcon name={c} size={17} />{c}</span><span className={'text-xs px-2 py-0.5 rounded-full ' + (cat === c ? 'bg-white/20' : 'bg-gray-100')}>{countFor(c)}</span></button></li>))}
        </ul>
      </div>
      <div>
        <h3 className="font-serif font-bold text-lg">Max Price</h3>
        <p className="text-sm text-gray-500 mt-1">Up to ৳{maxPrice.toLocaleString()}</p>
        <input type="range" min="1500" max="5000" step="50" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full mt-2" aria-label="Maximum price" />
        <div className="flex justify-between text-xs text-gray-400"><span>৳1,500</span><span>৳5,000</span></div>
      </div>
      <div>
        <h3 className="font-serif font-bold text-lg">Sort By</h3>
        <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 w-full mt-2 bg-white">
          <option value="popular">Most Popular</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="newest">Newest First</option>
        </select>
      </div>
      <button onClick={() => { setCat('All'); setQ(''); setMaxPrice(5000); setSort('popular'); }} className="text-sm text-maroon font-semibold underline">Clear all filters</button>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl md:text-4xl font-bold">Shop All Bags</h1>
      <p className="text-gray-500 text-sm mt-1">{filtered.length} product(s) found. Prices shown are sample prices.</p>
      <div className="flex gap-3 mt-6">
        <label className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5"><IconSearch size={18} className="text-gray-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search bags... (e.g. Bow, Tote)" className="flex-1 outline-none bg-transparent" /></label>
        <button onClick={() => setFiltersOpen(true)} className="lg:hidden bg-white border border-gray-200 rounded-full px-5 py-2.5 font-semibold text-sm">Filters</button>
      </div>
      <div className="flex gap-8 mt-8 items-start">
        <aside className="hidden lg:block w-60 shrink-0 bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">{sidebar}</aside>
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? <p className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100">No bags match your search. Try a different keyword or clear the filters.</p> : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">{filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
          )}
        </div>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-5 overflow-y-auto">
            <div className="flex justify-between items-center"><h2 className="font-serif font-bold text-xl">Filters</h2><button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-2 rounded-full hover:bg-gray-100"><IconX size={20} /></button></div>
            <div className="mt-4">{sidebar}</div>
            <button onClick={() => setFiltersOpen(false)} className="w-full bg-maroon text-white font-bold py-3 rounded-full mt-6">Show {filtered.length} Result(s)</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default function ShopClient() { return <Suspense fallback={<p className="text-center py-16">Loading bags...</p>}><ShopInner /></Suspense>; }
