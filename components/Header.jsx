'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../lib/cart';
import { LogoLight } from './Logo';
import { IconShoppingBag, IconHeart, IconUser, IconLogOut, IconMenu, IconX, IconSearch } from './Icons';
export default function Header() {
  const { count, favs, user, logoutUser } = useCart();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
        <Link href="/" aria-label="Touch of Sabrina — home" className="shrink-0"><LogoLight size={40} /></Link>
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          <Link href="/" className="hover:text-maroon">Home</Link>
          <Link href="/shop" className="hover:text-maroon">Shop</Link>
          <Link href="/about" className="hover:text-maroon">About</Link>
          <Link href="/contact" className="hover:text-maroon">Contact Us</Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/shop" className="p-2.5 rounded-full hover:bg-gray-100" aria-label="Search bags"><IconSearch size={20} /></Link>
          <Link href="/favorites" className="relative p-2.5 rounded-full hover:bg-gray-100" aria-label="My favourites"><IconHeart size={20} />{favs.length > 0 && <span className="absolute top-0.5 right-0.5 bg-maroon text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{favs.length}</span>}</Link>
          <Link href="/cart" className="relative p-2.5 rounded-full hover:bg-gray-100" aria-label="Shopping bag"><IconShoppingBag size={20} />{count > 0 && <span className="absolute top-0.5 right-0.5 bg-gold text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{count}</span>}</Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full hover:bg-gray-100 font-semibold text-sm">
                <span className="w-8 h-8 rounded-full bg-maroon text-white flex items-center justify-center text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                <span className="hidden sm:inline max-w-24 truncate">{user.name.split(' ')[0]}</span>
              </button>
              {menu && (<div className="absolute right-0 top-12 bg-white border rounded-xl shadow-xl w-52 py-2 z-50 text-sm">
                <Link href="/account" onClick={() => setMenu(false)} className="block px-4 py-2.5 hover:bg-gray-50">My Account</Link>
                <Link href="/orders" onClick={() => setMenu(false)} className="block px-4 py-2.5 hover:bg-gray-50">My Orders</Link>
                <Link href="/favorites" onClick={() => setMenu(false)} className="block px-4 py-2.5 hover:bg-gray-50">My Favorites</Link>
                <button onClick={() => { logoutUser(); setMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-red-600 flex items-center gap-2"><IconLogOut size={16} /> Logout</button>
              </div>)}
            </div>
          ) : (
            <span className="hidden sm:flex items-center gap-3 ml-1">
              <Link href="/login" className="font-semibold text-sm hover:text-maroon">Login</Link>
              <Link href="/signup" className="bg-maroon text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-maroon-light">Sign Up</Link>
            </span>
          )}
          <button className="md:hidden p-2.5 rounded-full hover:bg-gray-100" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <IconX size={22} /> : <IconMenu size={22} />}</button>
        </div>
      </div>
      {open && (<nav className="md:hidden border-t border-gray-100 px-4 py-2 flex flex-col text-[15px] font-medium bg-white">
        <Link href="/" onClick={() => setOpen(false)} className="py-3 border-b border-gray-100">Home</Link>
        <Link href="/shop" onClick={() => setOpen(false)} className="py-3 border-b border-gray-100">Shop</Link>
        <Link href="/about" onClick={() => setOpen(false)} className="py-3 border-b border-gray-100">About</Link>
        <Link href="/contact" onClick={() => setOpen(false)} className="py-3 border-b border-gray-100">Contact Us</Link>
        <Link href="/orders" onClick={() => setOpen(false)} className="py-3 border-b border-gray-100">Track Order</Link>
        {!user && (<><Link href="/login" onClick={() => setOpen(false)} className="py-3 border-b border-gray-100">Login</Link><Link href="/signup" onClick={() => setOpen(false)} className="py-3 font-semibold text-maroon">Sign Up</Link></>)}
      </nav>)}
    </header>
  );
}
