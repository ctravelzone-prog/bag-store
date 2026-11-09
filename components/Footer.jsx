import Link from 'next/link';
import { LogoLight } from './Logo';
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1"><LogoLight size={40} /><p className="mt-3 leading-relaxed">Luxury women&apos;s bags — elegant, premium and made to be loved.</p></div>
        <div><h4 className="text-gray-900 font-semibold mb-3">Shop</h4><Link className="block py-1 hover:text-maroon" href="/shop">All Bags</Link><Link className="block py-1 hover:text-maroon" href="/shop?category=Handbag">Handbags</Link><Link className="block py-1 hover:text-maroon" href="/shop?category=Tote">Totes</Link><Link className="block py-1 hover:text-maroon" href="/favorites">My Favourites</Link></div>
        <div><h4 className="text-gray-900 font-semibold mb-3">Help</h4><Link className="block py-1 hover:text-maroon" href="/contact">Contact Us</Link><Link className="block py-1 hover:text-maroon" href="/orders">Track Order</Link><Link className="block py-1 hover:text-maroon" href="/cart">My Bag</Link><p className="py-1">Delivery: Inside Dhaka ৳60, Outside Dhaka ৳120, Free over ৳3,000.</p></div>
        <div><h4 className="text-gray-900 font-semibold mb-3">Follow</h4><a className="block py-1 text-maroon font-semibold hover:underline" href="https://www.facebook.com/TouchofSabrina" target="_blank" rel="noreferrer">Facebook — Touch of Sabrina</a><p className="py-1">Cash on Delivery, bKash &amp; Nagad.</p><p className="text-xs text-gray-400 mt-2">All prices in BDT (৳). Prices shown are sample prices set by the shop owner.</p></div>
      </div>
      <div className="border-t border-gray-100 text-center text-xs py-5 text-gray-400">© 2026 Touch of Sabrina. All rights reserved.</div>
    </footer>
  );
}
