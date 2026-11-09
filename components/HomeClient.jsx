'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductImage from './ProductImage';
import { IconChevronLeft, IconChevronRight, IconTruck, IconShield, IconCreditCard, CategoryIcon, Stars } from './Icons';
const SLIDES = [
  { headline: (<>Elegance, in<br />every <em className="italic font-normal text-gold">carry.</em></>), alt: 'Elegance, in every carry.', sub: 'Quiet luxury, made for every day — handbags in soft neutrals, warm tan and classic black.', cta: 'Shop Handbags', href: '/shop?category=Handbag', image: 'https://images.pexels.com/photos/8989582/pexels-photo-8989582.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { headline: (<>Three bags,<br />one <em className="italic font-normal text-gold">story.</em></>), alt: 'Three bags, one story.', sub: 'Handbags in soft neutrals, warm tan and classic black — pick the one that feels like you.', cta: 'Shop the Collection', href: '/shop', image: 'https://images.pexels.com/photos/7953286/pexels-photo-7953286.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { headline: (<>Bold in<br /><em className="italic font-normal text-gold">black.</em></>), alt: 'Bold in black.', sub: 'Black quilted leather, gold chain — quiet luxury with an edge.', cta: 'Shop Handbags', href: '/shop?category=Handbag', image: 'https://images.pexels.com/photos/20591025/pexels-photo-20591025.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { headline: (<>Timeless, in<br />every <em className="italic font-normal text-gold">shade.</em></>), alt: 'Timeless, in every shade.', sub: 'Rich texture, classic black — made for every day.', cta: 'Shop Handbags', href: '/shop?category=Handbag', image: 'https://images.pexels.com/photos/30975839/pexels-photo-30975839.jpeg?auto=compress&cs=tinysrgb&w=1600' },
];
export default function Home({ products, categories = [] }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const featured = products.filter(p => p.featured);
  const best = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 4);
  const slides = SLIDES;
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
      {/* Hero slider — Full Photo Hero (Concept A, user-picked) */}
      <section className="relative flex items-end text-white overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div key={slide} className="absolute inset-0">
          <ProductImage key={slides[slide].image} src={slides[slide].image} alt={slides[slide].alt} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,4,8,0.15), rgba(43,7,16,0.88))' }} />
        <span className="absolute top-5 right-5 z-10 text-[11px] tracking-[0.2em] uppercase border border-white/50 rounded-full px-3.5 py-1.5">New Season</span>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-32 pb-8 md:pt-44 md:pb-10 min-h-[480px] md:min-h-[560px] flex flex-col justify-end">
          <p className="text-gold text-[11px] md:text-sm tracking-[0.2em] md:tracking-[0.35em] uppercase font-semibold">Touch of Sabrina — Luxury Women&apos;s Bags</p>
          <h1 className="font-serif mt-4 text-[clamp(2.3rem,9vw,4.75rem)] leading-[1.02] font-medium text-[#f6ead2]">{slides[slide].headline}</h1>
          <p className="mt-4 md:mt-5 text-[#e8d5c8] text-base md:text-lg max-w-md leading-relaxed">{slides[slide].sub}</p>
          <div className="mt-6 md:mt-7 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <Link href={slides[slide].href} className="w-full md:w-auto text-center bg-gold text-[#2a0a12] font-semibold tracking-widest uppercase text-sm px-8 py-3.5 hover:brightness-110">{slides[slide].cta}</Link>
            <Link href="/shop" className="text-center md:text-left text-sm tracking-widest uppercase font-semibold underline underline-offset-8 decoration-white/40 hover:decoration-white">Shop All Bags &rarr;</Link>
          </div>
          <p className="mt-8 md:mt-10 text-[11px] md:text-xs text-[#e8d5c8] tracking-[0.2em] uppercase">Cash on Delivery <span className="text-gold mx-1">&middot;</span> bKash / Nagad <span className="text-gold mx-1">&middot;</span> Free delivery over &#2547;3,000</p>
          <div className="mt-5 md:mt-6 pt-5 border-t border-white/20 flex items-center justify-center md:justify-start gap-6">
            <button onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} aria-label="Previous slide" className="hidden md:block text-white/60 hover:text-white text-sm tracking-widest uppercase">&larr; Prev</button>
            <div className="flex gap-2">
              {slides.map((_, i) => (<button key={i} onClick={() => setSlide(i)} aria-label={'Go to slide ' + (i + 1)} className={'h-px transition-all ' + (i === slide ? 'bg-gold w-10' : 'bg-white/30 w-5')} />))}
            </div>
            <p className="font-serif text-lg text-white/60"><span className="text-white">{String(slide + 1).padStart(2, '0')}</span><span className="text-sm"> / {String(slides.length).padStart(2, '0')}</span></p>
            <button onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Next slide" className="hidden md:block text-white/60 hover:text-white text-sm tracking-widest uppercase">Next &rarr;</button>
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
