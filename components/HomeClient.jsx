'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductImage from './ProductImage';
import { IconChevronLeft, IconChevronRight, IconTruck, IconShield, IconCreditCard, CategoryIcon, Stars } from './Icons';
const SLIDES = [
  { headline: 'Handbags that speak elegance', sub: 'The Bow Bag — our most loved piece, now in maroon, black and beige.', cta: 'Shop the Bow Bag', href: '/product/bow-bag' },
  { headline: 'New season, new shine', sub: 'Fresh whites and gold clasps — the CD White Bag is back in stock.', cta: 'Shop White Bags', href: '/shop?category=Shoulder Bag' },
  { headline: 'Carry everything, beautifully', sub: 'The Classic Tote — laptop, wallet, phone and more, in one elegant bag.', cta: 'Shop Totes', href: '/shop?category=Tote' },
];
export default function Home({ products, categories = [] }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const featured = products.filter(p => p.featured);
  const best = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 4);
  const slides = SLIDES.map((s, i) => ({ ...s, image: products[i]?.image || products[0]?.image }));
  const cats = (categories.length ? categories : [{ name: 'Handbag' }, { name: 'Tote' }, { name: 'Shoulder Bag' }, { name: 'Crossbody' }, { name: 'Backpack' }]).map(c => [c.name, '/shop?category=' + encodeURIComponent(c.name)]);
  useEffect(() => { if (paused) return; const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000); return () => clearInterval(t); }, [paused, slides.length]);
  function onTouchStart(e) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e) { if (touchX.current == null) return; const dx = e.changedTouches[0].clientX - touchX.current; if (dx < -40) setSlide(s => (s + 1) % slides.length); if (dx > 40) setSlide(s => (s - 1 + slides.length) % slides.length); touchX.current = null; }
  async function subscribe(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (r.ok) { setMsg('Thank you! You are subscribed.'); setEmail(''); } else { const d = await r.json(); setMsg(d.error || 'Please enter a valid email.'); }
  }
  return (
    <div>
      {/* Hero slider */}
      <section className="bg-gradient-to-br from-maroon via-maroon-light to-black text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div key={slide}>
              <p className="text-gold tracking-widest text-sm">LUXURY WOMEN&apos;S BAGS</p>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mt-3 leading-tight">{slides[slide].headline}</h1>
              <p className="mt-4 text-gray-200 text-lg">{slides[slide].sub}</p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link href={slides[slide].href} className="bg-gold text-black font-bold px-6 py-3 rounded-full">{slides[slide].cta}</Link>
                <Link href="/shop" className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-maroon">Shop All Bags</Link>
              </div>
              <p className="mt-4 text-sm text-gray-300">Cash on Delivery &nbsp;·&nbsp; bKash / Nagad &nbsp;·&nbsp; Free delivery over ৳3,000</p>
            </div>
            <div className="relative">
              <ProductImage src={slides[slide].image} alt={slides[slide].headline} className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-2xl border-4 border-gold/40" />
              <button onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"><IconChevronLeft size={22} /></button>
              <button onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"><IconChevronRight size={22} /></button>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, i) => (<button key={i} onClick={() => setSlide(i)} aria-label={'Go to slide ' + (i + 1)} className={'h-2.5 rounded-full transition-all ' + (i === slide ? 'bg-gold w-8' : 'bg-white/40 w-2.5')} />))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 mt-8">
          {cats.map(([c, href]) => { const img = products.find(x => x.category === c)?.image; return (<Link key={c} href={href} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white"><div className="h-44 md:h-52 overflow-hidden">{img ? <ProductImage src={img} alt={c} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : <div className="w-full h-full bg-maroon-soft flex items-center justify-center"><CategoryIcon name={c} size={36} className="text-maroon" /></div>}</div><div className="p-4 text-center"><span className="font-serif font-bold text-lg text-gray-900">{c}</span><span className="block text-xs text-gray-500 mt-0.5">View collection</span></div></Link>); })}
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
          <div className="bg-white rounded-xl p-6 shadow"><span className="flex justify-center text-maroon"><IconTruck size={30} /></span><h3 className="font-bold text-lg mt-2">Fast Delivery</h3><p className="text-sm text-gray-600 mt-2">Inside Dhaka ৳60, Outside Dhaka ৳120. Free over ৳3,000.</p></div>
          <div className="bg-white rounded-xl p-6 shadow"><span className="flex justify-center text-maroon"><IconCreditCard size={30} /></span><h3 className="font-bold text-lg mt-2">Easy Payment</h3><p className="text-sm text-gray-600 mt-2">Cash on Delivery, bKash &amp; Nagad. Pay the way you like.</p></div>
          <div className="bg-white rounded-xl p-6 shadow"><span className="flex justify-center text-maroon"><IconShield size={30} /></span><h3 className="font-bold text-lg mt-2">Premium Quality</h3><p className="text-sm text-gray-600 mt-2">Checked before packing. Easy exchange if damaged.</p></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-center">What Customers Say <span className="text-sm text-gray-400 font-sans">(sample reviews)</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[['Bag ta onek sundor, quality premium.', 'Ayesha R.'], ['Delivery fast chilo, packing khub valo.', 'Nusrat J.'], ['White bag ta luxury lagche, gold clasp classy.', 'Taniya S.']].map(([t, n]) => (
            <blockquote key={n} className="bg-white rounded-xl p-5 shadow"><Stars rating={5} /><p className="mt-2">“{t}”</p><footer className="mt-2 text-sm text-maroon font-semibold">— {n}</footer></blockquote>
          ))}
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
