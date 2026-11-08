import { notFound } from 'next/navigation';
import { readJson } from '../../../lib/store';
import ProductDetail from '../../../components/ProductDetail';
export async function generateStaticParams() { return readJson('products.json').map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }) {
  const p = readJson('products.json').find(x => x.slug === params.slug);
  return p ? { title: p.name + ' — Touch of Sabrina', description: p.description } : { title: 'Product Not Found — Touch of Sabrina' };
}
export default function Page({ params }) {
  const products = readJson('products.json');
  const p = products.find(x => x.slug === params.slug);
  if (!p) notFound();
  const related = products.filter(x => x.slug !== p.slug && x.category === p.category).slice(0, 4);
  const rel2 = related.length ? related : products.filter(x => x.slug !== p.slug).slice(0, 4);
  return <ProductDetail p={p} related={rel2} />;
}
