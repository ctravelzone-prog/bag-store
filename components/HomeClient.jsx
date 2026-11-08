'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductImage from './ProductImage';
export default function Home({ products }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const featured = products.filter(p => p.featured);
  const best = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 4);
  const cats = [['Handbag', '/shop?category=Handbag'], ['Tote', '/shop?category=Tote'], ['Shoulder Bag', '/shop?category=Shoulder Bag'], ['Crossbody', '/shop?category=Crossbody'], ['Backpack', '/shop?category=Backpack']];
  async function subscribe(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (r.ok) { setMsg('Thank you! You are subscribed.'); setEmail(''); } else { const d = await r.json(); setMsg(d.error || 'Please enter a valid email.'); }
  }
  return (
    <div>
      <section className="bg-gradient-to-br from-maroon via-maroon-light to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold tracking-widest text-sm">LUXURY WOMEN&apos;S BAGS</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mt-3 leading-tight">Touch of Sabrina</h1>
            <p className="mt-4 text-gray-200 text-lg">Elegant handbags, totes &amp; shoulder bags — premium quality, honest prices, delivered across Bangladesh.</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link href="/shop" className="bg-gold text-black font-bold px-6 py-3 rounded-full">Shop Now →</Link>
              <Link href="/shop?sort=price-low" className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-maroon">Best Deals</Link>
            </div>
            <p className="mt-4 text-sm text-gray-300">✓ Cash on Delivery &nbsp; ✓ bKash / Nagad &nbsp; ✓ Free delivery over ৳3,000</p>
          </div>
          <ProductImage src={products[0]?.image} alt="Bow Bag — Touch of Sabrina" className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-2xl border-4 border-gold/40" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {cats.map(([c, href]) => (<Link key={c} href={href} className="bg-white rounded-xl shadow p-5 text-center hover:shadow-lg border-t-4 border-gold"><span className="font-semibold text-maroon">{c}</span><span className="block text-xs text-gray-500 mt-1">View collection →</span></Link>))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="font-serif text-3xl font-bold">Featured Bags</h2>
        <p className="text-gray-500 text-sm mt-1">Hand-picked favourites from Touch of Sabrina. Prices shown are sample prices.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">{featured.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-serif text-3xl font-bold">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">{best.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="bg-maroon-soft">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 shadow"><h3 className="font-bold text-lg">🚚 Fast Delivery</h3><p className="text-sm text-gray-600 mt-2">Inside Dhaka ৳60, Outside Dhaka ৳120. Free over ৳3,000.</p></div>
          <div className="bg-white rounded-xl p-6 shadow"><h3 className="font-bold text-lg">💰 Easy Payment</h3><p className="text-sm text-gray-600 mt-2">Cash on Delivery, bKash &amp; Nagad. Pay the way you like.</p></div>
          <div className="bg-white rounded-xl p-6 shadow"><h3 className="font-bold text-lg">✨ Premium Quality</h3><p className="text-sm text-gray-600 mt-2">Checked before packing. Easy exchange if damaged.</p></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-center">What Customers Say <span className="text-sm text-gray-400 font-sans">(sample reviews)</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <blockquote className="bg-white rounded-xl p-5 shadow">“Bag ta onek sundor, quality premium.”<footer className="mt-2 text-sm text-maroon font-semibold">— Ayesha R. ★★★★★</footer></blockquote>
          <blockquote className="bg-white rounded-xl p-5 shadow">“Delivery fast chilo, packing khub valo.”<footer className="mt-2 text-sm text-maroon font-semibold">— Nusrat J. ★★★★★</footer></blockquote>
          <blockquote className="bg-white rounded-xl p-5 shadow">“White bag ta luxury lagche, gold clasp classy.”<footer className="mt-2 text-sm text-maroon font-semibold">— Taniya S. ★★★★★</footer></blockquote>
        </div>
        <form onSubmit={subscribe} className="bg-maroon text-white rounded-2xl p-6 md:p-8 mt-10 text-center">
          <h3 className="font-serif text-2xl font-bold">Get 10% Off Your First Order</h3>
          <p className="text-sm text-gray-200 mt-1">Join the list &amp; use code <b className="text-gold">WELCOME10</b> at checkout.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-4">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Your email address" className="flex-1 rounded-full px-4 py-2.5 text-black" />
            <button className="bg-gold text-black font-bold px-6 py-2.5 rounded-full">Subscribe</button>
          </div>
          {msg && <p className="mt-3 text-sm text-gold">{msg}</p>}
        </form>
      </section>
    </div>
  );
}
