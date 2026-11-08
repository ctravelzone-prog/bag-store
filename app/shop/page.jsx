import { Suspense } from 'react';
import ShopClient from '../../components/ShopClient';
export const metadata = { title: 'Shop All Bags — Touch of Sabrina', description: 'Browse all luxury bags — search, filter by category and price, sort by popularity or price.' };
export default function Page() { return <Suspense fallback={<p className="text-center py-16">Loading bags...</p>}><ShopClient /></Suspense>; }
