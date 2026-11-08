import Link from 'next/link';
import ProductImage from './ProductImage';
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
export default function ProductCard({ p }) {
  const out = p.stock <= 0;
  const low = !out && p.stock <= 3;
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition border border-gray-100 flex flex-col">
      <Link href={'/product/' + p.slug} className="relative block">
        <ProductImage src={p.image} alt={p.name} className="w-full h-56 object-cover" />
        {disc > 0 && <span className="absolute top-2 left-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">-{disc}%</span>}
        {out && <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">Out of Stock</span>}
        {low && <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Only {p.stock} left</span>}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-maroon font-semibold uppercase tracking-wide">{p.category}</p>
        <Link href={'/product/' + p.slug}><h3 className="font-semibold mt-1 hover:text-maroon">{p.name}</h3></Link>
        <p className="text-sm text-yellow-600 mt-1">★ {p.rating} <span className="text-gray-400">({p.reviewsCount} reviews)</span></p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-maroon">{formatBDT(p.price)}</span>
          {p.oldPrice && <span className="text-sm text-gray-400 line-through">{formatBDT(p.oldPrice)}</span>}
        </div>
        <Link href={'/product/' + p.slug} className={'mt-3 text-center rounded-lg py-2 text-sm font-semibold ' + (out ? 'bg-gray-200 text-gray-500 pointer-events-none' : 'bg-maroon text-white hover:bg-maroon-light')}>
          {out ? 'Out of Stock' : 'View Details'}
        </Link>
      </div>
    </div>
  );
}
