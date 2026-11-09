import Link from 'next/link';
import { IconTruck, IconShield, IconCreditCard } from '../../components/Icons';
export const metadata = { title: 'About — Touch of Sabrina', description: 'About Touch of Sabrina — luxury women\'s bags, delivered across Bangladesh.' };
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-center">About Touch of Sabrina</h1>
      <p className="text-gray-600 leading-relaxed mt-6 text-center">Touch of Sabrina is a bag shop for women who love elegant, premium bags — handbags, totes, shoulder bags, crossbody bags and backpacks, chosen with care and checked before packing.</p>
      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center"><span className="flex justify-center text-maroon"><IconTruck size={28} /></span><h3 className="font-bold mt-2">Fast Delivery</h3><p className="text-sm text-gray-500 mt-1">Inside Dhaka ৳60, Outside Dhaka ৳120. Free over ৳3,000.</p></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center"><span className="flex justify-center text-maroon"><IconShield size={28} /></span><h3 className="font-bold mt-2">Premium Quality</h3><p className="text-sm text-gray-500 mt-1">Every bag is checked before it is packed and sent.</p></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center"><span className="flex justify-center text-maroon"><IconCreditCard size={28} /></span><h3 className="font-bold mt-2">Easy Payment</h3><p className="text-sm text-gray-500 mt-1">Cash on Delivery, bKash and Nagad.</p></div>
      </div>
      <div className="text-center mt-10"><Link href="/shop" className="inline-block bg-maroon text-white font-bold px-8 py-3 rounded-full">Shop All Bags</Link><Link href="/contact" className="inline-block border border-maroon text-maroon font-bold px-8 py-3 rounded-full ml-3">Contact Us</Link></div>
    </div>
  );
}
