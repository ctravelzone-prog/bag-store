import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div><h3 className="font-serif text-xl text-white">Touch of <span className="text-gold">Sabrina</span></h3><p className="mt-2">Luxury women&apos;s bags — elegant, premium and made to be loved.</p><a className="text-gold underline block mt-3" href="https://www.facebook.com/TouchofSabrina" target="_blank" rel="noreferrer">Facebook: Touch of Sabrina</a></div>
        <div><h4 className="text-white font-semibold mb-2">Shop</h4><Link className="block hover:text-gold" href="/shop">All Bags</Link><Link className="block hover:text-gold" href="/shop?category=Handbag">Handbags</Link><Link className="block hover:text-gold" href="/shop?category=Tote">Totes</Link><Link className="block hover:text-gold" href="/shop?category=Backpack">Backpacks</Link></div>
        <div><h4 className="text-white font-semibold mb-2">Help</h4><Link className="block hover:text-gold" href="/orders">Track My Order</Link><Link className="block hover:text-gold" href="/cart">My Cart</Link><Link className="block hover:text-gold" href="/checkout">Checkout</Link><p className="mt-2">Delivery: Inside Dhaka ৳60, Outside Dhaka ৳120, Free over ৳3,000.</p></div>
        <div><h4 className="text-white font-semibold mb-2">Payment</h4><p>Cash on Delivery, bKash &amp; Nagad (manual — TrxID needed).</p><p className="mt-2 text-xs text-gray-500">All prices in BDT (৳). Product prices shown are SAMPLE — final prices are set by the shop owner.</p></div>
      </div>
      <div className="border-t border-gray-800 text-center text-xs py-4">© 2026 Touch of Sabrina. All rights reserved.</div>
    </footer>
  );
}
