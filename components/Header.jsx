'use client';
import Link from 'next/link';
import { useCart } from '../lib/cart';
export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-50 bg-maroon text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="font-serif text-xl md:text-2xl font-bold tracking-wide">Touch of <span className="text-gold">Sabrina</span></Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="hover:text-gold">Home</Link>
          <Link href="/shop" className="hover:text-gold">Shop All Bags</Link>
          <Link href="/shop?category=Handbag" className="hover:text-gold">Handbags</Link>
          <Link href="/shop?category=Tote" className="hover:text-gold">Totes</Link>
          <Link href="/orders" className="hover:text-gold">Track Order</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/shop" className="md:hidden hover:text-gold">Shop</Link>
          <Link href="/orders" className="md:hidden hover:text-gold">Orders</Link>
          <Link href="/cart" className="relative bg-gold text-black font-semibold px-3 py-1.5 rounded-full">Cart 🛍 {count > 0 && <span className="absolute -top-2 -right-2 bg-white text-maroon text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}</Link>
        </div>
      </div>
      <div className="bg-black text-gold text-center text-xs py-1.5 px-2">Free delivery on orders over ৳3,000 &nbsp;|&nbsp; Cash on Delivery available</div>
    </header>
  );
}
