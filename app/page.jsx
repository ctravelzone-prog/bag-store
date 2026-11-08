import { readJson } from '../lib/store';
import Home from '../components/HomeClient';
export const metadata = { title: 'Touch of Sabrina — Luxury Women\'s Bags', description: 'Shop luxury handbags, totes, shoulder bags, crossbody & backpacks from Touch of Sabrina. COD, bKash & Nagad. Delivery across Bangladesh.' };
export default function Page() {
  const products = readJson('products.json');
  return <Home products={products} />;
}
