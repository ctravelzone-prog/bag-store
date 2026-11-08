import { Suspense } from 'react';
import OrderSuccessClient from '../../components/OrderSuccessClient';
export const metadata = { title: 'Order Placed — Touch of Sabrina', description: 'Your order is confirmed. View and print your invoice.' };
export default function Page() { return <Suspense fallback={<p className="text-center py-16">Loading...</p>}><OrderSuccessClient /></Suspense>; }
