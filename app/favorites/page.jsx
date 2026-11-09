'use client';
import Link from 'next/link';
import { useCart } from '../../lib/cart';
import ProductImage from '../../components/ProductImage';
import { IconHeartFilled, IconShoppingBag } from '../../components/Icons';
import { formatBDT } from '../../components/ProductCard';
export default function FavoritesPage() {
  const { favs, toggleFav, add, user } = useCart();
  if (favs.length === 0) return (<div className="max-w-3xl mx-auto px-4 py-16 text-center"><IconHeartFilled size={48} className="mx-auto text-gray-300" /><h1 className="font-serif text-3xl font-bold mt-4">Your Favourites</h1><p className="text-gray-500 mt-2">Tap the heart on any bag to save it here.{user ? '' : ' Log in and your favourites will follow you on any device.'}</p><Link href="/shop" className="inline-block bg-maroon text-white font-bold px-6 py-3 rounded-full mt-6">Shop Bags</Link></div>);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">My Favourites ({favs.length})</h1>
      <p className="text-sm text-gray-500 mt-1">{user ? 'Saved to your account — visible on any device.' : 'Saved in this browser only — log in to keep them on any device.'}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {favs.map(f => (
          <div key={f.slug} className="bg-white rounded-xl overflow-hidden shadow border border-gray-100 flex flex-col">
            <Link href={'/product/' + f.slug}><ProductImage src={f.image} alt={f.name} className="w-full h-52 object-cover" /></Link>
            <div className="p-4 flex flex-col flex-1">
              <Link href={'/product/' + f.slug} className="font-semibold hover:text-maroon">{f.name}</Link>
              <p className="text-lg font-bold text-maroon mt-1">{formatBDT(f.price)}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => add({ slug: f.slug, name: f.name, price: f.price, image: f.image, colors: [f.color || 'Black'] }, 1, f.color)} className="flex-1 bg-maroon text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5"><IconShoppingBag size={16} /> Add to Bag</button>
                <button onClick={() => toggleFav({ slug: f.slug, name: f.name, price: f.price, image: f.image })} aria-label="Remove from favourites" className="px-3 py-2 border rounded-lg text-red-600"><IconHeartFilled size={17} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
