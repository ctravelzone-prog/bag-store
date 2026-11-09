'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/cart';
import ProductImage from './ProductImage';
import ProductCard from './ProductCard';
import { IconHeart, IconHeartFilled, IconShoppingBag, IconTruck, IconCreditCard, Stars } from './Icons';
import { discountOf } from './ProductCard';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
export default function ProductDetail({ p, related }) {
  const { add, toggleFav, isFav } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(p.colors?.[0] || '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState('');
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [rmsg, setRmsg] = useState('');
  useEffect(() => { fetch('/api/reviews?slug=' + p.slug).then(r => r.json()).then(setReviews); }, [p.slug]);
  const out = p.stock <= 0;
  const disc = discountOf(p);
  function doAdd() { if (out) return; add(p, qty, color); setAdded('Added to your bag'); setTimeout(() => setAdded(''), 2000); }
  function buyNow() { if (out) return; add(p, qty, color); router.push('/checkout'); }
  async function submitReview(e) {
    e.preventDefault(); setRmsg('');
    const r = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, slug: p.slug }) });
    if (r.ok) { const d = await r.json(); setReviews([...reviews, d]); setForm({ name: '', rating: 5, comment: '' }); setRmsg('Thank you! Your review is live.'); } else { const d = await r.json(); setRmsg(d.error || 'Could not save review.'); }
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/shop" className="text-sm text-maroon">← Back to Shop</Link>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div>{p.video && <video src={p.video} controls muted loop playsInline className="w-full h-96 object-cover rounded-2xl shadow bg-black" />}
          {p.image && <ProductImage src={p.image} alt={p.name} className={'w-full h-96 object-cover rounded-2xl shadow' + (p.video ? ' mt-3' : '')} />}
          {!p.image && !p.video && <ProductImage src={p.image} alt={p.name} className="w-full h-96 object-cover rounded-2xl shadow" />}
          <p className="text-xs text-gray-400 mt-2">Sample product photo (Unsplash). Replace with your real product photo in Admin → Products.</p></div>
        <div>
          <p className="text-sm text-maroon font-semibold uppercase">{p.category}</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mt-1">{p.name}</h1>
          <p className="mt-2 flex items-center gap-1.5"><Stars rating={p.rating} /> <span className="text-gray-400 text-sm">({p.reviewsCount + reviews.length} reviews)</span></p>
          <div className="flex items-baseline gap-3 mt-3"><span className="text-3xl font-bold text-maroon">{formatBDT(p.price)}</span>{p.oldPrice && <><span className="text-gray-400 line-through">{formatBDT(p.oldPrice)}</span><span className="bg-gold text-black text-xs font-bold px-2 py-1 rounded">Save {disc}%</span></>}</div>
          <p className="text-xs text-gray-400 mt-1">Sample price — final price is set by the shop owner.</p>
          <p className="mt-3">{out ? <span className="text-red-600 font-semibold">Out of Stock</span> : p.stock <= 3 ? <span className="text-red-600 font-semibold">Only {p.stock} left in stock — order soon!</span> : <span className="text-green-700 font-semibold">In Stock ({p.stock} available)</span>}</p>
          <p className="text-gray-700 mt-4">{p.description}</p>
          <div className="mt-5"><p className="font-semibold text-sm">Colour</p><div className="flex gap-2 mt-2 flex-wrap">{p.colors.map(c => <button key={c} onClick={() => setColor(c)} className={'px-4 py-2 rounded-full border text-sm ' + (color === c ? 'bg-maroon text-white border-maroon' : 'bg-white')}>{c}</button>)}</div></div>
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <label className="font-semibold text-sm">Qty:</label>
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 border rounded-lg bg-white">−</button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <button onClick={() => setQty(Math.min(p.stock || 99, qty + 1))} className="w-9 h-9 border rounded-lg bg-white">+</button>
          </div>
          <div className="mt-6 flex gap-3 flex-wrap">
            <button onClick={doAdd} disabled={out} className="flex-1 min-w-40 bg-maroon text-white font-bold py-3 rounded-full disabled:bg-gray-300 flex items-center justify-center gap-2"><IconShoppingBag size={19} /> Add to Bag</button>
            <button onClick={() => toggleFav(p)} aria-label="Toggle favourite" className={'px-4 py-3 rounded-full border font-semibold flex items-center gap-2 ' + (isFav(p.slug) ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300')}>{isFav(p.slug) ? <IconHeartFilled size={19} className="text-red-600" /> : <IconHeart size={19} />}{isFav(p.slug) ? 'Saved' : 'Save'}</button>
            <button onClick={buyNow} disabled={out} className="flex-1 min-w-40 bg-gold text-black font-bold py-3 rounded-full disabled:bg-gray-300">Buy Now</button>
          </div>
          {added && <p className="text-green-700 font-semibold mt-3">{added}</p>}
          <div className="bg-maroon-soft rounded-xl p-4 mt-6 text-sm space-y-1"><p className="flex items-center gap-2"><IconTruck size={16} className="text-maroon" /> Delivery: Inside Dhaka ৳60, Outside Dhaka ৳120, Free over ৳3,000 (2–3 days).</p><p className="flex items-center gap-2"><IconCreditCard size={16} className="text-maroon" /> Payment: Cash on Delivery, bKash, Nagad.</p></div>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold">Customer Reviews ({reviews.length})</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {reviews.length === 0 ? <p className="text-gray-500">No reviews yet — be the first to review this bag!</p> : reviews.map(r => <div key={r.id} className="bg-white rounded-xl p-4 shadow"><Stars rating={r.rating} /><p className="mt-1">{r.comment}</p><p className="text-sm text-gray-500 mt-2">— {r.name} · {r.date}</p></div>)}
        </div>
        <form onSubmit={submitReview} className="bg-white rounded-xl p-5 shadow mt-6 max-w-xl">
          <h3 className="font-bold">Write a Review</h3>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your name" className="border rounded-lg px-3 py-2 w-full mt-3" />
          <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="border rounded-lg px-3 py-2 w-full mt-2"><option value={5}>5 stars — Excellent</option><option value={4}>4 stars — Very good</option><option value={3}>3 stars — Good</option><option value={2}>2 stars — Okay</option><option value={1}>1 star — Poor</option></select>
          <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} required placeholder="How was the bag?" className="border rounded-lg px-3 py-2 w-full mt-2" rows={3} />
          <button className="bg-maroon text-white font-semibold px-5 py-2 rounded-full mt-3">Submit Review</button>
          {rmsg && <p className="text-green-700 text-sm mt-2">{rmsg}</p>}
        </form>
      </section>
      <section className="mt-12"><h2 className="font-serif text-2xl font-bold">Related Bags</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">{related.map(x => <ProductCard key={x.id} p={x} />)}</div></section>
    </div>
  );
}
